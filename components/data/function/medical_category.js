'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Box, Typography, Chip } from '@mui/material';
import Slider from '@mui/material/Slider';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import palette1 from '@/components/dpc/palette.json';

const MAX_LINES = 12;
const tnum = (v) => (v == null ? '—' : Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 }));
const formatBig = (n) => {
  if (typeof n !== 'number') return '—';
  if (n >= 1e12) return (n / 1e12).toFixed(1) + '兆';
  if (n >= 1e8) return (n / 1e8).toFixed(1) + '億';
  if (n >= 1e4) return (n / 1e4).toFixed(1) + '万';
  return String(Math.round(n));
};
// Y軸: 40M など（処方薬を踏襲）
const kmb = (t) => {
  if (t >= 1e9) return Number(t.toPrecision(3)) / 1e9 + 'B';
  if (t >= 1e6) return Number(t.toPrecision(3)) / 1e6 + 'M';
  if (t >= 1e3) return Number(t.toPrecision(3)) / 1e3 + 'K';
  return t;
};
const oku = (t) => {
  if (t >= 1e12) return Number(t.toPrecision(3)) / 1e12 + '兆';
  if (t >= 1e8) return Number(t.toPrecision(3)) / 1e8 + '億';
  if (t >= 1e4) return Number(t.toPrecision(3)) / 1e4 + '万';
  return t;
};

const TABLE_SX = {
  borderCollapse: 'collapse',
  width: '100%',
  '& th': {
    fontSize: { xs: '12px', md: '14px' }, padding: '7px 4px', textAlign: 'center', lineHeight: '15px',
    borderBottom: '2px solid #ddd', whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none',
  },
  '& th.nosort': { cursor: 'default' },
  '& td': { fontSize: { xs: '12px', md: '14px' }, padding: '5px 4px', textAlign: 'right', whiteSpace: 'nowrap' },
  '& td.chk': { textAlign: 'center', width: '34px' },
  '& td.rank': { textAlign: 'center', color: 'dimgrey', width: '34px' },
  '& td.nm': { textAlign: 'left', minWidth: '160px', whiteSpace: 'normal' },
  '& td.cnt': { width: '170px' },
  '& tbody tr:nth-of-type(even)': { backgroundColor: '#f7f7f7' },
  '& td a': { textDecoration: 'none', color: '#1976d2' },
};

const colorOf = (i) => palette1[i % palette1.length];

const METRICS = [
  { key: 'cnt', label: '算定回数', unit: '回', tick: kmb, fn: (r, i) => (r.v ? r.v[i] : null) },
  { key: 'ten', label: '点数', unit: '点', tick: undefined, fn: (r, i) => (r.t ? r.t[i] : null) },
  { key: 'sales', label: '売上', unit: '円', tick: oku,
    fn: (r, i) => (r.v && r.t && r.v[i] != null && r.t[i] != null ? r.v[i] * r.t[i] * 10 : null) },
  { key: 'yoy', label: '前年比', unit: '%', tick: undefined,
    fn: (r, i) => (r.v && i > 0 && r.v[i] != null && r.v[i - 1] ? Math.round(((r.v[i] - r.v[i - 1]) / r.v[i - 1]) * 1000) / 10 : null) },
];

// sortable columns
const COLS = [
  { key: 'rank', label: '順位', get: (r) => r._rank, num: true },
  { key: 'nm', label: '診療行為名', get: (r) => r.nm, num: false },
  { key: 'cnt', label: '算定回数', get: (r) => r.cnt, num: true },
  { key: 'ten', label: '点数', get: (r) => (r.ten == null ? -Infinity : r.ten), num: true },
  { key: 'sales', label: '売上', get: (r) => (r.sales == null ? -Infinity : r.sales), num: true },
  { key: 'yoy', label: '前年比', get: (r) => (r.yoy == null ? -Infinity : r.yoy), num: true },
];

const CategoryView = ({ res, sec }) => {
  const { def } = res;
  const years = def.years; // asc, e.g. ["2015"..."2024"]
  const rows = useMemo(() => res.rows, [res.rows]);

  // year slider (recompute ranking locally from per-row v/t)
  const [year, setYear] = useState(Number(years[years.length - 1]));
  const marks = years.map((y) => ({ value: Number(y) }));
  const yearRows = useMemo(() => {
    const idx = years.indexOf(String(year));
    const list = rows
      .map((r) => {
        const cnt = r.v ? r.v[idx] : null;
        if (cnt == null) return null;
        const ten = r.t ? r.t[idx] : null;
        const prev = idx > 0 && r.v ? r.v[idx - 1] : null;
        const yoy = prev ? Math.round(((cnt - prev) / prev) * 1000) / 10 : null;
        const sales = ten != null ? cnt * ten * 10 : null;
        return { ...r, cnt, ten, sales, yoy };
      })
      .filter(Boolean);
    list.sort((a, b) => b.cnt - a.cnt);
    list.forEach((r, i) => (r._rank = i + 1));
    return list;
  }, [rows, year, years]);
  const maxCnt = yearRows.length ? yearRows[0].cnt : 1;
  const colorByMid = useMemo(() => {
    const m = {};
    rows.forEach((r, i) => (m[r.mid] = colorOf(i)));
    return m;
  }, [rows]);

  const [metricKey, setMetricKey] = useState('cnt');
  const metric = METRICS.find((m) => m.key === metricKey);

  // sorting
  const [sort, setSort] = useState({ key: 'rank', dir: 'asc' });
  const onSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'rank' || key === 'nm' ? 'asc' : 'desc' }));
  const sortedRows = useMemo(() => {
    const col = COLS.find((c) => c.key === sort.key);
    const arr = [...yearRows];
    arr.sort((a, b) => {
      let r;
      if (col.num) r = col.get(a) - col.get(b);
      else r = String(col.get(a)).localeCompare(String(col.get(b)), 'ja');
      return sort.dir === 'asc' ? r : -r;
    });
    return arr;
  }, [yearRows, sort]);

  // top 3 checked initially (by rank)
  const [selected, setSelected] = useState(() => new Set(rows.slice(0, 3).map((r) => r.mid)));
  const toggle = (mid) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(mid) ? next.delete(mid) : next.add(mid);
      return next;
    });

  const selectedRows = rows.filter((r) => selected.has(r.mid)).slice(0, MAX_LINES);
  const chartData = years.map((y, idx) => {
    const o = { year: Number(y) };
    selectedRows.forEach((r) => {
      o[r.mid] = metric.fn(r, idx);
    });
    return o;
  });

  const yoyCell = (yoy) => {
    if (yoy == null) return '—';
    const color = yoy > 0 ? '#d62345' : yoy < 0 ? '#2171b5' : 'dimgrey';
    return <span style={{ color }}>{`${yoy > 0 ? '+' : ''}${yoy}%`}</span>;
  };
  const arrow = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' 🔼' : ' 🔽') : '');

  return (
    <>
      <Typography variant='h2' component='h2'>
        {sec}の{metric.label}の推移 {years[0]}〜{years[years.length - 1]}年度
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', my: 1 }}>
        <Typography variant='caption' color='dimgrey'>
          指標：
        </Typography>
        <select value={metricKey} onChange={(e) => setMetricKey(e.target.value)} style={{ fontSize: '14px', padding: '2px 6px' }}>
          {METRICS.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>
        <Typography variant='caption' color='dimgrey'>
          ／下の表のチェックで表示（最大{MAX_LINES}件・初期は上位3件）
        </Typography>
      </Box>
      <ResponsiveContainer height={400}>
        <LineChart width={600} height={400} data={chartData} margin={{ top: 5, right: 5, left: -50, bottom: 5 }}>
          {selectedRows.map((r) => (
            <Line key={r.mid} type='monotone' dataKey={r.mid} name={r.nm} stroke={colorByMid[r.mid]} dot={{ r: 1, fill: colorByMid[r.mid] }} connectNulls />
          ))}
          <XAxis dataKey='year' tick={{ fontSize: 12 }} />
          <YAxis
            domain={['auto', 'auto']}
            tickMargin={0}
            tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
            orientation='left'
            tickFormatter={metric.tick}
          />
          <Tooltip formatter={(value, name) => [`${new Intl.NumberFormat('en').format(value)}${metric.unit}`, name]} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
        </LineChart>
      </ResponsiveContainer>

      {res.subs && res.subs.length > 0 && (
        <Box sx={{ my: 1 }}>
          <Typography variant='h3' component='h3'>
            {sec}の分類から絞り込む（{res.subs.length}分類）
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5 }}>
            {res.subs.map((s) => (
              <Typography key={s.bcd} variant='body2'>
                <Link prefetch={false} href={`/medical/sub/${s.bcd}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                  {s.bcd} {s.bnm}（{s.n}）
                </Link>
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      <Typography variant='h2' component='h2' sx={{ mt: 2 }}>
        {sec}の算定回数ランキング（{year}年度・全{yearRows.length}件）
      </Typography>
      <Typography variant='caption' color='dimgrey'>
        列見出しをクリックで並び替え。売上＝算定回数 × 点数 × 10円（1点＝10円）の試算値。
      </Typography>
      {/* 年度スライダー（処方薬ランキングを踏襲） */}
      <Box padding='6px 50px' maxWidth='600px'>
        <Typography display='inline' gutterBottom sx={{ paddingRight: '0px' }}>
          表示年度: <span style={{ fontWeight: 'bold' }}>{year}</span>年度
        </Typography>
        <Chip
          label='－'
          size='small'
          variant='outlined'
          onClick={() =>
            setYear((y) => {
              const i = marks.findIndex((m) => m.value === y);
              return marks[i - 1] ? marks[i - 1].value : y;
            })
          }
        />{' '}
        <Chip
          label='＋'
          size='small'
          variant='outlined'
          onClick={() =>
            setYear((y) => {
              const i = marks.findIndex((m) => m.value === y);
              return marks[i + 1] ? marks[i + 1].value : y;
            })
          }
        />
        <Slider
          value={year}
          aria-label='year-slider'
          defaultValue={Number(years[years.length - 1])}
          min={Number(years[0])}
          max={Number(years[years.length - 1])}
          step={null}
          valueLabelDisplay='auto'
          marks={marks}
          onChange={(e, v) => typeof v === 'number' && setYear(v)}
        />
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component='table' sx={TABLE_SX}>
          <thead>
            <tr>
              <th className='nosort'>表示</th>
              {COLS.map((c) => (
                <th key={c.key} onClick={() => onSort(c.key)}>
                  {c.label}
                  {arrow(c.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((r) => {
              const pct = maxCnt ? (r.cnt / maxCnt) * 100 : 0;
              return (
                <tr key={r.mid}>
                  <td className='chk'>
                    <input type='checkbox' checked={selected.has(r.mid)} onChange={() => toggle(r.mid)} aria-label={`${r.nm}をグラフに表示`} />
                  </td>
                  <td className='rank'>{r._rank}</td>
                  <td className='nm'>
                    <Link prefetch={false} href={`/medical/${r.mid}`}>
                      {r.nm}
                    </Link>
                  </td>
                  <td className='cnt'>
                    {/* 処方薬ランキングの数字+棒グラフ(p1〜p4)を踏襲 */}
                    <div style={{ position: 'relative', display: 'block' }}>
                      <div
                        style={{
                          position: 'absolute',
                          display: 'flex',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          whiteSpace: 'nowrap',
                          fontSize: '12px',
                        }}
                      >
                        {tnum(r.cnt)}
                      </div>
                      <div style={{ border: '1px solid lightgrey' }}>
                        <div style={{ height: '24px', width: `${pct}%`, backgroundColor: colorByMid[r.mid], display: 'block' }}></div>
                      </div>
                    </div>
                  </td>
                  <td>{r.ten != null ? `${tnum(r.ten)}点` : '—'}</td>
                  <td>{r.sales != null ? `${formatBig(r.sales)}円` : '—'}</td>
                  <td>{yoyCell(r.yoy)}</td>
                </tr>
              );
            })}
          </tbody>
        </Box>
      </Box>
    </>
  );
};
export default CategoryView;
