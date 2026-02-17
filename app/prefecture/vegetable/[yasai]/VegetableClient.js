'use client';
import { Layout } from '@/components/layout';
import Yasai_table from '@/components/data/function/yasai_table';
import Yasai_map from '@/components/data/function/yasai_map';
import Yasai_line from '@/components/data/function/yasai_line';
import { useState, useEffect } from 'react';
import { server } from '@/components/config';
import { Box, Typography } from '@mui/material';
import theme from '@/theme';
import { json } from 'd3-fetch';
import Pr2_windowed from '@/components/data/function/pr2_windowed';
import ref1 from '@/components/prefecture_list2.json';

const VegetableClient = ({ ssg1: initialSsg1, yasai }) => {
  var marks = [];
  for (let i = 0; i < initialSsg1.def.tml.length; i++) {
    var thisYear = {};
    thisYear['value'] = Number(initialSsg1.def.tml[i]);
    marks.push(thisYear);
  }

  const [ssg1, setSsg1] = useState(initialSsg1);
  const [isfetch, setIsfetch] = useState(false);

  useEffect(() => {
    if (!isfetch) {
      json(`${server}/yasaijson/${yasai}_int.json`).then((collection) => {
        setSsg1(collection);
      });
      setIsfetch(true);
    }
  }, []);

  const unit1 = initialSsg1.def.ut0;
  const title1 = `${
    initialSsg1.def.tl1 +
    '収穫量の都道府県ランキング【' +
    initialSsg1.def.tmn +
    '〜' +
    initialSsg1.def.tmx +
    '】'
  }`;

  const dd1_rnk = initialSsg1.def.rnk;
  const dd1_pre = initialSsg1.def.pre;
  const dd1_val = initialSsg1.def.val;
  const dd1_vlr = initialSsg1.def.vlr;
  const dd1_prc = [];
  initialSsg1.def.vlr.slice(-3).forEach((v, i) => {
    if (v < 0) {
      dd1_prc.push('mi1');
    } else if (v == 0) {
      dd1_prc.push('ne1');
    } else {
      dd1_prc.push('mi1');
    }
  });

  const Html2 = () => {
    return (
      <>
        {dd1_rnk[0]}位は{dd1_pre[0]}で{dd1_val[0].toLocaleString()}
        {initialSsg1.def.ut0} (
        <span className={dd1_prc[2]}>
          {dd1_vlr[0] >= 0 ? '+' : ''}
          {dd1_vlr[0]}%
        </span>
        )、 {dd1_rnk[1]}位は{dd1_pre[1]}で{dd1_val[1].toLocaleString()}
        {initialSsg1.def.ut0} (
        <span className={dd1_prc[1]}>
          {dd1_vlr[1] >= 0 ? '+' : ''}
          {dd1_vlr[1]}%
        </span>
        )、 {dd1_rnk[2]}位は{dd1_pre[2]}で{dd1_val[2].toLocaleString()}
        {initialSsg1.def.ut0} (
        <span className={dd1_prc[2]}>
          {dd1_vlr[2] >= 0 ? '+' : ''}
          {dd1_vlr[2]}%
        </span>
        )です。
      </>
    );
  };

  const graphList = [
    { value: 'r', label: '順位', unit: '位', rev: true },
    { value: 'v', label: '収穫量', unit: unit1, rev: false },
    { value: 'd', label: '前年比', unit: '%', rev: false },
    { value: 'f', label: '前年差', unit: unit1, rev: false },
    { value: 'n', label: '順位差', unit: '位', rev: false },
    { value: 's', label: '作付面積', unit: 'ha', rev: false },
    { value: 'a', label: '10a収量', unit: 'kg', rev: false },
    { value: 'h', label: '出荷量', unit: 't', rev: false },
  ];

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Pr2_windowed />
          <Typography variant='h1' component='h1'>
            {title1}
          </Typography>
          <Typography variant='body1'>
            {'　'}
            日本の各都道府県の{initialSsg1.def.tl1}収穫量ランキング・順位({initialSsg1.def.tmn}〜
            {initialSsg1.def.tmx}
            年)を表形式にしてまとめました。
          </Typography>
          <Typography variant='body1'>
            {'　'}
            {initialSsg1.def.tl1}の収穫量は日本全国で
            <b>
              {initialSsg1.def.sum}
              {unit1}
            </b>
            でした。
          </Typography>
          <Typography variant='body1'>
            {'　'}
            上位から、
            <Html2 />
          </Typography>
          <Yasai_map ssg1={ssg1} isfetch={isfetch} marks={marks} ref1={ref1} />
          <Yasai_line ssg1={ssg1} isfetch={isfetch} graphList={graphList} ref1={ref1} />
          <Yasai_table ssg1={ssg1} isfetch={isfetch} marks={marks} ref1={ref1} />
          <Typography
            variant='body2'
            fontStyle='italic'
            color='dimgrey'
            align='right'
            display='block'
          >
            出典：「政府統計の総合窓口(e-Stat)」
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
};

export default VegetableClient;
