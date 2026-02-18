'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import Windowed from '@/components/data/function/world_windowed';
import Retable from '@/components/data/function/world_retable_country';
import Link from 'next/link';
import theme from '@/theme';
import Breadcrumb from '@/components/Breadcrumb';

export default function CountryClient({
  country,
  columns,
  data,
  cls1,
  options1,
  title,
  description,
}) {
  // sortType functions must be set in client component (can't serialize functions across server/client boundary)
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
  columns[2].sortType = NumberSort1;
  columns[3].sortType = NumberSort2;

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: '世界ランキング', href: '/world' }, { name: cls1[country].jpn }]} />
          <Windowed />
          <Typography variant='h1'>{title}</Typography>
          <Box sx={{ width: '100%', typography: 'body1' }}></Box>
          <Typography variant='body1'>{description}</Typography>
          <Typography variant='body1'>
            【英語版は
            <Link prefetch={false} href={'https://www.statrend.net/world/country/' + country}>
              こちら
            </Link>
            】
          </Typography>
          <Typography variant='h2'>{cls1[country].jpn}の統計データランキング</Typography>
          <Retable
            columns={columns}
            data0={data}
            cls1={cls1}
            options1={options1}
            country={country}
          />
        </Box>
      </Box>
    </Layout>
  );
}
