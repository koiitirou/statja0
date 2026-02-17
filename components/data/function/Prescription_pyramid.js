'use client';
import React, { Fragment, PureComponent } from 'react';
import Link from 'next/link';
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
  LabelList,
  CartesianGrid,
} from 'recharts';
import classes from '@/components/d3css/retable.module.css';
import { Box, Typography, Chip, Grid } from '@mui/material';
//import e0 from 'public/comp/data/pop/y5out/AD.json';
import Slider from '@mui/material/Slider';
import { useState, useEffect, memo } from 'react';
import { geoCentroid } from 'd3-geo';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import palette1 from '@/components/dpc/palette.json';

/// Map chart
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

const Pyramid2 = (props) => {
  const con_name = props.con_name;
  const res2 = props.res2;
  const df0 = res2.def;
  const e0 = res2.dat;

  const dmx1 = df0.mx + 2;
  const shn = props.res2.def.shn;
  const salesData = [];
  const sale2Data = [];
  const sale3Data = [];
  const chartData = [];
  const sumData = [];
  const marks = [];
  const genData = [];
  const yakkaData = [];
  // const data1 = [];

  const [isMounted, setIsMounted] = useState(false); // Need this for the react-tooltip
  useEffect(() => {
    setIsMounted(true);
  }, []);

  e0.forEach((v) => {
    yakkaData.unshift({ year: Number(v.yrs), 薬価: v.val.dp });
    salesData.unshift({ year: Number(v.yrs), 売上: v.val.sl });
    sale2Data.unshift({
      year: Number(v.yrs),
      外来院外: v.val.so,
      外来院内: v.val.si,
      入院: v.val.sa,
    });
    sale3Data.unshift({ year: Number(v.yrs), 先発品: v.val.sn, 後発品: v.val.sy });
    //marks.push({ value: Number(v.yrs), label: v.yrs });
    marks.unshift({ value: Number(v.yrs) });
    //data1.push({ x: Number(v.yrs), y: v.val.ct.y, m: v.val.ct.m, o: v.val.ct.o });
    chartData.unshift({ year: Number(v.yrs), 総処方数: v.val.pp, 女性: v.val.fs, 男性: v.val.ms });
    sumData.unshift({
      year: Number(v.yrs),
      外来院外: v.val.ou,
      外来院内: v.val.nn,
      入院: v.val.ad,
    });
    genData.unshift({ year: Number(v.yrs), 先発品: v.val.gn, 後発品: v.val.gy });
  });

  return (
    <>
      <Typography variant='h2' component='h2'>
        {con_name}の基本情報
      </Typography>
      <Box className={classes.retable}>
        <table className={[classes.table6, classes.info1].join(' ')}>
          <thead>
            <tr>
              <th>項目　</th>
              <th>値</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>処方区分</td>
              <td>{df0.shn}</td>
            </tr>
            <tr>
              <td>剤形</td>
              <td>{df0.kbd}</td>
            </tr>
            <tr>
              <td>薬効分類名称</td>
              <td>
                {df0.e2d ? (
                  df0.e2d.map((v, i) => (
                    <Fragment key={'l' + i}>
                      <Link prefetch={false} href={'/ndb/' + df0.shd + '_' + v}>
                        {df0.e2m[i]}
                      </Link>
                      {i != df0.e2d.length - 1 && <span>　</span>}
                    </Fragment>
                  ))
                ) : (
                  <Link prefetch={false} href={'/ndb/' + df0.shd + '_' + df0.eid}>
                    {df0.enm}
                  </Link>
                )}
              </td>
            </tr>
            <tr>
              <td>効能・作用機序</td>
              <td>
                {df0.kkd &&
                  df0.kkd.map((vv, ii) => {
                    return (
                      <Fragment key={'kk' + ii}>
                        <Link prefetch={false} href={'/ndb/sum_' + vv + '_' + df0.kbn}>
                          {df0.kkn[ii]}
                        </Link>
                        {ii != df0.kkd.length - 1 && <span>　</span>}
                      </Fragment>
                    );
                  })}
              </td>
            </tr>
            <tr>
              <td>病気名・疾患名</td>
              <td>
                {df0.ksd &&
                  df0.ksd.map((vv, ii) => {
                    return (
                      <Fragment key={'ks' + ii}>
                        <Link prefetch={false} href={'/ndb/sum_' + vv + '_' + df0.kbn}>
                          {df0.ksk[ii]}
                        </Link>
                        {ii !== df0.ksd.length - 1 && <span>　</span>}
                      </Fragment>
                    );
                  })}
              </td>
            </tr>
            <tr>
              <td>一般名・主成分</td>
              <td>
                <Link prefetch={false} href={'/ndb/prescription/' + df0.shd + '_' + df0.dc2}>
                  {df0.dng}
                </Link>
              </td>
            </tr>
            <tr>
              <td>処方数</td>
              <td>
                {res2.dat[0].val.pf}
                {df0.ei2 == 'ind' && df0.unt}
              </td>
            </tr>
            <tr>
              <td>売上</td>
              <td>{res2.dat[0].val.sl.toLocaleString()}円</td>
            </tr>
            {df0.ei2 == 'ind' && (
              <>
                <tr>
                  <td>商品名</td>
                  <td>
                    <Link prefetch={false} href={'/ndb/prescription/' + df0.shd + '_' + df0.i_1}>
                      {df0.n_1}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>薬価</td>
                  <td>{df0.dp2}</td>
                </tr>
                <tr>
                  <td>レセプト用医薬品コード</td>
                  <td>{df0.i_1}</td>
                </tr>
                <tr>
                  <td>薬価基準収載医薬品コード</td>
                  <td>{df0.dcl}</td>
                </tr>
              </>
            )}
            <tr>
              <td>同成分薬</td>
              <td>
                <Grid container columns={12}>
                  {df0.dsm.map((n1, i1) => (
                    <Grid key={'s' + i1} size={{ xs: 12, lg: 6 }}>
                      <Link
                        prefetch={false}
                        href={'/ndb/prescription/' + df0.shd + '_' + df0.dsd[i1]}
                      >
                        {n1}
                      </Link>
                      {'　'}
                    </Grid>
                  ))}
                </Grid>
              </td>
            </tr>
          </tbody>
        </table>
      </Box>
      {df0.ei2 == 'ind' && isMounted && (
        <Yakka
          con_name={con_name}
          res2={props.res2}
          chartData={yakkaData}
          title={'薬価'}
          unit={''}
          lineColor={'#8884d8'}
        />
      )}
      {df0.ei2 == 'ind' && isMounted && (
        <Yakka
          con_name={con_name}
          res2={props.res2}
          chartData={salesData}
          title={'売上'}
          unit={'円'}
          lineColor={palette1[15]}
        />
      )}
      {df0.ei2 == 'gen' && isMounted && (
        <Generic res2={res2} genData={sale3Data} con_name={con_name} dataType={'sales'} />
      )}
      {df0.ei2 == 'gen' && isMounted && (
        <Generic res2={res2} genData={genData} con_name={con_name} dataType={'amount'} />
      )}

      {isMounted && <Kubun res2={res2} sumData={sumData} con_name={con_name} />}

      {isMounted && <AreaSex e0={e0} chartData={chartData} con_name={con_name} df0={df0} />}

      {isMounted && <Pyramid3 res2={res2} marks={marks} con_name={con_name} />}

      {isMounted && <Map1 res2={res2} marks={marks} con_name={con_name} isMounted={isMounted} />}
    </>
  );
};
export default Pyramid2;

const AreaSex = ({ con_name, e0, df0, chartData }) => {
  const d0 = e0[0];
  const d1 = d0.val;
  const l0 = e0[e0.length - 1];

  const toPercent = (decimal, fixed1 = 0) => `${(decimal * 100).toFixed(fixed1)}%`;
  const toPercent2 = (decimal) => `${(decimal * 100).toFixed(0)}%`;

  const getPercent = (value, total) => {
    const ratio = total > 0 ? value / total : 0;

    return toPercent(ratio, 2);
  };

  const rsp1 = {
    女性: '女性',
    男性: '男性',
  };
  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;

    return <span style={{ color }}>{rsp1[value]}</span>;
  };

  const renderTooltipContent = (o) => {
    const { payload, label } = o;
    const total = payload.reduce((result, entry) => result + entry.value, 0);
    return (
      <div className='squaire-toolbox'>
        <Box
          sx={{
            backgroundColor: 'white',
            opacity: '0.9',
            padding: '5px 10px 5px 10px',
          }}
        >
          <Typography className='total'>{`${label}年 (合計: ${total.toLocaleString()} )`}</Typography>
          <Grid container rowspacing={1} columns={6} columnSpacing={1} maxWidth='300px'>
            {[...payload].reverse().map((entry, index) => (
              <React.Fragment key={`item-${index}`}>
                <Grid size={1.5}>
                  <Typography sx={{ fontSize: '1.2em', color: entry.color }}>
                    {`${rsp1[entry.name]}`}
                  </Typography>
                </Grid>
                <Grid size={2.5}>
                  <Typography sx={{ fontSize: '1.2em', color: entry.color }} align='right'>
                    {`${entry.value.toLocaleString()}`}
                  </Typography>
                </Grid>
                <Grid size={2}>
                  <Typography sx={{ fontSize: '1.2em', color: entry.color }} align='right'>
                    {`${getPercent(entry.value, total)}`}
                  </Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </div>
    );
  };

  return (
    <>
      <Typography component='h2' variant='h2'>
        {con_name}の男女別の処方数 {l0.yrs}〜{d0.yrs}年【{df0.kbd}】
      </Typography>
      <ResponsiveContainer height={400}>
        <AreaChart
          width={600}
          height={400}
          data={chartData}
          stackOffset='expand'
          margin={{
            top: 5,
            right: 5,
            left: -50,
            bottom: 5,
          }}
          style={{
            fontSize: '0.8em',
          }}
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
            tickFormatter={toPercent2}
          />
          <Legend formatter={renderColorfulLegendText} />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

const Pyramid3 = (props) => {
  const marks = props.marks;

  const con_name = props.con_name;
  const res2 = props.res2;
  const df0 = res2.def;
  const e0 = res2.dat;
  const d0 = e0[0];
  const d1 = d0.val;
  const l0 = e0[e0.length - 1];

  const dmx1 = df0.mx + 2;
  const dmx2 = dmx1 * -1;
  const shn = props.res2.def.shn;

  const [value, setValue] = useState(d0.yrs);
  const [def, setDef] = useState(d1);
  const [pop, setPop] = useState(d1.pf);
  useEffect(() => {
    if (e0.find((s) => s.yrs == value) != undefined) {
      setDef(e0.find((s) => s.yrs == value).val);
      setPop(e0.find((s) => s.yrs == value).val.pf);
    }
  }, [value, e0]);
  const handleChange = (event, value) => {
    if (typeof value === 'number') {
      setValue(value);
    }
  };

  const renderLabelFemale = (props) => {
    return Number(props) != 0 ? `${(Number(props) * -1).toFixed(1)}%` : '';
  };
  const renderLabelMale = (props) => {
    return `${Number(props).toFixed(1)}%`;
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div id='custom-tooltip-toolbox' className='squaire-toolbox'>
          <Box
            sx={{
              backgroundColor: 'white',
              opacity: '0.9',
              padding: '5px 10px 5px 10px',
            }}
          >
            <Typography
              sx={{ fontSize: '1.2em', color: 'dimgrey' }}
            >{`${payload[0].payload.l}歳`}</Typography>
            <span style={{ fontSize: '1.3em', color: '#EE7989' }}>
              {`${payload[0].payload.f.toLocaleString()}`}
            </span>
            {'  '}
            <span style={{ fontSize: '1.3em', color: 'steelblue' }}>
              {`${payload[1].payload.m.toLocaleString()}`}
            </span>
          </Box>
        </div>
      );
    }

    return null;
  };

  return (
    <Box>
      {' '}
      <Typography component='h2' variant='h2'>
        {con_name}の処方数ピラミッド {l0.yrs}〜{d0.yrs}年（男女別、年齢別【5歳階級】）【{df0.kbd}】
      </Typography>
      <ResponsiveContainer height={400}>
        <BarChart
          layout='vertical'
          stackOffset='sign'
          width={600}
          height={400}
          data={def.dt}
          margin={{
            top: 5,
            right: 5,
            left: -50,
            bottom: 5,
          }}
          style={{
            fontSize: '0.8em',
          }}
          barCategoryGap={0}
        >
          <XAxis
            type='number'
            tickFormatter={(tick) => {
              if (tick < 0) return Number(tick) * -1;
              else return Number(tick);
            }}
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
            <LabelList
              dataKey='g'
              position='right'
              formatter={renderLabelFemale}
              style={{
                fill: 'rgb(102, 102, 102)',
              }}
            />
          </Bar>
          <Bar name='男性' dataKey='n' stackId='b' fill='steelblue'>
            <LabelList
              dataKey='n'
              position='right'
              formatter={renderLabelMale}
              style={{
                fill: 'rgb(102, 102, 102)',
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <Box maxWidth='600px'>
        <Box margin='auto' padding='0px 50px'>
          <Typography gutterBottom sx={{ paddingRight: '0px' }}>
            <span>総処方数： </span>
            <span style={{ fontWeight: 'bold' }}>{pop}</span>
          </Typography>
          <Typography display='inline' gutterBottom sx={{ paddingRight: '0px' }}>
            表示年度: <span style={{ fontWeight: 'bold' }}>{value}</span>年　
          </Typography>
          <Chip
            label='－'
            size='small'
            variant='outlined'
            onClick={() => {
              var ind1 = marks.findIndex((ss) => ss.value == value);
              marks[ind1 - 1] ? setValue(marks[ind1 - 1].value) : null;
            }}
          />{' '}
          <Chip
            label='＋'
            size='small'
            variant='outlined'
            onClick={() => {
              var ind1 = marks.findIndex((ss) => ss.value == value);
              marks[ind1 + 1] ? setValue(marks[ind1 + 1].value) : null;
            }}
          />
          <Slider
            value={Number(value)}
            aria-label='non-linear-slider'
            defaultValue={Number(d0.yrs)}
            min={Number(l0.yrs)}
            max={Number(d0.yrs)}
            //valueLabelFormat={valueLabelFormat}
            //getAriaValueText={valuetext}
            step={null}
            valueLabelDisplay='auto'
            marks={marks}
            onChange={handleChange}
            /* onChangeCommitted={handleChangeCommitted} */
          />
        </Box>
      </Box>
    </Box>
  );
};

const Yakka = ({ con_name, res2, chartData, title, unit, lineColor }) => {
  return (
    <Box>
      <Typography variant='h2' component='h2'>
        {con_name}の{title} {res2.dat[res2.dat.length - 1].yrs}〜{res2.dat[0].yrs}年【
        {res2.def.kbd}】
      </Typography>
      <ResponsiveContainer height={400}>
        <LineChart
          width={600}
          height={400}
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: -50,
            bottom: 5,
          }}
        >
          <Line
            type='monotone'
            dataKey={title}
            stroke={lineColor}
            dot={{ r: 1.5, fill: lineColor }}
          />
          <XAxis dataKey='year' tick={{ fontSize: 12 }} />
          <YAxis
            domain={['auto', 'auto']}
            tickMargin={0}
            tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
            orientation='left'
            tickFormatter={(tick) => {
              if (tick >= 1000 && tick < 1000000) return Number(tick.toPrecision(3)) / 1000 + 'K';
              else if (tick >= 1000000 && tick < 1000000000)
                return Number(tick.toPrecision(3)) / 1000000 + 'M';
              else if (tick >= 1000000000) return Number(tick.toPrecision(3)) / 1000000000 + 'B';
              else return tick;
            }}
          />
          <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value) + unit} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

const Map1 = (props) => {
  /////Map chart
  const ref0 = props.res2.ref;
  const m0 = props.res2.pre;
  const df0 = props.res2.def;
  const con_name = props.con_name;
  const m00 = m0[0];
  const m0l = m0[m0.length - 1];
  const [mvalue, setMvalue] = useState(m00.yrs);
  const [mdata, setMdata] = useState(m00.val);
  const [mcontent, setMcontent] = useState('');
  const [mpop, setMpop] = useState(m00.val.pf);
  const [gid, setGid] = useState();
  const [html1, setHtml1] = useState();
  const isMounted = props.isMounted;

  // const minmax1 = [df0.mn1, df0.mx1];
  const minmax1 = [df0.mn1, df0.mx1];
  const colorScale1 = scaleQuantize().domain(minmax1).range(color1);
  const colorScale2 = scaleQuantize().domain(minmax1).range(color2);
  const handleChange1 = (event, value1) => {
    if (typeof value1 === 'number') {
      setMvalue(value1);
    }
  };
  useEffect(() => {
    if (m0.find((s) => s.yrs == mvalue) != undefined) {
      setMdata(m0.find((s) => s.yrs == mvalue).val);
      setMpop(m0.find((s) => s.yrs == mvalue).val.pf);
    }
  }, [mvalue, m0]);

  useEffect(() => {
    if (gid && mdata) {
      const html2 = () => {
        var cur2 = mdata.dt.find((s) => s.l === gid);
        return (
          <div>
            <Typography content='h6'>
              {cur2 ? ref0[cur2.l].td_name : ''} {mvalue}
            </Typography>

            <Box sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
              <table className='table'>
                <tbody>
                  <tr>
                    <th>分類</th>
                    <th>値</th>
                  </tr>

                  <tr>
                    <td>処方数</td>
                    <td>
                      {cur2
                        ? Number(cur2.m).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : ''}
                    </td>
                  </tr>
                  <tr>
                    <td>割合</td>
                    <td>
                      {cur2
                        ? Number(cur2.n).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : ''}
                      %
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </div>
        );
      };
      setHtml1(html2);
      setMcontent(html2);
    }
  }, [mvalue, gid]);
  const marks = props.marks;
  return (
    <Box>
      <Typography component='h2' variant='h2'>
        {con_name}の都道府県別の処方数 {m0l.yrs}〜{m00.yrs}年【{df0.kbd}】
      </Typography>
      <Box sx={{ maxWidth: '600px' }}>
        <Box margin='auto' padding='0px 50px'>
          <Typography display='inline' gutterBottom sx={{ paddingRight: '0px' }}>
            表示年度: <span style={{ fontWeight: 'bold' }}>{mvalue}</span>年　
          </Typography>
          <Chip
            label='－'
            size='small'
            variant='outlined'
            onClick={() => {
              const ind1 = marks.findIndex((ss) => ss.value == mvalue);
              marks[ind1 - 1] ? setMvalue(marks[ind1 - 1].value) : null;
            }}
          />{' '}
          <Chip
            label='＋'
            size='small'
            variant='outlined'
            onClick={() => {
              const ind1 = marks.findIndex((ss) => ss.value == mvalue);
              marks[ind1 + 1] ? setMvalue(marks[ind1 + 1].value) : null;
            }}
          />
          <Slider
            value={Number(mvalue)}
            aria-label='non-linear-slider'
            defaultValue={Number(m00.yrs)}
            min={Number(m0l.yrs)}
            max={Number(m00.yrs)}
            //valueLabelFormat={valueLabelFormat}
            //getAriaValueText={valuetext}
            step={null}
            valueLabelDisplay='auto'
            marks={marks}
            onChange={handleChange1}
          />
        </Box>
        <Typography gutterBottom sx={{ paddingRight: '0px' }}>
          <span>総処方数： </span>
          <span style={{ fontWeight: 'bold' }}>{mpop}</span>
        </Typography>
        <Box sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
          <div className='legend legend-horizontal legend-scale'>
            <span className='legend-value'>
              {Number(minmax1[0]).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className='legend-box' style={{ backgroundColor: '#f7fbff' }}></span>
            <span className='legend-box' style={{ backgroundColor: '#deebf7' }}></span>
            <span className='legend-box' style={{ backgroundColor: '#c6dbef' }}></span>
            <span className='legend-box' style={{ backgroundColor: '#9ecae1' }}></span>
            <span className='legend-box' style={{ backgroundColor: '#6baed6' }}></span>
            <span className='legend-box' style={{ backgroundColor: '#4292c6' }}></span>
            <span className='legend-box' style={{ backgroundColor: '#2171b5' }}></span>
            <span className='legend-box' style={{ backgroundColor: '#08519c' }}></span>
            <span className='legend-box' style={{ backgroundColor: '#08306b' }}></span>
            <span className='legend-value'>
              {Number(minmax1[1]).toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
            </span>
          </div>
        </Box>
        <ComposableMap
          data-tip=''
          projectionConfig={{ scale: 2000, center: [13, 6.25] }}
          /*      width={400}*/
          height={500}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => {
                  const centroid = geoCentroid(geo);
                  const cur = mdata.dt.find((s) => s.l === geo.id);
                  // const isna1 = mdata.find((x) => x.isval === geo.id);

                  const html1 = () => {
                    return (
                      <div>
                        <Typography content='h6'>
                          {cur ? ref0[cur.l].td_name : ''} {mvalue}
                        </Typography>

                        <Box sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
                          <table className='table'>
                            <tbody>
                              <tr>
                                <th>分類</th>
                                <th>値</th>
                              </tr>

                              <tr>
                                <td>処方数</td>
                                <td>
                                  {cur
                                    ? Number(cur.m).toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      })
                                    : ''}
                                </td>
                              </tr>
                              <tr>
                                <td>割合</td>
                                <td>
                                  {cur
                                    ? Number(cur.n).toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      })
                                    : ''}
                                  %
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Box>
                      </div>
                    );
                  };

                  return (
                    <g key={geo.rsmKey + 'name'}>
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        stroke='#FFF'
                        fill={cur ? colorScale1(cur.m) : 'lightgrey'}
                        onClick={() => {
                          setGid(geo.id);
                          setMcontent(html1);
                        }}
                        onMouseEnter={() => {
                          setGid(geo.id);
                          setMcontent(html1);
                        }}
                        style={{
                          default: {
                            outline: 'none',
                          },
                          hover: {
                            fill: '#F58462',
                            outline: 'none',
                          },
                          pressed: {
                            fill: '#F58462',
                            outline: 'none',
                          },
                        }}
                      ></Geography>
                      <Marker coordinates={centroid} pointerEvents={'none'}>
                        <text
                          y='7'
                          fontSize={20}
                          textAnchor='middle'
                          fill={cur ? colorScale2(cur.m) : 'black'}
                        >
                          {cur ? ref0[cur.l].short_name : ''}
                        </text>
                      </Marker>
                    </g>
                  );
                })}
              </>
            )}
          </Geographies>
        </ComposableMap>
        <div id='custom-tooltip-toolbox' className='squaire-toolbox'>
          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {isMounted && (
              <ReactTooltip id='map-tooltip' variant='light' float={true}>
                {mcontent}
              </ReactTooltip>
            )}
          </Box>
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>{mcontent}</Box>
        </div>
      </Box>
    </Box>
  );
};

const Kubun = (props) => {
  const con_name = props.con_name;

  const res2 = props.res2;
  const df0 = res2.def;
  const e0 = res2.dat;
  const d0 = e0[0];
  const d1 = d0.val;
  const l0 = e0[e0.length - 1];

  const dmx1 = df0.mx + 2;
  const dmx2 = dmx1 * -1;
  const shn = res2.def.shn;
  const sumData = props.sumData;

  const CustomTooltip2 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sum1 = Number(payload[0].value) + Number(payload[1].value) + Number(payload[2].value);
      const val0 = Number(payload[0].value);
      const val1 = Number(payload[1].value);
      const val2 = Number(payload[2].value);
      return (
        <div className='squaire-toolbox'>
          <Box
            sx={{
              backgroundColor: 'white',
              opacity: '0.9',
              padding: '5px 10px 5px 10px',
            }}
          >
            <Typography style={{ fontSize: '1.2em', color: 'dimgrey' }}>{label}</Typography>
            <table className='table'>
              <tbody>
                <tr style={{ fontSize: '1.1em', color: 'dimgrey' }}>
                  <td>合計</td>
                  <td>{`${(
                    Number(payload[0].value) +
                    Number(payload[1].value) +
                    Number(payload[2].value)
                  ).toLocaleString()}`}</td>
                  <td></td>
                </tr>
                <tr style={{ fontSize: '1.1em', color: '#8884d8' }}>
                  <td>外来院外</td>
                  <td>{`${Number(payload[2].value).toLocaleString()}`}</td>
                  <td>{`${((val2 / sum1) * 100).toFixed(1)}`}%</td>
                </tr>
                <tr style={{ fontSize: '1.1em', color: '#82ca9d' }}>
                  <td>外来院内</td>
                  <td>{`${Number(payload[1].value).toLocaleString()}`}</td>
                  <td>{`${((val1 / sum1) * 100).toFixed(1)}`}%</td>
                </tr>
                <tr style={{ fontSize: '1.1em', color: '#ffc658' }}>
                  <td>入院</td>
                  <td>{`${Number(payload[0].value).toLocaleString()}`}</td>
                  <td>{`${((val0 / sum1) * 100).toFixed(1)}`}%</td>
                </tr>
              </tbody>
            </table>
          </Box>
        </div>
      );
    }

    return null;
  };

  return (
    <Box>
      {' '}
      <Typography component='h2' variant='h2'>
        {con_name}の区分別の処方数 {l0.yrs}〜{d0.yrs}年【{df0.kbd}】
      </Typography>
      <ResponsiveContainer height={400}>
        <AreaChart
          width={600}
          height={400}
          data={sumData}
          margin={{
            top: 5,
            right: 5,
            left: -50,
            bottom: 5,
          }}
        >
          {/* <Line type='monotone' dataKey='総処方数' stroke='#8884d8' dot={{ r: 0 }} />
    <Line type='monotone' dataKey='女性' stroke='#EE7989' dot={{ r: 0 }} />
    <Line type='monotone' dataKey='男性' stroke='steelblue' dot={{ r: 0 }} /> */}
          <Area type='monotone' dataKey='入院' stackId='1' stroke='#ffc658' fill='#ffc658' />{' '}
          <Area type='monotone' dataKey='外来院内' stackId='1' stroke='#82ca9d' fill='#82ca9d' />
          <Area type='monotone' dataKey='外来院外' stackId='1' stroke='#8884d8' fill='#8884d8' />
          <XAxis dataKey='year' tick={{ fontSize: 12 }} />
          <YAxis
            domain={['auto', 'auto']}
            tickMargin={0}
            tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
            orientation='left'
            tickFormatter={(tick) => {
              if (tick >= 1000 && tick < 1000000) return Number(tick.toPrecision(3)) / 1000 + 'K';
              else if (tick >= 1000000 && tick < 1000000000)
                return Number(tick.toPrecision(3)) / 1000000 + 'M';
              else if (tick >= 1000000000) return Number(tick.toPrecision(3)) / 1000000000 + 'B';
              else return tick;
            }}
          />
          {/* <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} /> */}
          <Tooltip content={CustomTooltip2} />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

const Generic = (props) => {
  const con_name = props.con_name;
  const dataType = props.dataType;
  const res2 = props.res2;
  const df0 = res2.def;
  const e0 = res2.dat;
  const d0 = e0[0];
  const d1 = d0.val;
  const l0 = e0[e0.length - 1];

  const dmx1 = df0.mx + 2;
  const dmx2 = dmx1 * -1;
  const shn = res2.def.shn;
  const genData = props.genData;

  const CustomTooltip2 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sum1 = Number(payload[0].value) + Number(payload[1].value);
      const val0 = Number(payload[1].value);
      const val1 = Number(payload[0].value);
      return (
        <div className='squaire-toolbox'>
          <Box
            sx={{
              backgroundColor: 'white',
              opacity: '0.9',
              padding: '5px 10px 5px 10px',
            }}
          >
            <Typography style={{ fontSize: '1.2em', color: 'dimgrey' }}>{label}</Typography>
            <table className='table'>
              <tbody>
                <tr style={{ fontSize: '1.1em', color: 'dimgrey' }}>
                  <td>合計</td>
                  <td style={{ textAlign: 'right' }}>
                    {`${Number(sum1.toFixed(0)).toLocaleString()}`}
                    {dataType == 'amount' ? '' : '円'}
                  </td>
                  <td></td>
                </tr>
                {/* <tr style={{ fontSize: '1.1em', color: '#8884d8' }}>
                  <td>外来院外</td>
                  <td>{`${Number(payload[2].value).toLocaleString()}`}</td>
                </tr> */}
                <tr style={{ fontSize: '1.1em', color: '#ffc658' }}>
                  <td>先発品</td>
                  <td style={{ textAlign: 'right' }}>
                    {' '}
                    {`${Number(val0.toFixed(0)).toLocaleString()}`}
                    {dataType == 'amount' ? '' : '円'}
                  </td>
                  <td>{`${((val0 / sum1) * 100).toFixed(1)}`}%</td>
                </tr>
                <tr style={{ fontSize: '1.1em', color: '#82ca9d' }}>
                  <td>後発品</td>
                  <td style={{ textAlign: 'right' }}>
                    {`${Number(val1.toFixed(0)).toLocaleString()}`}
                    {dataType == 'amount' ? '' : '円'}
                  </td>
                  <td>{`${((val1 / sum1) * 100).toFixed(1)}`}%</td>
                </tr>
              </tbody>
            </table>
          </Box>
        </div>
      );
    }

    return null;
  };
  return (
    <Box>
      {' '}
      <Typography component='h2' variant='h2'>
        {con_name}の先発・後発医薬品別の{dataType == 'amount' ? '処方数' : '売上'} {l0.yrs}〜
        {d0.yrs}年【{df0.kbd}】
      </Typography>
      <ResponsiveContainer height={400}>
        <AreaChart
          width={600}
          height={400}
          data={genData}
          margin={{
            top: 5,
            right: 5,
            left: -50,
            bottom: 5,
          }}
        >
          {/* <Line type='monotone' dataKey='総処方数' stroke='#8884d8' dot={{ r: 0 }} />
    <Line type='monotone' dataKey='女性' stroke='#EE7989' dot={{ r: 0 }} />
    <Line type='monotone' dataKey='男性' stroke='steelblue' dot={{ r: 0 }} /> */}
          <Area type='monotone' dataKey='後発品' stackId='1' stroke='#82ca9d' fill='#82ca9d' />
          <Area type='monotone' dataKey='先発品' stackId='1' stroke='#ffc658' fill='#ffc658' />
          {/* <Area type='monotone' dataKey='外来院外' stackId='1' stroke='#8884d8' fill='#8884d8' /> */}
          <XAxis dataKey='year' tick={{ fontSize: 12 }} />
          <YAxis
            domain={['auto', 'auto']}
            tickMargin={0}
            tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
            orientation='left'
            tickFormatter={(tick) => {
              if (tick >= 1000 && tick < 1000000) return Number(tick.toPrecision(3)) / 1000 + 'K';
              else if (tick >= 1000000 && tick < 1000000000)
                return Number(tick.toPrecision(3)) / 1000000 + 'M';
              else if (tick >= 1000000000) return Number(tick.toPrecision(3)) / 1000000000 + 'B';
              else return tick;
            }}
          />
          {/* <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} /> */}
          <Tooltip content={CustomTooltip2} />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
