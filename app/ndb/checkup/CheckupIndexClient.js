'use client';
import { Layout } from '@/components/layout';
import { Box, Typography, Chip } from '@mui/material';
import Slider from '@mui/material/Slider';
import theme from '@/theme';
import React, { useState, Fragment } from 'react';
import classes from '@/components/d3css/mdc.module.css';
import { scaleQuantize } from 'd3-scale';
import Link from 'next/link';

const color1 = ['#F7FBFF','#DEEBF7','#C6DBEF','#9ECAE1','#6BAED6','#4292C6','#2171B5','#08519C','#08306B'];
const color2 = ['black','black','black','black','black','white','white','white','white'];
const color3 = ['#fee5e8','#fbc5cd','#f79baa','#f17287','#ee7989','#e44f67','#d62345','#ae1a39','#850e2c'];

export default function CheckupIndexClient({ checkup_path, summary_mean }) {
  const sum1 = summary_mean;
  const title1 = '特定健診データの平均値';
  const description1 = '特定健診データの平均値の推移を性別・年齢別・都道府県別にまとめました。';
  return (
    <Layout>
    <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
      <Typography variant='h1'>{title1}</Typography>
      <Typography variant='body1'>{description1}</Typography>
      <Typography variant='h2'>特定健診各項目の平均値（合計）{sum1[0].dat.eyr}</Typography>
      <Typography variant='body1'>各項目をクリックすることで詳細データを確認できます。</Typography>
      <Box className={classes.retable}>
        <table className={classes.table2}>
          <thead><tr><th>項目</th><th>女性</th><th>男性</th><th>単位</th></tr></thead>
          <tbody>
            {sum1.map((v0, i0) => (
              <Fragment key={'b' + i0}>
                <tr>
                  <td><Link prefetch={false} href={'/ndb/checkup/' + v0.def.i_3}>{v0.def.i_0}</Link></td>
                  <td>{v0.dat.ref}</td>
                  <td>{v0.dat.rem}</td>
                  <td>{v0.def.unt}</td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </Box>
      {sum1.map((v0, i0) => (<Fragment key={'a' + i0}><Table1 v0={v0} /></Fragment>))}
    </Box>
    </Layout>
  );
}

const Table1 = ({ v0 }) => {
  const def1 = v0.def.i_0;
  const marks = [];
  v0.dat.yal.forEach((v1) => { marks.push({ value: Number(v1.yrs) }); });
  const [value, setValue] = useState(Number(v0.dat.yal[v0.dat.yal.length - 1].yrs));
  const handleChange = (event, value) => { if (typeof value === 'number') { setValue(value); } };
  const dt1 = v0.dat.yal.find((s) => Number(s.yrs) == value);
  const minmax1 = [v0.dat.mnm, v0.dat.mxm];
  const minmax2 = [v0.dat.mnf, v0.dat.mxf];
  const colorScale1 = scaleQuantize().domain(minmax1).range(color1);
  const colorScale2 = scaleQuantize().domain(minmax1).range(color2);
  const colorScale3 = scaleQuantize().domain(minmax2).range(color3);
  const colorScale4 = scaleQuantize().domain(minmax2).range(color2);
  return (
    <Box>
      <Typography variant='h2'>{def1}の平均値の推移（年齢別）</Typography>
      <Link prefetch={false} href={'/ndb/checkup/' + v0.def.i_3} style={{ textDecoration: 'none' }}>【詳細データ】</Link>
      <Box maxWidth='600px'>
        <Box margin='auto' padding='0px 50px'>
          <Typography display='inline' gutterBottom sx={{ paddingRight: '0px' }}>
            表示年度: <span style={{ fontWeight: 'bold' }}>{value}</span>年　
          </Typography>
          <Chip label='－' size='small' variant='outlined' onClick={() => { const ind1 = marks.findIndex((ss) => ss.value == value); marks[ind1 - 1] ? setValue(marks[ind1 - 1].value) : null; }} />{' '}
          <Chip label='＋' size='small' variant='outlined' onClick={() => { const ind1 = marks.findIndex((ss) => ss.value == value); marks[ind1 + 1] ? setValue(marks[ind1 + 1].value) : null; }} />
          <Slider value={Number(value)} aria-label='non-linear-slider' defaultValue={Number(v0.dat.yal[v0.dat.yal.length - 1].yrs)} min={Number(v0.dat.yal[0].yrs)} max={Number(v0.dat.yal[v0.dat.yal.length - 1].yrs)} step={null} valueLabelDisplay='auto' marks={marks} onChange={handleChange} />
        </Box>
        <Box className={classes.retable}>
          <table className={classes.table1}>
            <thead><tr><th>年齢</th><th>女性</th><th>男性</th></tr></thead>
            <tbody>
              {dt1.val.map((v1, i1) => (
                <Fragment key={'h' + i1}>
                  {i1 == dt1.val.length - 1 && (<tr><td></td><td></td><td></td></tr>)}
                  <tr>
                    <td>{v1.l}</td>
                    <td style={{ color: colorScale4(v1.f), backgroundColor: colorScale3(v1.f) }}>{v1.f}</td>
                    <td style={{ color: colorScale2(v1.m), backgroundColor: colorScale1(v1.m) }}>{v1.m}</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
          <Box className='legend legend-horizontal legend-scale' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              <span className='legend-value'>女性　{minmax2[0]}</span>
              {color3.map((v, i) => (<span key={'s' + i} className='legend-box' style={{ backgroundColor: v }}></span>))}
              <span className='legend-value'>{minmax2[1]} {v0.def.unt}</span>
            </span>
          </Box>
          <Box className='legend legend-horizontal legend-scale' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ textAlign: 'right' }}>
              <span className='legend-value'>男性　{minmax1[0]}</span>
              {color1.map((v, i) => (<span key={'s' + i} className='legend-box' style={{ backgroundColor: v }}></span>))}
              <span className='legend-value'>{minmax1[1]} {v0.def.unt}</span>
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
