'use client';
import { Box, Typography, Grid } from '@mui/material';
import classes from '@/components/d3css/retableh.module.css';
import theme from '@/theme';
import Link from 'next/link';
import React from 'react';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Surface,
  Symbols,
} from 'recharts';
const Select = dynamic(() => import('react-select').then((mod) => mod.default), {
  ssr: false,
  loading: () => null,
});

const App = ({ ssg2, hospital1, isLoaded, ydata }) => {
  const yearList = [];

  for (let i = 0; i < ssg2.def.time_basic.length; i++) {
    var thisYear = {};
    thisYear['value'] = ssg2.def.time_basic[i];
    thisYear['label'] = ssg2.def.time_basic[i];
    yearList.push(thisYear);
  }

  const yearLatest = ssg2.def.time_basic[ssg2.def.time_basic.length - 1];
  const [year, setYear] = useState(yearLatest);
  const [data, setData] = useState(ssg2.basic[yearLatest]);
  useEffect(() => {
    if (isLoaded) {
      ydata ? setData(ydata.basic[year]) : '';
    }
  }, [ydata, isLoaded, year]);

  const graphList = [
    { mdc: 'bed', value: 'bll', label: '総病床', unit: '床', rev: false },
    { mdc: 'bed', value: 'dpb', label: 'DPC病床', unit: '床', rev: false },
    { mdc: 'bed', value: 'bri', label: '回復期リハビリテーション病床', unit: '床', rev: false },
    { mdc: 'bed', value: 'bti', label: '地域包括ケア病床', unit: '床', rev: false },
    { mdc: 'bed', value: 'bps', label: '精神病床', unit: '床', rev: false },
    { mdc: 'bed', value: 'bry', label: '療養病床', unit: '床', rev: false },
    { mdc: 'bed', value: 'bke', label: '結核病床', unit: '床', rev: false },
    {
      mdc: 'ambulance',
      value: 'apn',
      label: '入院患者数　1ヶ月あたりの数',
      unit: '件',
      rev: false,
    },
    {
      mdc: 'ambulance',
      value: 'amn',
      label: '救急車による搬送　1ヶ月あたりの数',
      unit: '件',
      rev: false,
    },
    {
      mdc: 'ambulance',
      value: 'amr',
      label: '救急車による搬送の割合',
      unit: '%',
      rev: false,
    },
    { mdc: 'emergent', value: 'e1n', label: '予定外入院　1ヶ月あたりの数', unit: '件', rev: false },
    { mdc: 'emergent', value: 'e1r', label: '予定外入院の割合', unit: '%', rev: false },
    {
      mdc: 'emergent',
      value: 'e2n',
      label: '救急医療入院　1ヶ月あたりの数',
      unit: '件',
      rev: false,
    },
    { mdc: 'emergent', value: 'e2r', label: '救急医療入院の割合', unit: '%', rev: false },
    {
      mdc: 'referrel',
      value: 'rfn',
      label: '他院よりの紹介入院　1ヶ月あたりの数',
      unit: '件',
      rev: false,
    },
    { mdc: 'referrel', value: 'rfr', label: '他院よりの紹介入院の割合', unit: '%', rev: false },
    { mdc: 'outcome', value: 'o01', label: '退院時転帰: 治癒・軽快', unit: '%', rev: false },
    { mdc: 'outcome', value: 'o02', label: '退院時転帰: 寛解', unit: '%', rev: false },
    { mdc: 'outcome', value: 'o03', label: '退院時転帰: 不変', unit: '%', rev: false },
    { mdc: 'outcome', value: 'o04', label: '退院時転帰: 増悪', unit: '%', rev: false },
    {
      mdc: 'outcome',
      value: 'o05',
      label: '退院時転帰: 医療資源を最も投入した傷病による死亡',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'outcome',
      value: 'o06',
      label: '退院時転帰: 医療資源を最も投入した傷病以外による死亡',
      unit: '%',
      rev: false,
    },
    { mdc: 'outcome', value: 'o07', label: '退院時転帰: その他', unit: '%', rev: false },
    { mdc: 'route', value: 'h01', label: '入院経路: 家庭からの入院', unit: '%', rev: false },
    {
      mdc: 'route',
      value: 'h02',
      label: '入院経路: 他の病院・診療所からの転院',
      unit: '%',
      rev: false,
    },
    { mdc: 'route', value: 'h03', label: '入院経路: 介護施設・福祉施設', unit: '%', rev: false },
    { mdc: 'route', value: 'h04', label: '入院経路: 院内で出生', unit: '%', rev: false },
    { mdc: 'route', value: 'h05', label: '入院経路: その他', unit: '%', rev: false },
    {
      mdc: 'discharge',
      value: 'd01',
      label: '退院先: 家庭への退院（当院へ通院）',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'discharge',
      value: 'd02',
      label: '退院先: 家庭への退院（他院へ通院）',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'discharge',
      value: 'd03',
      label: '退院先: 家庭への退院（その他）',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'discharge',
      value: 'd04',
      label: '退院先: 他の病院・診療所への転院',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'discharge',
      value: 'd05',
      label: '退院先: 介護老人保健施設',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'discharge',
      value: 'd06',
      label: '退院先: 介護老人福祉施設',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'discharge',
      value: 'd07',
      label: '退院先: 社会福祉施設、有料老人ホーム等',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'discharge',
      value: 'd08',
      label: '退院先: 終了（死亡等）',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'discharge',
      value: 'd09',
      label: '退院先: その他',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'readmission',
      value: 'r01',
      label: '再入院の状況: 再入院',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'readmission',
      value: 'r02',
      label: '再入院の状況: 同一疾患での4週間以内の再入院',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'readmission',
      value: 'r03',
      label: '再入院の状況: 同一疾患での4週間を超えての再入院',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'readmission',
      value: 'r04',
      label: '再入院の状況: 異なる疾患での4週間以内の再入院',
      unit: '%',
      rev: false,
    },
    {
      mdc: 'readmission',
      value: 'r05',
      label: '再入院の状況: 異なる疾患での4週間を超えての再入院',
      unit: '%',
      rev: false,
    },
  ];
  const [graph, setGraph] = useState(graphList[7]);
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    if (ydata) {
      var child1 = [];
      Object.keys(ydata.basic).forEach((v0, i0) => {
        var child2 = {};
        child2['year'] = v0;
        child2[graph.label] = Number(ydata.basic[v0][graph.mdc][graph.value]);
        child1.push(child2);
      });
      setChartData(child1);
    }
  }, [graph, ydata]);
  return (
    <Box className={classes.retable}>
      {chartData != [] && (
        <Suiig
          ssg2={ssg2}
          graphList={graphList}
          graph={graph}
          setGraph={setGraph}
          chartData={chartData}
        />
      )}
      <Typography variant='h2' component='h2'>
        {ssg2.def.hospital}の基本情報と病床数 {year}
      </Typography>
      <Box sx={{ maxWidth: '400px' }}>
        {isLoaded && (
          <Select
            placeholder={'年度を選択する'}
            filterOption={false}
            options={yearList}
            onChange={(e) => {
              setYear(e.value);
            }}
            isSearchable={false}
            id='selectbox3'
            instanceId='selectbox3'
          />
        )}
      </Box>
      <Typography variant='body1'>
        病院類型：<span style={{ fontWeight: 'bold' }}>{data.bed.dpi}</span>
      </Typography>
      <Typography variant='body1'>
        DPC算定病床の入院基本料：<span style={{ fontWeight: 'bold' }}>{data.bed.dpk}</span>
      </Typography>
      <Box
        sx={{
          [theme.breakpoints.up('md')]: { width: '67%' },
        }}
      >
        <table className={[classes.hospital1, classes.table6].join(' ')}>
          <thead>
            <tr>
              <th>項目</th>
              <th>値</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link prefetch={false} href={`/bed/bed/#${hospital1}`}>
                  病床分類
                </Link>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>　総病床</td>
              <td>{data.bed.bll}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>　DPC病床</td>
              <td style={{ fontWeight: 'bold' }}>{data.bed.dpb}</td>
            </tr>
            <tr>
              <td>　回復期リハビリテーション病床</td>
              <td>{data.bed.bre}</td>
            </tr>
            <tr>
              <td>　地域包括ケア病床</td>
              <td>{data.bed.bti}</td>
            </tr>
            <tr>
              <td>　精神病床</td>
              <td>{data.bed.bps}</td>
            </tr>
            <tr>
              <td>　療養病床</td>
              <td>{data.bed.bry}</td>
            </tr>
            <tr style={{ borderBottom: 'solid 1px' }}>
              <td>　結核病床</td>
              <td>{data.bed.bke}</td>
            </tr>
            <tr>
              <td>
                <Link prefetch={false} href={`/hospital/#${hospital1}`}>
                  入院患者数
                </Link>
              </td>
              <td></td>
            </tr>
            <tr style={{ borderBottom: 'solid 1px' }}>
              <td>　入院患者数 1ヶ月あたりの数</td>
              <td>{data.ambulance.apn}件</td>
            </tr>
            <tr>
              <td>
                <Link prefetch={false} href={`/bed/ambulance/#${hospital1}`}>
                  救急搬送による入院
                </Link>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>　救急車による搬送 1ヶ月あたりの数</td>
              <td>{data.ambulance.amn}件</td>
            </tr>
            <tr style={{ borderBottom: 'solid 1px' }}>
              <td>　救急車による搬送の割合</td>
              <td>{data.ambulance.amr}％</td>
            </tr>
            <tr>
              <td>
                <Link prefetch={false} href={`/bed/emergent/#${hospital1}`}>
                  予定外入院・救急医療入院
                </Link>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>　予定外入院　1ヶ月あたりの数</td>
              <td>{data.emergent.e1n}件</td>
            </tr>
            <tr>
              <td>　予定外入院の割合</td>
              <td>{data.emergent.e1r}％</td>
            </tr>
            <tr>
              <td>　救急医療入院　1ヶ月あたりの数</td>
              <td>{data.emergent.e2n}件</td>
            </tr>
            <tr style={{ borderBottom: 'solid 1px' }}>
              <td>　救急医療入院の割合</td>
              <td>{data.emergent.e2r}％</td>
            </tr>
            <tr>
              <td>
                <Link prefetch={false} href={`/bed/referrel/#${hospital1}`}>
                  他院よりの紹介入院
                </Link>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>　他院よりの紹介入院　1ヶ月あたりの数</td>
              <td>{data.referrel.rfn}件</td>
            </tr>
            <tr style={{ borderBottom: 'solid 1px' }}>
              <td>　他院よりの紹介入院　割合</td>
              <td>{data.referrel.rfr}％</td>
            </tr>
            <tr>
              <td>
                <Link prefetch={false} href={`/bed/outcome/#${hospital1}`}>
                  退院時転帰
                </Link>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>　治癒・軽快</td>
              <td>{data.outcome.o01}％</td>
            </tr>
            <tr>
              <td>　寛解</td>
              <td>{data.outcome.o02}％</td>
            </tr>
            <tr>
              <td>　不変</td>
              <td>{data.outcome.o03}％</td>
            </tr>
            <tr>
              <td>　増悪</td>
              <td>{data.outcome.o04}％</td>
            </tr>
            <tr>
              <td>　医療資源を最も投入した傷病による死亡</td>
              <td>{data.outcome.o05}％</td>
            </tr>
            <tr>
              <td>　医療資源を最も投入した傷病以外による死亡</td>
              <td>{data.outcome.o06}％</td>
            </tr>
            <tr style={{ borderBottom: 'solid 1px' }}>
              <td>　その他</td>
              <td>{data.outcome.o07}％</td>
            </tr>
            <tr>
              <td>
                <Link prefetch={false} href={`/bed/route/#${hospital1}`}>
                  入院経路
                </Link>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>　家庭からの入院</td>
              <td>{data.route.h01}％</td>
            </tr>
            <tr>
              <td>　他の病院・診療所からの転院</td>
              <td>{data.route.h02}％</td>
            </tr>
            <tr>
              <td>　介護施設・福祉施設</td>
              <td>{data.route.h03}％</td>
            </tr>
            <tr>
              <td>　院内で出生</td>
              <td>{data.route.h04}％</td>
            </tr>
            <tr style={{ borderBottom: 'solid 1px' }}>
              <td>　その他</td>
              <td>{data.route.h05}％</td>
            </tr>
            <tr>
              <td>
                <Link prefetch={false} href={`/bed/discharge/#${hospital1}`}>
                  退院先
                </Link>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>　家庭への退院（当院へ通院）</td>
              <td>{data.discharge.d01}％</td>
            </tr>
            <tr>
              <td>　家庭への退院（他院へ通院）</td>
              <td>{data.discharge.d02}％</td>
            </tr>
            <tr>
              <td>　家庭への退院（その他）</td>
              <td>{data.discharge.d03}％</td>
            </tr>
            <tr>
              <td>　他の病院・診療所への転院</td>
              <td>{data.discharge.d04}％</td>
            </tr>
            <tr>
              <td>　介護老人保健施設</td>
              <td>{data.discharge.d05}％</td>
            </tr>
            <tr>
              <td>　介護老人福祉施設</td>
              <td>{data.discharge.d06}％</td>
            </tr>
            <tr>
              <td>　社会福祉施設、有料老人ホーム等</td>
              <td>{data.discharge.d07}％</td>
            </tr>
            <tr>
              <td>　終了（死亡等）</td>
              <td>{data.discharge.d08}％</td>
            </tr>
            <tr style={{ borderBottom: 'solid 1px' }}>
              <td>　その他</td>
              <td>{data.discharge.d09}％</td>
            </tr>

            <tr>
              <td>
                <Link prefetch={false} href={`/bed/readmission/#${hospital1}`}>
                  再入院の状況
                </Link>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>　再入院</td>
              <td>{data.readmission.r01}％</td>
            </tr>
            <tr>
              <td>　　同一疾患での4週間以内の再入院</td>
              <td>{data.readmission.r02}％</td>
            </tr>
            <tr>
              <td>　　同一疾患での4週間を超えての再入院</td>
              <td>{data.readmission.r03}％</td>
            </tr>
            <tr>
              <td>　　異なる疾患での4週間以内の再入院</td>
              <td>{data.readmission.r04}％</td>
            </tr>
            <tr style={{ borderBottom: 'solid 1px' }}>
              <td>　　異なる疾患での4週間を超えての再入院</td>
              <td>{data.readmission.r05}％</td>
            </tr>
          </tbody>
        </table>
      </Box>
    </Box>
  );
};
export default App;

const Suiig = ({ ssg2, graphList, setGraph, graph, chartData }) => {
  const CustomTooltip2 = (prps2) => {
    const payload = prps2.payload;
    const label = prps2.label;

    if (prps2.active && payload && payload.length) {
      return (
        <>
          <div>
            <Box
              sx={{
                backgroundColor: 'white',
                opacity: '0.9',
                padding: '5px 10px 5px 10px',
              }}
            >
              <Typography style={{ fontSize: '14px', color: 'dimgrey' }}>
                {label} {ssg2.def.hospital}
              </Typography>
              <table className={classes.tiptable} style={{ fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th>項目名</th>
                    <th>値</th>
                  </tr>
                </thead>
                <tbody>
                  {payload.map((v, i) => {
                    return (
                      <React.Fragment key={'t' + i}>
                        <tr>
                          <td>
                            <Surface width={10} height={10}>
                              <Symbols
                                cx={5}
                                cy={5}
                                type='circle'
                                size={50}
                                fill={payload[i].color}
                              />
                            </Surface>
                            {payload[i].dataKey}
                          </td>
                          <td style={{ color: payload[i].color }}>
                            {payload[i].value}
                            {graph.unit}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </div>
        </>
      );
    }

    return null;
  };
  ////////////////////////
  return (
    <>
      <Typography variant='h2' component='h2'>
        {ssg2.def.hospital}の基本情報と病床数の推移
      </Typography>
      <Box sx={{ maxWidth: '600px' }}>
        <Select
          placeholder={'項目を選択する'}
          filterOption={false}
          options={graphList}
          onChange={(e) => {
            setGraph(e);
          }}
          isSearchable={false}
          id='selectbox4'
          instanceId='selectbox4'
        />
      </Box>
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
            connectNulls
            type='monotone'
            dataKey={graph.label}
            stroke={'#464D9A'}
            dot={{ r: 0 }}
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
            reversed={graph.rev}
          />
          <Tooltip content={CustomTooltip2} wrapperStyle={{ zIndex: 1000 }} />
          <Legend
            align='left'
            wrapperStyle={{ paddingLeft: '50px' }}
            formatter={(value, entry, index) => <span className='text-color-class'>{value}</span>}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};
