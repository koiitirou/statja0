'use client';
// 医科診療行為のスクエアマップ（ツリーマップ）
// 区分(21) → 分類(bcd) → 診療行為(mid) のドリルダウン。各midは単一のcat/bcdに属する
// 非重複階層（medical_tree生成時に分類合計=区分合計を全年検証済み）。
// 指標: 売上(試算)・算定回数（2015-2024スライダー）／患者数（2024・公表分の延べ合計のみ）。
import React, { useState, useEffect } from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import { Box, Typography, Chip } from '@mui/material';
import Slider from '@mui/material/Slider';
import { json } from 'd3-fetch';
import { useRouter } from 'next/navigation';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { server } from '@/components/config';

const PALETTE = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1',
  '#ff9da7', '#9c755f', '#bab0ac', '#1f77b4', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#aec7e8', '#ffbb78',
];
const tnum = (v) => Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 });
const oku = (v) => {
  if (v >= 1e12) return (v / 1e12).toPrecision(3) + '兆';
  if (v >= 1e8) return (v / 1e8).toPrecision(3) + '億';
  if (v >= 1e4) return (v / 1e4).toPrecision(3) + '万';
  return String(Math.round(v));
};
const fmt = (metric, v) =>
  v == null ? '—' : metric === 'sales' ? oku(v) + '円' : metric === 'cnt' ? oku(v) + '回' : oku(v) + '人';

const METRICS = [
  { key: 'sales', label: '売上（試算）' },
  { key: 'cnt', label: '算定回数' },
  { key: 'pt', label: '患者数' },
];

// タイル描画（rect＋余裕があればラベル）。クリックはここで拾う（recharts Treemapの
// onClickはバージョン差があるためセルに直接付ける）。
const Cell = (props) => {
  const { x, y, width, height, index, tiles, onTile, onHover } = props;
  const d = tiles && tiles[index];
  if (!d || width <= 0 || height <= 0) return null;
  const showName = width > 60 && height > 26;
  const showPct = width > 60 && height > 42;
  return (
    <g
      onClick={() => onTile && onTile(d)}
      onMouseEnter={() => onHover && onHover(index)}
      onMouseLeave={() => onHover && onHover(null)}
      style={{ cursor: onTile ? 'pointer' : 'default' }}
    >
      <rect x={x} y={y} width={width} height={height} fill={d.fill} stroke='#fff' strokeWidth={1} />
      {showName && (
        <text x={x + 5} y={y + 16} fill='#fff' fontSize={12} pointerEvents='none'>
          {String(d.name).slice(0, Math.max(3, Math.floor(width / 11)))}
        </text>
      )}
      {showPct && (
        <text x={x + 5} y={y + 32} fill='rgba(255,255,255,0.85)' fontSize={11} pointerEvents='none'>
          {d.pct}%
        </text>
      )}
    </g>
  );
};

const MedicalTreemap = () => {
  const router = useRouter();
  const [root, setRoot] = useState(null); // {years, cats}
  const [catData, setCatData] = useState({}); // cat -> {subs}
  const [subData, setSubData] = useState({}); // bcd -> {rows}
  const [ptMap, setPtMap] = useState(null); // mid -> pt
  const [metric, setMetric] = useState('sales');
  const [yearIdx, setYearIdx] = useState(null); // rootロード後に最新年へ
  const [level, setLevel] = useState({ type: 'root' }); // root | {type:'cat',cat,sec} | {type:'sub',cat,sec,bcd,bnm}
  const [hoverIdx, setHoverIdx] = useState(null);

  useEffect(() => {
    let alive = true;
    json(`${server}/medical_tree/root.json`)
      .then((r) => {
        if (!alive || !r) return;
        setRoot(r);
        setYearIdx(r.years.length - 1);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // 患者数（leaf用マップ）は指標選択時に一度だけ
  useEffect(() => {
    if (metric !== 'pt' || ptMap) return;
    json(`${server}/medical_tree/pt.json`).then((m) => setPtMap(m || {})).catch(() => setPtMap({}));
  }, [metric, ptMap]);

  // レベル/指標/年の切替でホバー状態をリセット（stale index防止）
  useEffect(() => {
    setHoverIdx(null);
  }, [level, metric, yearIdx]);

  const openCat = (cat, sec) => {
    setLevel({ type: 'cat', cat, sec });
    if (!catData[cat]) {
      json(`${server}/medical_tree/${cat}.json`)
        .then((j) => setCatData((p) => ({ ...p, [cat]: j })))
        .catch(() => {});
    }
  };
  const openSub = (lv, bcd, bnm) => {
    setLevel({ type: 'sub', cat: lv.cat, sec: lv.sec, bcd, bnm });
    if (!subData[bcd]) {
      json(`${server}/medical_sub/${bcd}.json`)
        .then((j) => setSubData((p) => ({ ...p, [bcd]: j })))
        .catch(() => {});
    }
  };

  if (!root || yearIdx == null) return null;
  const years = root.years;
  const yi = metric === 'pt' ? years.length - 1 : yearIdx; // 患者数は2024固定
  const year = years[yi];

  // 現レベルのタイル生成 {name, value, pct, fill, ...meta}
  let items = null; // [{name, value, meta...}]
  let loading = false;
  if (level.type === 'root') {
    items = root.cats.map((c) => ({
      name: c.sec,
      value: metric === 'pt' ? c.pt : metric === 'sales' ? c.sales[yi] : c.cnt[yi],
      cnt: c.cnt[yi], sales: c.sales[yi], pt: c.pt, n: c.n,
      kind: 'cat', cat: c.cat, sec: c.sec,
    }));
  } else if (level.type === 'cat') {
    const j = catData[level.cat];
    if (!j) loading = true;
    else
      items = j.subs.map((s) => ({
        name: `${s.bcd} ${s.bnm}`,
        value: metric === 'pt' ? s.pt : metric === 'sales' ? s.sales[yi] : s.cnt[yi],
        cnt: s.cnt[yi], sales: s.sales[yi], pt: s.pt, n: s.n,
        kind: 'sub', bcd: s.bcd, bnm: s.bnm,
      }));
  } else {
    const j = subData[level.bcd];
    if (!j) loading = true;
    else
      items = j.rows.map((r) => {
        const v = (r.v && r.v[yi]) || 0;
        const t = r.t ? r.t[yi] : null;
        const sales = t != null ? v * t * 10 : null;
        const pt = ptMap ? ptMap[r.mid] : null;
        return {
          name: r.nm,
          value: metric === 'pt' ? pt : metric === 'sales' ? sales : v,
          cnt: v, sales, pt: pt == null ? null : pt,
          kind: 'mid', mid: r.mid,
        };
      });
  }

  let tiles = [];
  let total = 0;
  if (items) {
    const pos = items.filter((d) => d.value != null && d.value > 0).sort((a, b) => b.value - a.value);
    total = pos.reduce((a, d) => a + d.value, 0);
    tiles = pos.map((d, i) => ({
      ...d,
      pct: total > 0 ? ((d.value / total) * 100).toFixed(1) : '0',
      fill: PALETTE[i % PALETTE.length],
      size: d.value,
    }));
  }
  const dropped = items ? items.length - tiles.length : 0;

  const onTile = (d) => {
    if (d.kind === 'cat') openCat(d.cat, d.sec);
    else if (d.kind === 'sub') openSub(level, d.bcd, d.bnm);
    else if (d.kind === 'mid') router.push(`/medical/${d.mid}`);
  };

  const hovered = hoverIdx != null ? tiles[hoverIdx] : null;
  const tooltipContent = hovered ? (
    <div>
      <Typography sx={{ fontWeight: 'bold', fontSize: 13 }}>{hovered.name}</Typography>
      <Typography sx={{ fontSize: 12 }}>売上（試算）: {hovered.sales != null ? tnum(hovered.sales) + '円' : '—'}</Typography>
      <Typography sx={{ fontSize: 12 }}>算定回数: {tnum(hovered.cnt)}回</Typography>
      <Typography sx={{ fontSize: 12 }}>患者数（2024・公表分）: {hovered.pt != null && hovered.pt > 0 ? tnum(hovered.pt) + '人' : '—'}</Typography>
      <Typography sx={{ fontSize: 12, color: 'dimgrey' }}>
        構成比 {hovered.pct}%{hovered.n ? `・${hovered.n}診療行為` : ''}
        {hovered.kind !== 'mid' ? '（クリックで内訳）' : '（クリックで詳細ページ）'}
      </Typography>
    </div>
  ) : null;

  const marks = years.map((y) => ({ value: Number(y) }));
  const step = (delta) => {
    const ni = yearIdx + delta;
    if (ni >= 0 && ni < years.length) setYearIdx(ni);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant='h2' component='h2'>
        医科診療行為のスクエアマップ（{year}年度・{METRICS.find((m) => m.key === metric).label}）
      </Typography>
      <Typography variant='caption' color='dimgrey' display='block'>
        面積が{METRICS.find((m) => m.key === metric).label}の大きさです。タイルをクリックすると
        区分→分類→診療行為の順に掘り下げられます（診療行為をクリックすると詳細ページへ）。
        売上＝算定回数×点数×10円の試算。
        {metric === 'pt' && '患者数は2024年度・公表されている診療行為のみの延べ合計です（未公表分は含まれません）。'}
      </Typography>

      {/* 指標切替＋パンくず */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', my: 1 }}>
        {METRICS.map((m) => (
          <Chip
            key={m.key}
            label={m.label}
            size='small'
            variant={metric === m.key ? 'filled' : 'outlined'}
            color={metric === m.key ? 'primary' : 'default'}
            onClick={() => setMetric(m.key)}
          />
        ))}
        <Box sx={{ mx: 1, borderLeft: '1px solid #ccc', height: 20 }} />
        <Chip
          label='全区分'
          size='small'
          variant={level.type === 'root' ? 'filled' : 'outlined'}
          onClick={() => setLevel({ type: 'root' })}
        />
        {level.type !== 'root' && (
          <>
            <span>›</span>
            <Chip
              label={level.sec}
              size='small'
              variant={level.type === 'cat' ? 'filled' : 'outlined'}
              onClick={() => setLevel({ type: 'cat', cat: level.cat, sec: level.sec })}
            />
          </>
        )}
        {level.type === 'sub' && (
          <>
            <span>›</span>
            <Chip label={`${level.bcd} ${level.bnm}`} size='small' variant='filled' />
          </>
        )}
      </Box>

      {loading && <Typography variant='body2'>読み込み中…</Typography>}
      {!loading && tiles.length === 0 && (
        <Typography variant='body2'>この条件で表示できるデータがありません。</Typography>
      )}
      {!loading && tiles.length > 0 && (
        <>
          <div data-tooltip-id='treemap-tooltip' onMouseLeave={() => setHoverIdx(null)}>
            <ResponsiveContainer width='100%' height={480}>
              <Treemap
                data={tiles}
                dataKey='size'
                nameKey='name'
                isAnimationActive={false}
                content={<Cell tiles={tiles} onTile={onTile} onHover={setHoverIdx} />}
              />
            </ResponsiveContainer>
          </div>
          {/* Desktop: カーソル追従ツールチップ / Mobile: 下部パネル */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <ReactTooltip
              id='treemap-tooltip'
              float={true}
              style={{
                backgroundColor: 'rgba(255,255,255,0.96)',
                color: '#333',
                border: '1px solid #a8a7a5',
                padding: '8px',
                maxWidth: '300px',
                zIndex: 9999,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              render={() => tooltipContent}
            />
          </Box>
          <Box sx={{ display: { xs: 'block', sm: 'none' }, minHeight: 90, border: '1px solid #eee', borderRadius: 1, p: 1, mt: 1 }}>
            {tooltipContent || (
              <Typography variant='caption' color='dimgrey'>タイルをタップすると内訳、ここに詳細が表示されます。</Typography>
            )}
          </Box>
          {dropped > 0 && (
            <Typography variant='caption' color='dimgrey' display='block'>
              ※値が0またはデータ未公表の{dropped}件は表示していません。
            </Typography>
          )}
        </>
      )}

      {/* 年次スライダー（患者数は2024のみのため無効） */}
      {metric !== 'pt' && (
        <Box maxWidth='600px'>
          <Box margin='auto' padding='0px 50px'>
            <Typography display='inline' gutterBottom>
              表示年度: <span style={{ fontWeight: 'bold' }}>{year}</span>年度
            </Typography>{' '}
            <Chip label='－' size='small' variant='outlined' onClick={() => step(-1)} />{' '}
            <Chip label='＋' size='small' variant='outlined' onClick={() => step(1)} />
            <Slider
              value={Number(year)}
              aria-label='year-slider'
              min={Number(years[0])}
              max={Number(years[years.length - 1])}
              step={null}
              valueLabelDisplay='auto'
              marks={marks}
              onChange={(e, v) => {
                if (typeof v === 'number') {
                  const ni = years.indexOf(String(v));
                  if (ni >= 0) setYearIdx(ni);
                }
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MedicalTreemap;
