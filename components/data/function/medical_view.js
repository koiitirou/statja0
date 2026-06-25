'use client';
import React from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  LabelList,
  CartesianGrid,
} from 'recharts';
import { Box, Typography, Chip } from '@mui/material';
import Slider from '@mui/material/Slider';
import { useState, useEffect, useRef } from 'react';
import { geoCentroid } from 'd3-geo';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, Line as MapLine } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { json } from 'd3-fetch';
import { merge as topomerge } from 'topojson-client';
import { server } from '@/components/config';
import pref2 from '@/components/prefecture_list2.json';
import Link from 'next/link';

// 都道府県 ref derived client-side (kept out of per-procedure JSON to keep files small)
const PREF_REF = Object.fromEntries(
  Object.entries(pref2)
    .filter(([k]) => k !== 's00')
    .map(([k, v]) => [k, { td_name: v.tln, short_name: v.tsh }]),
);

/// Map chart colors
const color1 = [
  '#F7FBFF',
  '#DEEBF7',
  '#C6DBEF',
  '#9ECAE1',
  '#6BAED6',
  '#4292C6',
  '#2171B5',
  '#08519C',
  '#08306B',
];
const color2 = ['black', 'black', 'black', 'black', 'black', 'white', 'white', 'white', 'white'];
const geoUrl = '/comp/uniq/map.json';
const geoUrlPr2 = '/comp/uniq/iryo2.json'; // 二次医療圏 topojson（id=4桁圏コード）

// Self-contained table styles via MUI sx (Emotion injects synchronously with render,
// so the table never paints unstyled while a CSS-module chunk loads — fixes intermittent FOUC).
const INFO_TABLE_SX = {
  borderCollapse: 'collapse',
  width: '100%',
  mb: 1,
  '& th': {
    fontSize: { xs: '12px', md: '14px' },
    padding: '7px 2px',
    textAlign: 'center',
    color: 'black',
    lineHeight: '15px',
  },
  '& td': { fontSize: { xs: '12px', md: '14px' }, padding: '5px 2px', textAlign: 'right' },
  '& td:first-of-type': { textAlign: 'left', width: { md: '180px' } },
  '& tbody tr:nth-of-type(even)': { backgroundColor: '#f2f2f2' },
  '& td a': { textDecoration: 'none' },
};
const RANK_TABLE_SX = {
  borderCollapse: 'collapse',
  width: '100%',
  '& th': { fontSize: { xs: '12px', md: '14px' }, padding: '7px 2px', textAlign: 'center', lineHeight: '15px' },
  '& td': { fontSize: { xs: '12px', md: '14px' }, padding: '5px 2px', textAlign: 'right' },
  '& td:nth-of-type(1)': { textAlign: 'center' },
  '& td:nth-of-type(2)': { textAlign: 'left' },
};
const EXTRA_TABLE_SX = {
  borderCollapse: 'collapse',
  width: '100%',
  '& th': { fontSize: { xs: '11px', md: '13px' }, padding: '5px 4px', textAlign: 'center', lineHeight: '15px', borderBottom: '2px solid #ddd', whiteSpace: 'nowrap', position: 'sticky', top: 0, background: '#fff' },
  '& td': { fontSize: { xs: '11px', md: '13px' }, padding: '4px', textAlign: 'right', whiteSpace: 'nowrap' },
  '& tbody tr:nth-of-type(even)': { backgroundColor: '#f7f7f7' },
};

// クライアントCSVダウンロード（ExcelのためBOM付き）
const downloadCSV = (filename, rows) => {
  const csv = rows
    .map((r) => r.map((c) => {
      const s = String(c == null ? '' : c);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(','))
    .join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const tnum = (v) => Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 });
const yAxisFormatter = (tick) => {
  if (tick >= 1000 && tick < 1000000) return Number(tick.toPrecision(3)) / 1000 + 'K';
  if (tick >= 1000000 && tick < 1000000000) return Number(tick.toPrecision(3)) / 1000000 + 'M';
  if (tick >= 1000000000) return Number(tick.toPrecision(3)) / 1000000000 + 'B';
  return tick;
};
const okuFormatter = (tick) => {
  if (tick >= 1e12) return Number(tick.toPrecision(3)) / 1e12 + '兆';
  if (tick >= 1e8) return Number(tick.toPrecision(3)) / 1e8 + '億';
  if (tick >= 1e4) return Number(tick.toPrecision(3)) / 1e4 + '万';
  return tick;
};

const MedicalView = (props) => {
  const { mid, con_name, res2 } = props;
  const df0 = res2.def;
  const curYear = df0.yrs;

  const [isMounted, setIsMounted] = useState(false);
  // seed with the ISR current-year payload (1-element series) for instant first paint
  const [dat, setDat] = useState([{ yrs: curYear, val: res2.dat, tn: df0.ten }]);
  const [pre, setPre] = useState([{ yrs: curYear, val: res2.pre }]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // download the full multi-year time series once, then slider/charts read it locally
  useEffect(() => {
    let alive = true;
    json(`${server}/medical_ts/${mid}.json`)
      .then((col) => {
        if (!alive || !col) return;
        if (col.dat && col.dat.length) setDat(col.dat);
        if (col.pre && col.pre.length) setPre(col.pre);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [mid]);

  const marks = dat.map((d) => ({ value: Number(d.yrs) }));
  const minYear = Number(dat[dat.length - 1].yrs);
  const maxYear = Number(dat[0].yrs);

  const tenByYear = Object.fromEntries(dat.map((d) => [d.yrs, d.tn]));

  return (
    <>
      <InfoTable
        mid={mid}
        con_name={con_name}
        df0={df0}
        dat={dat}
        marks={marks}
        minYear={minYear}
        maxYear={maxYear}
        curYear={curYear}
      />

      {isMounted && <TrendLine con_name={con_name} dat={dat} />}
      {isMounted && <SalesChart con_name={con_name} dat={dat} />}
      {isMounted && <TenChart con_name={con_name} dat={dat} />}
      {isMounted && <AreaSex con_name={con_name} dat={dat} />}
      {isMounted && <MonthChart mid={mid} con_name={con_name} tenByYear={tenByYear} />}
      {isMounted && (
        <Pyramid
          con_name={con_name}
          df0={df0}
          dat={dat}
          marks={marks}
          minYear={minYear}
          maxYear={maxYear}
          curYear={curYear}
        />
      )}
      {isMounted && (
        <PrefMap
          con_name={con_name}
          df0={df0}
          ref0={PREF_REF}
          pre={pre}
          tenByYear={tenByYear}
          marks={marks}
          minYear={minYear}
          maxYear={maxYear}
          curYear={curYear}
          isMounted={isMounted}
        />
      )}
      {isMounted && <Pr2Section mid={mid} con_name={con_name} ref0={PREF_REF} />}
    </>
  );
};
export default MedicalView;

/* ---- 二次医療圏別（遅延DL：押すと表示＋CSV）。都道府県フィルタで表＆地図を絞り込み ---- */
const Pr2Section = ({ mid, con_name, ref0 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [pref, setPref] = useState('all'); // 'all' or 'sNN'
  const load = () => {
    setOpen(true);
    if (data || loading) return;
    setLoading(true);
    json(`${server}/medical_pr2/${mid}.json`)
      .then((c) => setData(c && c.areas ? c : { areas: [] }))
      .catch(() => setData({ areas: [] }))
      .finally(() => setLoading(false));
  };
  const prefName = (p) => (ref0[p] ? ref0[p].td_name : p);

  // 全国順位を付与（areasはv降順生成）→ 県でフィルタしても全国順位を保持
  const ranked = (data ? data.areas : []).map((a, i) => ({ ...a, rank: i + 1 }));
  // フィルタ用の都道府県リスト（データに存在する県のみ、コード順）
  const prefs = [...new Set(ranked.map((a) => a.p))].sort();
  const rows = pref === 'all' ? ranked : ranked.filter((a) => a.p === pref);

  const dl = () => {
    const out = [['順位', '圏コード', '都道府県', '二次医療圏', '算定回数']];
    rows.forEach((a) => out.push([a.rank, a.c, prefName(a.p), a.nm, a.v]));
    const suffix = pref === 'all' ? '' : `_${prefName(pref)}`;
    downloadCSV(`${con_name}_二次医療圏別算定回数${suffix}_${data.yrs}.csv`, out);
  };
  return (
    <Box>
      <Typography variant='h2' component='h2'>
        {con_name}の二次医療圏別の算定回数（{data ? data.yrs : '2024'}年度）
      </Typography>
      {!open && <Chip label='二次医療圏別を表示' variant='outlined' onClick={load} sx={{ my: 1 }} />}
      {open && loading && <Typography variant='body2'>読み込み中…</Typography>}
      {open && data && data.areas.length === 0 && (
        <Typography variant='body2'>二次医療圏別データはありません。</Typography>
      )}
      {open && data && data.areas.length > 0 && (
        <>
          {/* 都道府県フィルタ：選ぶと地図がその県へ自動ズーム＋表もその県のみ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1, flexWrap: 'wrap' }}>
            <Typography variant='body2' component='label' htmlFor='pr2-pref'>
              都道府県で絞り込み：
            </Typography>
            <Box
              component='select'
              id='pr2-pref'
              value={pref}
              onChange={(e) => setPref(e.target.value)}
              sx={{
                fontSize: '14px',
                padding: '4px 8px',
                borderRadius: 1,
                border: '1px solid #bbb',
                background: '#fff',
              }}
            >
              <option value='all'>すべて（全{ranked.length}圏）</option>
              {prefs.map((p) => (
                <option key={p} value={p}>
                  {prefName(p)}
                </option>
              ))}
            </Box>
            {pref !== 'all' && (
              <Chip label='クリア' size='small' variant='outlined' onClick={() => setPref('all')} />
            )}
          </Box>

          <Pr2Map data={data} prefName={prefName} selectedPref={pref === 'all' ? null : pref} />
          <Chip label='CSVダウンロード' variant='outlined' size='small' onClick={dl} sx={{ mb: 1 }} />
          <Box sx={{ overflowX: 'auto', maxHeight: 480, overflowY: 'auto' }}>
            <Box component='table' sx={EXTRA_TABLE_SX}>
              <thead>
                <tr>
                  <th>順位</th>
                  <th>圏コード</th>
                  <th>都道府県</th>
                  <th>二次医療圏</th>
                  <th>算定回数</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.c}>
                    <td>{a.rank}</td>
                    <td>{a.c}</td>
                    <td style={{ textAlign: 'left' }}>{prefName(a.p)}</td>
                    <td style={{ textAlign: 'left' }}>{a.nm}</td>
                    <td>{tnum(a.v)}</td>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

/* ---- 二次医療圏 choropleth マップ（A38二次医療圏ポリゴン × 算定回数）
   沖縄(47xx)はasset側で左上へインセット移動済み。ズーム/パン＋選択圏の境界強調。 ---- */
const pad4 = (c) => String(c).padStart(4, '0');
const PR2_HOME = { coordinates: [134.5, 38], zoom: 1 };
// zoom=1 で見えるおおよその経度幅/緯度幅（projection scale=1900, viewBox 800x600）
const PR2_BASE_LON = (800 / 1900) * (180 / Math.PI); // ≈24.1°
const PR2_BASE_LAT = (600 / 1900) * (180 / Math.PI); // ≈18.1°
const Pr2Map = ({ data, prefName, selectedPref }) => {
  const [gid, setGid] = useState(null);
  const [view, setView] = useState(PR2_HOME);
  const geosRef = useRef(null);
  const [geoReady, setGeoReady] = useState(false);
  const [topo, setTopo] = useState(null); // 県外周の囲い線をtopojson.mergeで生成するため

  // トポロジを1回取得（Geographiesと同じファイル＝ブラウザキャッシュ利用）
  useEffect(() => {
    let alive = true;
    json(geoUrlPr2)
      .then((t) => {
        if (alive && t && t.objects) setTopo(t);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // 選択県の外周ライン（圏をmergeして1本の境界に）
  const prefOutline = (() => {
    if (!selectedPref || !topo) return null;
    const pp = String(selectedPref).replace('s', '');
    const key = Object.keys(topo.objects)[0];
    const geoms = topo.objects[key].geometries.filter(
      (g) => pad4(g.id).substr(0, 2) === pp,
    );
    if (!geoms.length) return null;
    try {
      return { type: 'Feature', properties: {}, geometry: topomerge(topo, geoms) };
    } catch (e) {
      return null;
    }
  })();

  // 選択した都道府県の圏に自動ズーム（島嶼の外れ値に強い centroid ベースで範囲算出）
  useEffect(() => {
    if (!geoReady) return;
    if (!selectedPref) {
      setView(PR2_HOME);
      return;
    }
    const pp = String(selectedPref).replace('s', ''); // 'sNN' -> 'NN'
    const cents = (geosRef.current || [])
      .filter((g) => pad4(g.id).substr(0, 2) === pp)
      .map((g) => geoCentroid(g))
      .filter((c) => c && isFinite(c[0]) && isFinite(c[1]));
    if (!cents.length) return;
    const lons = cents.map((c) => c[0]);
    const lats = cents.map((c) => c[1]);
    const minLon = Math.min(...lons), maxLon = Math.max(...lons);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const cLon = (minLon + maxLon) / 2, cLat = (minLat + maxLat) / 2;
    const spanLon = Math.max(0.3, maxLon - minLon);
    const spanLat = Math.max(0.3, maxLat - minLat);
    const zoom = Math.max(
      1,
      Math.min(8, Math.min(PR2_BASE_LON / (spanLon * 1.6), PR2_BASE_LAT / (spanLat * 1.6))),
    );
    setView({ coordinates: [cLon, cLat], zoom });
  }, [selectedPref, geoReady]);
  // 圏コード→データ（順位付き）
  const ranked = [...data.areas].sort((a, b) => b.v - a.v);
  const byCode = {};
  ranked.forEach((a, i) => {
    byCode[pad4(a.c)] = { ...a, rank: i + 1 };
  });
  // 色スケールは、県フィルタ中はその県のmin/maxに合わせて県内コントラストを最大化
  const ppFilter = selectedPref ? String(selectedPref).replace('s', '') : null;
  const scopeVals = (ppFilter ? ranked.filter((a) => pad4(a.c).substr(0, 2) === ppFilter) : ranked)
    .map((a) => a.v)
    .sort((x, y) => x - y);
  const mn = scopeVals[0] || 0;
  const mx = scopeVals[scopeVals.length - 1] || 1;
  const colorScale = scaleQuantize().domain([mn, mx === mn ? mn + 1 : mx]).range(color1);

  const zoomBy = (f) =>
    setView((v) => ({ ...v, zoom: Math.min(8, Math.max(1, v.zoom * f)) }));
  const reset = () => setView(PR2_HOME);

  const cur = gid ? byCode[gid] : null;
  const tooltipContent = (
    <div>
      <Typography sx={{ fontWeight: 'bold' }}>
        {cur ? `${prefName(cur.p)} ${cur.nm}` : ''}
      </Typography>
      {cur && (
        <Box sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
          <table className='table'>
            <tbody>
              <tr>
                <td>算定回数</td>
                <td style={{ textAlign: 'right' }}>{tnum(cur.v)}回</td>
              </tr>
              <tr>
                <td>順位</td>
                <td style={{ textAlign: 'right' }}>{cur.rank} / {ranked.length}</td>
              </tr>
            </tbody>
          </table>
        </Box>
      )}
    </div>
  );

  return (
    <Box sx={{ maxWidth: 960 }}>
      <Typography variant='caption' color='dimgrey' display='block'>
        色が濃いほど算定回数が多い二次医療圏です（{data.yrs}年度・全{ranked.length}圏）。
        左上は沖縄県（インセット）。ドラッグで移動・ホイール/ボタンで拡大縮小できます。
        {selectedPref &&
          `（${prefName(selectedPref)}を選択中：色の濃淡は${prefName(selectedPref)}内の最小〜最大に合わせています）`}
      </Typography>
      <Box sx={{ fontSize: { xs: '12px', sm: '14px' }, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', my: 0.5 }}>
        <div className='legend legend-horizontal legend-scale' style={{ margin: 0 }}>
          <span className='legend-value'>{tnum(mn)}</span>
          {color1.map((c) => (
            <span key={c} className='legend-box' style={{ backgroundColor: c }}></span>
          ))}
          <span className='legend-value'>{tnum(mx)} </span>
        </div>
        <Box sx={{ ml: 'auto' }}>
          <Chip label='＋' size='small' variant='outlined' onClick={() => zoomBy(1.5)} />{' '}
          <Chip label='－' size='small' variant='outlined' onClick={() => zoomBy(1 / 1.5)} />{' '}
          <Chip label='リセット' size='small' variant='outlined' onClick={reset} />
        </Box>
      </Box>
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          overflow: 'hidden',
          background: '#f8fbff',
        }}
      >
        <ComposableMap
          data-tooltip-id='pr2-tooltip'
          projection='geoMercator'
          projectionConfig={{ center: [134.5, 38], scale: 1900 }}
          width={800}
          height={600}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <ZoomableGroup
            center={view.coordinates}
            zoom={view.zoom}
            minZoom={1}
            maxZoom={8}
            onMoveEnd={({ coordinates, zoom }) => setView({ coordinates, zoom })}
          >
            <Geographies geography={geoUrlPr2}>
              {({ geographies }) => {
                if (geographies.length && !geosRef.current) {
                  geosRef.current = geographies;
                  if (!geoReady) Promise.resolve().then(() => setGeoReady(true));
                }
                return (
                <>
                  {geographies.map((geo) => {
                    const code = pad4(geo.id);
                    const a = byCode[code];
                    // 県でフィルタ中：対象県は局所スケールで着色、県外は淡グレーで焦点化
                    const other = ppFilter && code.substr(0, 2) !== ppFilter;
                    const fill = other ? '#e9ecef' : a ? colorScale(a.v) : '#eee';
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        stroke={other ? '#c7ccd1' : '#6b7280'}
                        strokeWidth={0.5}
                        fill={fill}
                        onMouseEnter={() => setGid(code)}
                        onMouseLeave={() => setGid(null)}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: '#F58462', outline: 'none' },
                          pressed: { fill: '#F58462', outline: 'none' },
                        }}
                      />
                    );
                  })}
                  {/* 選択県の外周を太線で囲う */}
                  {prefOutline && (
                    <Geography
                      key='pr2-pref-outline'
                      geography={prefOutline}
                      fill='none'
                      stroke='#1565c0'
                      strokeWidth={1.6}
                      style={{
                        default: { outline: 'none', pointerEvents: 'none' },
                        hover: { outline: 'none', pointerEvents: 'none' },
                        pressed: { outline: 'none', pointerEvents: 'none' },
                      }}
                    />
                  )}
                  {/* 選択中の圏を最前面に太線で再描画（境界を明確化） */}
                  {gid &&
                    (() => {
                      const sel = geographies.find((g) => pad4(g.id) === gid);
                      return sel ? (
                        <Geography
                          key='pr2-selected'
                          geography={sel}
                          fill='none'
                          stroke='#c0392b'
                          strokeWidth={1.6}
                          style={{
                            default: { outline: 'none', pointerEvents: 'none' },
                            hover: { outline: 'none', pointerEvents: 'none' },
                            pressed: { outline: 'none', pointerEvents: 'none' },
                          }}
                        />
                      ) : null;
                    })()}
                  {/* 沖縄インセットの仕切り＋ラベル（沖縄は左上 lon123-131 / lat41-45 に移動済み） */}
                  <MapLine
                    coordinates={[
                      [132.2, 40],
                      [132.2, 46.5],
                    ]}
                    stroke='#bbb'
                    strokeWidth={1}
                    strokeDasharray='3 3'
                  />
                  <MapLine
                    coordinates={[
                      [121, 40],
                      [132.2, 40],
                    ]}
                    stroke='#bbb'
                    strokeWidth={1}
                    strokeDasharray='3 3'
                  />
                  <Marker coordinates={[122, 46]} pointerEvents='none'>
                    <text fontSize={8} fill='#666' textAnchor='start'>
                      沖縄県
                    </text>
                  </Marker>
                </>
                );
              }}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <ReactTooltip
          id='pr2-tooltip'
          float={true}
          style={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            color: '#333',
            border: '1px solid #a8a7a5',
            padding: '8px',
            maxWidth: '240px',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          render={() => tooltipContent}
        />
      </Box>
    </Box>
  );
};

/* ---- 基本情報テーブル（年次スライダーで点数/算定回数/売上を切替＋患者数の遅延読込） ----
   患者数は別データ(medical_pt)・2024年度単年・対象は一部。基本情報には総数と男女内訳のみ
   を表示し、性年齢別/都道府県別のグラフ化は来年度（複数年化）に持ち越し。 */
const InfoTable = ({ mid, con_name, df0, dat, marks, minYear, maxYear, curYear }) => {
  const [year, setYear] = useState(Number(curYear));
  const [pt, setPt] = useState(null);
  const [ptLoading, setPtLoading] = useState(false);
  const [ptOpen, setPtOpen] = useState(false);

  const cur = dat.find((d) => Number(d.yrs) === Number(year)) || dat[0];
  const ten = cur.tn != null ? cur.tn : df0.ten;
  const pp = cur.val ? cur.val.pp : null;
  const sales = ten != null && pp != null ? pp * ten * 10 : null;

  const handleChange = (event, v) => {
    if (typeof v === 'number') setYear(v);
  };
  const step = (delta) => {
    const ind = marks.findIndex((s) => s.value == year);
    if (marks[ind + delta]) setYear(marks[ind + delta].value);
  };

  const loadPt = () => {
    setPtOpen(true);
    if (pt || ptLoading) return;
    setPtLoading(true);
    json(`${server}/medical_pt/${mid}.json`)
      .then((c) => setPt(c && c.dt ? c : { dt: [] }))
      .catch(() => setPt({ dt: [] }))
      .finally(() => setPtLoading(false));
  };
  const hasPt = pt && pt.dt && pt.dt.length > 0;

  return (
    <Box>
      <Typography variant='h2' component='h2'>
        {con_name}の基本情報
      </Typography>
      <Box component='table' sx={INFO_TABLE_SX}>
        <thead>
          <tr>
            <th>項目　</th>
            <th>値</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>区分</td>
            <td>
              {df0.cat ? (
                <Link prefetch={false} href={`/medical/category/${df0.cat}`}>
                  {df0.sec}
                </Link>
              ) : (
                df0.sec
              )}
            </td>
          </tr>
          <tr>
            <td>分類</td>
            <td>
              {df0.bcd ? (
                <Link prefetch={false} href={`/medical/sub/${df0.bcd}`}>
                  {df0.bcd} {df0.bnm}
                </Link>
              ) : (
                <>
                  {df0.bcd} {df0.bnm}
                </>
              )}
            </td>
          </tr>
          <tr>
            <td>診療行為名</td>
            <td>{df0.nm}</td>
          </tr>
          <tr>
            <td>診療行為コード</td>
            <td>{df0.mid}</td>
          </tr>
          <tr>
            <td>点数（{year}年度）</td>
            <td>{ten != null ? `${tnum(ten)}点` : '—'}</td>
          </tr>
          <tr>
            <td>算定回数（{year}年度）</td>
            <td>{pp != null ? tnum(pp) : '—'}</td>
          </tr>
          <tr>
            <td>売上（{year}年度・試算）</td>
            <td>{sales != null ? `${tnum(sales)}円` : '—'}</td>
          </tr>
          {hasPt && (
            <>
              <tr>
                <td>患者数（{pt.yrs}年度）</td>
                <td>{tnum(pt.pp)}</td>
              </tr>
              <tr>
                <td>　うち女性（{pt.yrs}年度）</td>
                <td>{tnum(pt.fs)}</td>
              </tr>
              <tr>
                <td>　うち男性（{pt.yrs}年度）</td>
                <td>{tnum(pt.ms)}</td>
              </tr>
            </>
          )}
        </tbody>
      </Box>

      {/* 年次スライダー（点数・算定回数・売上を年度で切替） */}
      <Box maxWidth='600px'>
        <Box margin='auto' padding='0px 50px'>
          <Typography display='inline' gutterBottom>
            表示年度: <span style={{ fontWeight: 'bold' }}>{year}</span>年度
          </Typography>
          <Chip label='－' size='small' variant='outlined' onClick={() => step(-1)} />{' '}
          <Chip label='＋' size='small' variant='outlined' onClick={() => step(1)} />
          <Slider
            value={Number(year)}
            aria-label='year-slider'
            min={minYear}
            max={maxYear}
            step={null}
            valueLabelDisplay='auto'
            marks={marks}
            onChange={handleChange}
          />
        </Box>
      </Box>

      {/* 患者数の読み込み（別データ・2024年度単年・対象は一部） */}
      <Box sx={{ mt: 1 }}>
        {!ptOpen && (
          <Chip label='患者数を読み込む' variant='outlined' onClick={loadPt} sx={{ my: 1 }} />
        )}
        {ptOpen && ptLoading && <Typography variant='body2'>患者数を読み込み中…</Typography>}
        {ptOpen && pt && !hasPt && (
          <Typography variant='body2'>
            この診療行為の患者数データは公表されていません。
          </Typography>
        )}
      </Box>
    </Box>
  );
};

/* ---- 総算定回数の年次推移 ---- */
const TrendLine = ({ con_name, dat }) => {
  const chartData = dat
    .map((d) => ({ year: Number(d.yrs), 算定回数: d.val.pp }))
    .sort((a, b) => a.year - b.year);
  return (
    <Box>
      <Typography variant='h2' component='h2'>
        {con_name}の算定回数 {chartData[0].year}〜{chartData[chartData.length - 1].year}年度
      </Typography>
      <ResponsiveContainer height={400}>
        <LineChart width={600} height={400} data={chartData} margin={{ top: 5, right: 5, left: -50, bottom: 5 }}>
          <Line type='monotone' dataKey='算定回数' stroke='#8884d8' dot={{ r: 1.5, fill: '#8884d8' }} />
          <XAxis dataKey='year' tick={{ fontSize: 12 }} />
          <YAxis
            domain={['auto', 'auto']}
            tickMargin={0}
            tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
            orientation='left'
            tickFormatter={yAxisFormatter}
          />
          <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value) + '回'} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

/* ---- 売上の年次推移（算定回数 × 点数 × 10円） ---- */
const SalesChart = ({ con_name, dat }) => {
  const chartData = dat
    .filter((d) => d.tn != null && d.val && d.val.pp != null)
    .map((d) => ({ year: Number(d.yrs), 売上: d.val.pp * d.tn * 10 }))
    .sort((a, b) => a.year - b.year);
  if (chartData.length === 0) return null;
  return (
    <Box>
      <Typography variant='h2' component='h2'>
        {con_name}の売上（試算）の推移 {chartData[0].year}〜{chartData[chartData.length - 1].year}年度
      </Typography>
      <Typography variant='caption' color='dimgrey'>
        売上＝算定回数 × 点数 × 10円（1点＝10円）の試算値
      </Typography>
      <ResponsiveContainer height={400}>
        <LineChart width={600} height={400} data={chartData} margin={{ top: 5, right: 5, left: -50, bottom: 5 }}>
          <Line type='monotone' dataKey='売上' stroke='#c0392b' dot={{ r: 1.5, fill: '#c0392b' }} />
          <XAxis dataKey='year' tick={{ fontSize: 12 }} />
          <YAxis
            domain={['auto', 'auto']}
            tickMargin={0}
            tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
            orientation='left'
            tickFormatter={okuFormatter}
          />
          <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value) + '円'} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

/* ---- 点数の年次推移（診療報酬改定で段階的に変化） ---- */
const TenChart = ({ con_name, dat }) => {
  const chartData = dat
    .filter((d) => d.tn != null)
    .map((d) => ({ year: Number(d.yrs), 点数: Number(d.tn) }))
    .sort((a, b) => a.year - b.year);
  if (chartData.length === 0) return null;
  return (
    <Box>
      <Typography variant='h2' component='h2'>
        {con_name}の点数の推移 {chartData[0].year}〜{chartData[chartData.length - 1].year}年度
      </Typography>
      <ResponsiveContainer height={300}>
        <LineChart width={600} height={300} data={chartData} margin={{ top: 5, right: 5, left: -50, bottom: 5 }}>
          <Line type='stepAfter' dataKey='点数' stroke='#e67e22' dot={{ r: 2, fill: '#e67e22' }} />
          <XAxis dataKey='year' tick={{ fontSize: 12 }} />
          <YAxis domain={['auto', 'auto']} tickMargin={0} tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }} orientation='left' />
          <Tooltip formatter={(value) => `${Number(value).toLocaleString()}点（${Number(value) * 10}円）`} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

/* ---- 診療月別の推移（遅延DL：ボタン押下時に取得） ---- */
const FY_MONTHS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
const MonthChart = ({ mid, con_name, tenByYear }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const load = () => {
    setOpen(true);
    if (data || loading) return;
    setLoading(true);
    json(`${server}/medical_month/${mid}.json`)
      .then((col) => setData(col && col.dat ? col.dat : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  };

  const chartData = [];
  const bands = []; // 年度ごとの帯（交互に薄く塗って年度を区切る）
  let hasSales = false;
  if (data) {
    [...data]
      .sort((a, b) => Number(a.yrs) - Number(b.yrs))
      .forEach((d, di) => {
        const fy = Number(d.yrs);
        // 売上＝その月の算定回数 × その年度の点数 × 10円
        const tn = tenByYear ? tenByYear[String(fy)] : null;
        FY_MONTHS.forEach((mo, k) => {
          const cy = mo >= 4 ? fy : fy + 1;
          const cnt = d.mv[k];
          const sales = tn != null ? cnt * tn * 10 : null;
          if (sales != null) hasSales = true;
          chartData.push({
            ym: `${cy}/${String(mo).padStart(2, '0')}`,
            fy,
            mo,
            算定回数: cnt,
            売上: sales,
          });
        });
        bands.push({ fy, x1: `${fy}/04`, x2: `${fy + 1}/03`, alt: di % 2 === 1 });
      });
  }
  const ymLabel = (ym) => {
    const [y, m] = String(ym).split('/');
    return `${y}年${Number(m)}月`;
  };

  return (
    <Box>
      <Typography component='h2' variant='h2'>
        {con_name}の診療月別の算定回数（月次推移）
      </Typography>
      {!open && (
        <Chip label='診療月別の推移を表示' variant='outlined' onClick={load} sx={{ my: 1 }} />
      )}
      {open && loading && <Typography variant='body2'>読み込み中…</Typography>}
      {open && data && data.length === 0 && (
        <Typography variant='body2'>診療月別データはありません。</Typography>
      )}
      {open && chartData.length > 0 && (
        <>
          <Typography variant='caption' color='dimgrey'>
            背景の濃淡が1年度（4月〜翌3月）です。
          </Typography>
          <ResponsiveContainer height={400}>
            <LineChart width={600} height={400} data={chartData} margin={{ top: 5, right: 5, left: -50, bottom: 5 }}>
              {bands
                .filter((b) => b.alt)
                .map((b) => (
                  <ReferenceArea key={b.fy} x1={b.x1} x2={b.x2} fill='#000' fillOpacity={0.05} ifOverflow='extendDomain' />
                ))}
              <Line type='monotone' dataKey='算定回数' stroke='#2e7d32' dot={false} />
              <XAxis
                dataKey='ym'
                tick={{ fontSize: 11 }}
                interval={11}
                angle={-30}
                textAnchor='end'
                height={52}
                tickFormatter={(ym) => `${String(ym).split('/')[0]}年度`}
              />
              <YAxis
                domain={['auto', 'auto']}
                tickMargin={0}
                tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
                orientation='left'
                tickFormatter={yAxisFormatter}
              />
              <Tooltip
                labelFormatter={ymLabel}
                formatter={(value) => [new Intl.NumberFormat('en').format(value) + '回', '算定回数']}
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>

          {hasSales && (
            <>
              <Typography component='h2' variant='h2'>
                {con_name}の診療月別の売上（試算・月次推移）
              </Typography>
              <Typography variant='caption' color='dimgrey'>
                売上＝算定回数 × 点数 × 10円。背景の濃淡が1年度（4月〜翌3月）です。
              </Typography>
              <ResponsiveContainer height={400}>
                <LineChart width={600} height={400} data={chartData} margin={{ top: 5, right: 5, left: -50, bottom: 5 }}>
                  {bands
                    .filter((b) => b.alt)
                    .map((b) => (
                      <ReferenceArea key={b.fy} x1={b.x1} x2={b.x2} fill='#000' fillOpacity={0.05} ifOverflow='extendDomain' />
                    ))}
                  <Line type='monotone' dataKey='売上' stroke='#c0392b' dot={false} connectNulls={false} />
                  <XAxis
                    dataKey='ym'
                    tick={{ fontSize: 11 }}
                    interval={11}
                    angle={-30}
                    textAnchor='end'
                    height={52}
                    tickFormatter={(ym) => `${String(ym).split('/')[0]}年度`}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tickMargin={0}
                    tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
                    orientation='left'
                    tickFormatter={okuFormatter}
                  />
                  <Tooltip
                    labelFormatter={ymLabel}
                    formatter={(value) => [new Intl.NumberFormat('en').format(value) + '円', '売上']}
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </>
      )}
    </Box>
  );
};

/* ---- 男女別構成（%） ---- */
const AreaSex = ({ con_name, dat }) => {
  const chartData = dat
    .map((d) => ({ year: Number(d.yrs), 女性: d.val.fs, 男性: d.val.ms }))
    .sort((a, b) => a.year - b.year);
  const toPercent = (decimal, fixed1 = 0) => `${(decimal * 100).toFixed(fixed1)}%`;
  const rsp1 = { 女性: '女性', 男性: '男性' };
  const renderColorfulLegendText = (value, entry) => (
    <span style={{ color: entry.color }}>{rsp1[value]}</span>
  );
  const renderTooltipContent = (o) => {
    const { payload, label } = o;
    if (!payload || !payload.length) return null;
    const total = payload.reduce((result, entry) => result + entry.value, 0);
    return (
      <div className='squaire-toolbox'>
        <Box sx={{ backgroundColor: 'white', opacity: '0.9', padding: '5px 10px 5px 10px' }}>
          <Typography>{`${label}年度 (合計: ${total.toLocaleString()}回)`}</Typography>
          {[...payload].reverse().map((entry, index) => (
            <Typography key={`item-${index}`} sx={{ fontSize: '1.1em', color: entry.color }}>
              {`${rsp1[entry.name]}: ${entry.value.toLocaleString()} (${total > 0 ? toPercent(entry.value / total, 1) : '0%'})`}
            </Typography>
          ))}
        </Box>
      </div>
    );
  };
  return (
    <Box>
      <Typography component='h2' variant='h2'>
        {con_name}の男女別の算定回数 {chartData[0].year}〜{chartData[chartData.length - 1].year}年度
      </Typography>
      <ResponsiveContainer height={400}>
        <AreaChart
          width={600}
          height={400}
          data={chartData}
          stackOffset='expand'
          margin={{ top: 5, right: 5, left: -50, bottom: 5 }}
          style={{ fontSize: '0.8em' }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='year' />
          <Tooltip content={renderTooltipContent} />
          <Area type='monotone' dataKey='女性' stackId='1' stroke='#EE7989' fill='#EE7989' />
          <Area type='monotone' dataKey='男性' stackId='1' stroke='steelblue' fill='steelblue' />
          <YAxis
            tickMargin={0}
            tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
            orientation='left'
            tickFormatter={(decimal) => `${(decimal * 100).toFixed(0)}%`}
          />
          <Legend formatter={renderColorfulLegendText} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

/* ---- 年齢ピラミッド（年次スライダー / ローカル） ---- */
const Pyramid = ({ con_name, df0, dat, marks, minYear, maxYear, curYear }) => {
  const [value, setValue] = useState(Number(curYear));
  const cur = dat.find((d) => Number(d.yrs) === Number(value)) || dat[0];
  const val = cur.val;
  const dmx1 = (df0.mx || 10) + 2;
  const dmx2 = dmx1 * -1;

  const handleChange = (event, v) => {
    if (typeof v === 'number') setValue(v);
  };
  const step = (delta) => {
    const ind = marks.findIndex((ss) => ss.value == value);
    if (marks[ind + delta]) setValue(marks[ind + delta].value);
  };

  const renderLabelFemale = (p) => (Number(p) != 0 ? `${(Number(p) * -1).toFixed(1)}%` : '');
  const renderLabelMale = (p) => `${Number(p).toFixed(1)}%`;
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      return (
        <div className='squaire-toolbox'>
          <Box sx={{ backgroundColor: 'white', opacity: '0.95', padding: '5px 10px' }}>
            <Typography sx={{ fontSize: '1.1em', color: 'dimgrey' }}>{`${row.l}歳`}</Typography>
            <Typography sx={{ color: '#EE7989' }}>{`女性: ${Number(row.f).toLocaleString()}回`}</Typography>
            <Typography sx={{ color: 'steelblue' }}>{`男性: ${Number(row.m).toLocaleString()}回`}</Typography>
          </Box>
        </div>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography component='h2' variant='h2'>
        {con_name}の算定回数ピラミッド {minYear}〜{maxYear}年度（男女別、年齢別【5歳階級】）
      </Typography>
      <ResponsiveContainer height={400}>
        <BarChart
          layout='vertical'
          stackOffset='sign'
          width={600}
          height={400}
          data={[...val.dt].reverse()}
          margin={{ top: 5, right: 5, left: -50, bottom: 5 }}
          style={{ fontSize: '0.8em' }}
          barCategoryGap={0}
        >
          <XAxis
            type='number'
            tickFormatter={(tick) => (tick < 0 ? Number(tick) * -1 : Number(tick))}
            domain={[dmx2, dmx1]}
          />
          <Tooltip content={CustomTooltip} />
          <Legend />
          <YAxis
            interval={0}
            tickMargin={0}
            tick={{ fontSize: 12, dx: 43, dy: 0, width: 0 }}
            orientation='left'
            type='category'
            dataKey='l'
          />
          <ReferenceLine y={0} stroke='#000' />
          <Bar name='女性' dataKey='g' stackId='b' fill='#EE7989'>
            <LabelList dataKey='g' position='right' formatter={renderLabelFemale} style={{ fill: 'rgb(102, 102, 102)' }} />
          </Bar>
          <Bar name='男性' dataKey='n' stackId='b' fill='steelblue'>
            <LabelList dataKey='n' position='right' formatter={renderLabelMale} style={{ fill: 'rgb(102, 102, 102)' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <Box maxWidth='600px'>
        <Box margin='auto' padding='0px 50px'>
          <Typography gutterBottom>
            <span>総算定回数： </span>
            <span style={{ fontWeight: 'bold' }}>{tnum(val.pp)}</span>
          </Typography>
          <Typography display='inline' gutterBottom>
            表示年度: <span style={{ fontWeight: 'bold' }}>{value}</span>年度
          </Typography>
          <Chip label='－' size='small' variant='outlined' onClick={() => step(-1)} />{' '}
          <Chip label='＋' size='small' variant='outlined' onClick={() => step(1)} />
          <Slider
            value={Number(value)}
            aria-label='year-slider'
            defaultValue={Number(curYear)}
            min={minYear}
            max={maxYear}
            step={null}
            valueLabelDisplay='auto'
            marks={marks}
            onChange={handleChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

/* ---- 都道府県マップ（年次スライダー / ローカル）＋ ランキング表 ---- */
const PrefMap = ({ con_name, df0, ref0, pre, tenByYear, marks, minYear, maxYear, curYear, isMounted }) => {
  const [mvalue, setMvalue] = useState(Number(curYear));
  const [gid, setGid] = useState('s13');
  const cur = pre.find((d) => Number(d.yrs) === Number(mvalue)) || pre[0];
  const mdata = cur.val;
  // その年の点数で売上(試算)= 算定回数 × 点数 × 10円
  const tenY = tenByYear && tenByYear[String(mvalue)] != null ? tenByYear[String(mvalue)] : df0.ten;
  const salesYen = (m) => (tenY != null ? okuFormatter(m * tenY * 10) + '円' : '—');
  const minmax1 = [df0.mn1, df0.mx1]; // fixed legend across years
  const colorScale1 = scaleQuantize().domain(minmax1).range(color1);
  const colorScale2 = scaleQuantize().domain(minmax1).range(color2);

  const handleChange1 = (event, v) => {
    if (typeof v === 'number') setMvalue(v);
  };
  const step = (delta) => {
    const ind = marks.findIndex((ss) => ss.value == mvalue);
    if (marks[ind + delta]) setMvalue(marks[ind + delta].value);
  };

  // ranking table rows (desc by 算定回数) for the selected year
  const ranked = [...mdata.dt].sort((a, b) => b.m - a.m);

  const cur2 = mdata.dt.find((s) => s.l === gid);
  const tooltipContent = (
    <div>
      <Typography sx={{ fontWeight: 'bold' }}>
        {cur2 ? ref0[cur2.l].td_name : ''} （{mvalue}年度）
      </Typography>
      <Box sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
        <table className='table'>
          <tbody>
            <tr>
              <td>算定回数</td>
              <td style={{ textAlign: 'right' }}>{cur2 ? tnum(cur2.m) : ''}回</td>
            </tr>
            <tr>
              <td>全国比</td>
              <td style={{ textAlign: 'right' }}>{cur2 ? tnum(cur2.n) : ''}%</td>
            </tr>
            <tr>
              <td>売上(試算)</td>
              <td style={{ textAlign: 'right' }}>{cur2 ? salesYen(cur2.m) : ''}</td>
            </tr>
          </tbody>
        </table>
      </Box>
    </div>
  );

  return (
    <Box>
      <Typography component='h2' variant='h2'>
        {con_name}の都道府県別の算定回数 {minYear}〜{maxYear}年度
      </Typography>
      <Box sx={{ maxWidth: '600px' }}>
        <Typography gutterBottom>
          <span>総算定回数： </span>
          <span style={{ fontWeight: 'bold' }}>{tnum(mdata.pf)}</span>
        </Typography>
        <Box sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
          <div className='legend legend-horizontal legend-scale'>
            <span className='legend-value'>{tnum(minmax1[0])}</span>
            {color1.map((c) => (
              <span key={c} className='legend-box' style={{ backgroundColor: c }}></span>
            ))}
            <span className='legend-value'>{tnum(minmax1[1])} </span>
          </div>
        </Box>
        <ComposableMap
          data-tooltip-id='map-tooltip'
          projectionConfig={{ scale: 2000, center: [13, 6.25] }}
          height={500}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => {
                  const centroid = geoCentroid(geo);
                  const c = mdata.dt.find((s) => s.l === geo.id);
                  return (
                    <g key={geo.rsmKey + 'name'}>
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        stroke='#FFF'
                        fill={c ? colorScale1(c.m) : 'lightgrey'}
                        onClick={() => setGid(geo.id)}
                        onMouseEnter={() => setGid(geo.id)}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: '#F58462', outline: 'none' },
                          pressed: { fill: '#F58462', outline: 'none' },
                        }}
                      ></Geography>
                      <Marker coordinates={centroid} pointerEvents={'none'}>
                        <text y='7' fontSize={20} textAnchor='middle' fill={c ? colorScale2(c.m) : 'black'}>
                          {c ? ref0[c.l].short_name : ''}
                        </text>
                      </Marker>
                    </g>
                  );
                })}
              </>
            )}
          </Geographies>
        </ComposableMap>

        {/* 年次スライダー（マップ下：表とマップを同時に見ながら操作できる） */}
        <Box margin='auto' padding='0px 50px' sx={{ mt: 1 }}>
          <Typography display='inline' gutterBottom>
            表示年度: <span style={{ fontWeight: 'bold' }}>{mvalue}</span>年度
          </Typography>
          <Chip label='－' size='small' variant='outlined' onClick={() => step(-1)} />{' '}
          <Chip label='＋' size='small' variant='outlined' onClick={() => step(1)} />
          <Slider
            value={Number(mvalue)}
            aria-label='year-slider'
            defaultValue={Number(curYear)}
            min={minYear}
            max={maxYear}
            step={null}
            valueLabelDisplay='auto'
            marks={marks}
            onChange={handleChange1}
          />
        </Box>

        {/* Desktop: floating tooltip on hover */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {isMounted && (
            <ReactTooltip
              id='map-tooltip'
              float={true}
              style={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                color: '#333',
                border: '1px solid #a8a7a5',
                padding: '8px',
                maxWidth: '220px',
                zIndex: 9999,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              render={() => tooltipContent}
            />
          )}
        </Box>
        {/* Mobile: panel below map */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>{tooltipContent}</Box>
      </Box>

      {/* 下部の都道府県ランキング表 */}
      <Box sx={{ mt: 2 }}>
        <Typography variant='h3' component='h3'>
          {con_name}の都道府県別 算定回数ランキング（{mvalue}年度）
        </Typography>
        <Box component='table' sx={RANK_TABLE_SX}>
          <thead>
            <tr>
              <th>順位</th>
              <th>都道府県</th>
              <th>算定回数</th>
              <th>全国比</th>
              <th>売上(試算)</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => (
              <tr
                key={r.l}
                style={{ background: r.l === gid ? 'rgba(238,121,137,0.15)' : '' }}
                onMouseEnter={() => setGid(r.l)}
              >
                <td>{i + 1}</td>
                <td>{ref0[r.l] ? ref0[r.l].td_name : r.l}</td>
                <td>{tnum(r.m)}</td>
                <td>{tnum(r.n)}%</td>
                <td>{salesYen(r.m)}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Box>
  );
};
