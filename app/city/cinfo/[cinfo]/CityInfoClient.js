'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import theme from '@/theme';
import Cit_windowed from '@/components/data/function/cit_windowed';
import Retable from '@/components/data/function/city_retable_cinfo';
import cit_path from '@/components/cit_path/cit_path.json';
import Breadcrumb from '@/components/Breadcrumb';

const ref2 = cit_path.pref;

export default function CityInfoClient({ cinfo, res2 }) {
  const prefec = cinfo;
  const ssg1 = res2;
  const columns = ssg1.columns;
  const data = ssg1.data;
  const category1 = ssg1.category;
  const th_prefec = ref2[prefec];
  const title1 = th_prefec ? th_prefec.jln + 'の統計ランキング' : '統計ランキング';
  const description1 = th_prefec
    ? th_prefec.jln +
      'の統計データランキング・年次推移をまとめました。データの詳細・順位・前年比がわかるページへリンクしています。'
    : '';

  function NumberSort1(rowA, rowB, id, desc) {
    let a = Number(rowA.values[id]);
    let b = Number(rowB.values[id]);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  function NumberSort2(rowA, rowB, id, desc) {
    let a = Number(rowA.values[id][0]);
    let b = Number(rowB.values[id][0]);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  columns[1].sortType = NumberSort1;
  columns[2].sortType = NumberSort2;
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: '市区町村ランキング', href: '/city' }, { name: th_prefec ? th_prefec.jln : '' }]} />
          <Cit_windowed />
          <Typography variant='h1'>{title1}</Typography>
          <Typography variant='body1'>{description1}</Typography>
          <Retable data={data} columns={columns} category1={category1} th_prefec={th_prefec} />
        </Box>
      </Box>
    </Layout>
  );
}
