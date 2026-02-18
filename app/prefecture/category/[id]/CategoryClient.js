'use client';
import { Layout } from '@/components/layout';
import Pr2_table from '@/components/data/function/pr2_table';
import Pr2_map from '@/components/data/function/pr2_map';
import Pr2_line from '@/components/data/function/pr2_line';
import { useState, useEffect } from 'react';
import { server } from '@/components/config';
import { Box, Typography } from '@mui/material';
import theme from '@/theme';
import { json } from 'd3-fetch';
import Pr2_windowed from '@/components/data/function/pr2_windowed';
import Link from 'next/link';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';

export default function CategoryClient({ ssg1: initialSsg1, id, thisRef0, thisRef1, thisRef2, thisRelated }) {
  var marks = [];
  for (let i = 0; i < initialSsg1.def.tml.length; i++) {
    var thisYear = {};
    thisYear['value'] = Number(initialSsg1.def.tml[i]);
    marks.push(thisYear);
  }

  const [ssg1, setSsg1] = useState(initialSsg1);
  const [isfetch, setIsfetch] = useState(false);

  useEffect(() => {
    setIsfetch(false);
    setSsg1(initialSsg1);
  }, [id, initialSsg1]);

  useEffect(() => {
    if (!isfetch) {
      json(`${server}/pr2json2/${id}_int.json`).then((collection) => {
        setSsg1(collection);
      });
      setIsfetch(true);
    }
  }, [id, isfetch]);

  const unit1 = initialSsg1.def.ut1;
  const title1 = `${
    initialSsg1.def.tl1 +
    'の都道府県ランキング【' +
    initialSsg1.def.tmn +
    '〜' +
    initialSsg1.def.tmx +
    '】'
  }`;

  const Html1 = () => {
    return (
      <>
        {initialSsg1.def.rnk[0]}位は{initialSsg1.def.pre[0]}で{initialSsg1.def.val[0].toLocaleString()}
        {initialSsg1.def.unit2} (
        <span className={initialSsg1.def.prc[0]}>
          {initialSsg1.def.lpr[0] >= 0 ? '+' : ''}
          {initialSsg1.def.lpr[0]}%
        </span>
        )、
        {initialSsg1.def.rnk[1]}位は{initialSsg1.def.pre[1]}で{initialSsg1.def.val[1].toLocaleString()}
        {initialSsg1.def.unit2} (
        <span className={initialSsg1.def.prc[1]}>
          {initialSsg1.def.lpr[1] >= 0 ? '+' : ''}
          {initialSsg1.def.lpr[1]}%
        </span>
        )、{initialSsg1.def.rnk[2]}位は{initialSsg1.def.pre[2]}で
        {initialSsg1.def.val[2].toLocaleString()}
        {initialSsg1.def.unit2} (
        <span className={initialSsg1.def.prc[2]}>
          {initialSsg1.def.lpr[2] >= 0 ? '+' : ''}
          {initialSsg1.def.lpr[2]}%
        </span>
        )です。
      </>
    );
  };

  const dd1_rnk = initialSsg1.def.rnk.slice(-3);
  const dd1_pre = initialSsg1.def.pre.slice(-3);
  const dd1_val = initialSsg1.def.val.slice(-3);
  const dd1_lpr = initialSsg1.def.lpr.slice(-3);
  const dd1_prc = initialSsg1.def.prc.slice(-3);

  const Html2 = () => {
    return (
      <>
        {dd1_rnk[2]}位は{dd1_pre[2]}で{dd1_val[2].toLocaleString()}
        {initialSsg1.def.unit2} (
        <span className={dd1_prc[2]}>
          {dd1_lpr[2] >= 0 ? '+' : ''}
          {dd1_lpr[2]}%
        </span>
        )、 {dd1_rnk[1]}位は{dd1_pre[1]}で{dd1_val[1].toLocaleString()}
        {initialSsg1.def.unit2} (
        <span className={dd1_prc[1]}>
          {dd1_lpr[1] >= 0 ? '+' : ''}
          {dd1_lpr[1]}%
        </span>
        )、 {dd1_rnk[0]}位は{dd1_pre[0]}で{dd1_val[0].toLocaleString()}
        {initialSsg1.def.unit2} (
        <span className={dd1_prc[0]}>
          {dd1_lpr[0] >= 0 ? '+' : ''}
          {dd1_lpr[0]}%
        </span>
        )です。
      </>
    );
  };

  const graphList = [
    { value: 'r', label: '順位', unit: '位', rev: true },
    { value: 'v', label: initialSsg1.def.tl1, unit: unit1, rev: false },
    { value: 'd', label: '前年比', unit: '%', rev: false },
    { value: 'f', label: '前年差', unit: unit1, rev: false },
    { value: 'n', label: '順位差', unit: '位', rev: false },
  ];

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: '都道府県ランキング', href: '/prefecture' }, { name: initialSsg1.def.tl1 }]} />
          <Pr2_windowed />
          <Typography variant='h1' component='h1'>
            {title1}
          </Typography>
          <Typography variant='body1'>
            {'　'}
            日本の各都道府県の{initialSsg1.def.tl1}ランキング・順位({initialSsg1.def.tmn}〜
            {initialSsg1.def.tmx}
            年)を表形式にしてまとめました。
          </Typography>
          <Typography variant='body1'>
            {'　'}
            上位から、
            <Html1 />
          </Typography>
          {'　'}最下位から、
          <Html2 />
          <Pr2_map ssg1={ssg1} isfetch={isfetch} marks={marks} />
          <Pr2_line ssg1={ssg1} isfetch={isfetch} graphList={graphList} />
          <Pr2_table ssg1={ssg1} isfetch={isfetch} marks={marks} />
          <Typography
            variant='body2'
            fontStyle='italic'
            color='dimgrey'
            align='right'
            display='block'
          >
            出典：「政府統計の総合窓口(e-Stat)」
          </Typography>
          <Related
            thisRef0={thisRef0}
            thisRef1={thisRef1}
            thisRelated={thisRelated}
            thisRef2={thisRef2}
          />
        </Box>
      </Box>
    </Layout>
  );
}

const Related = ({ thisRef1, thisRelated, thisRef2, thisRef0 }) => {
  const yasaiRef0 = [
    ['FR', { params: { lnk: 'fruit', nam: '果物' } }],
    ['VE', { params: { lnk: 'vegetable', nam: '野菜' } }],
  ];
  const mergeRef0 = thisRef0.concat(yasaiRef0);

  return (
    <>
      <Typography variant='h2'>{thisRef2.nm2}に関する項目</Typography>
      <Box pt={{ xs: 1 }} textAlign='center' display='flex' flexWrap='wrap' justifyContent='left'>
        {thisRelated.map((v, i) => (
          <Link
            key={'l' + i}
            href={'/prefecture/category/' + v.params.id}
            prefetch={false}
            style={{
              margin: '0 10px',
              textDecoration: 'none',
              color: 'blue',
            }}
          >
            {v.params.nm}
          </Link>
        ))}
      </Box>
      <Typography variant='h2'>{thisRef1.params.nam}に関するカテゴリー</Typography>
      <Box pt={{ xs: 1 }} textAlign='center' display='flex' flexWrap='wrap' justifyContent='left'>
        {Object.entries(thisRef1.params.c2s).map((v, i) => {
          return (
            <Link
              key={'m' + i}
              href={'/prefecture/' + thisRef1.params.lnk + '#grid' + i}
              prefetch={false}
              style={{
                margin: '0 10px',
                textDecoration: 'none',
                color: 'blue',
              }}
            >
              {v[1].nm2}
            </Link>
          );
        })}
      </Box>
      <Typography variant='h2'>大カテゴリー</Typography>
      {mergeRef0.map((v, i) => {
        return (
          <Link
            key={'n' + i}
            href={'/prefecture/' + v[1].params.lnk}
            prefetch={false}
            style={{
              margin: '0 10px',
              textDecoration: 'none',
              color: 'blue',
            }}
          >
            {v[1].params.nam}
          </Link>
        );
      })}
    </>
  );
};
