'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import Retable from '@/components/data/function/city_retable';
import theme from '@/theme';
import Cit_windowed from '@/components/data/function/cit_windowed';

export default function CityCategoryClient({ ssg1, city }) {
  const did1 = city;
  const unit1 = ssg1.def.ut1;
  const title1 = `${ssg1.def.tl1}の市区町村ランキング${ssg1.def.tmn}〜${ssg1.def.tmx}年【順位】`;
  const description1 = ` ${ssg1.def.tmx}年の1位は${
    ssg1.def.pre[0]
  }で${ssg1.def.val[0].toLocaleString()}${unit1}、2位は${
    ssg1.def.pre[1]
  }で${ssg1.def.val[1].toLocaleString()}${unit1}、3位は${
    ssg1.def.pre[2]
  }で${ssg1.def.val[2].toLocaleString()}${unit1}でした。`;

  /////////////////
  const tml = Array.isArray(ssg1.def.tml) ? ssg1.def.tml : [ssg1.def.tml];
  const marks = [];
  for (let i = 0; i < tml.length; i++) {
    var thisYear = {};
    thisYear['value'] = Number(tml[i]);
    marks.push(thisYear);
  }

  //////////////
  const columns = ssg1.tab[ssg1.def.tmx].columns;
  ///////////////
  function numberSort(rowA, rowB, id, desc) {
    let a = Number(rowA.values[id][0]);
    let b = Number(rowB.values[id][0]);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  function numberSor2(rowA, rowB, id, desc) {
    let a = Number(rowA.values[id]);
    let b = Number(rowB.values[id]);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  //////////////

  columns[3].sortType = numberSor2;
  //////////////
  const graphList = [
    { value: 'r', label: '順位', unit: '位', rev: true },
    { value: 'v', label: `${ssg1.def.tl1}`, unit: `${ssg1.def.ut1}`, rev: false },
    { value: 'd', label: '前年比', unit: '%', rev: false },
  ];
  const time_list2 = Array.isArray(ssg1.def.tml) ? ssg1.def.tml : [ssg1.def.tml];

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { maxWidth: '67%', margin: 'auto' },
          }}
        >
          <Cit_windowed />
          <Typography variant='h1' component='h1'>
            {title1}
          </Typography>
          <Typography variant='body1'>
            {'　'}
            {ssg1.def.tmn}〜{ssg1.def.tmx}年の
            {ssg1.def.tl1}
            について、市区町村ランキングを表形式にして、順位をまとめました。
          </Typography>
          <Typography variant='body1'>
            {'　'}
            {description1}
          </Typography>
          <Retable
            did1={did1}
            ssg1={ssg1}
            marks={marks}
            columns={columns}
            graphList={graphList}
            time_list2={time_list2}
          />
        </Box>
      </Box>
    </Layout>
  );
}
