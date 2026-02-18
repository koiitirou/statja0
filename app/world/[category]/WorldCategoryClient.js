'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import Windowed from '@/components/data/function/world_windowed';
import Retable from '@/components/data/function/world_retable';
import Link from 'next/link';
import theme from '@/theme';
import Breadcrumb from '@/components/Breadcrumb';

export default function WorldCategoryClient({
  did1,
  ssg1,
  marks,
  columns,
  graphList,
  time_list2,
  cls1,
  title1,
  description1,
}) {
  // sortType functions must be set in client component (can't serialize functions across server/client boundary)
  function numberSort(rowA, rowB, id, desc) {
    let a = Number(rowA.values[id][0]);
    let b = Number(rowB.values[id][0]);
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  function stringSort(rowA, rowB, id, desc) {
    let a = String(rowA.values[id][0]);
    let b = String(rowB.values[id][0]);
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  columns[1].sortType = stringSort;
  columns[2].sortType = numberSort;
  columns[3].sortType = numberSort;

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { maxWidth: '67%', margin: 'auto' },
          }}
        >
          <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: '世界ランキング', href: '/world' }, { name: title1 }]} />
          <Windowed />
          <Typography variant='h1' component='h1'>
            {title1}
          </Typography>
          <Typography variant='body1'>
            {'　'}
            {ssg1.def.tmn}〜{ssg1.def.tmx}年の
            {ssg1.def.idj}
            について、各国の世界ランキングを表形式にして、国別順位をまとめました。
          </Typography>
          <Typography variant='body1'>
            {'　'}
            {description1}
          </Typography>
          <Typography variant='body1'>
            {'　'}
            {ssg1.def.dsj}
          </Typography>
          <Typography variant='body1'>
            【英語版は
            <Link prefetch={false} href={'https://www.statrend.net/world/category/' + did1}>
              こちら
            </Link>
            】
          </Typography>
          <Retable
            did1={did1}
            ssg1={ssg1}
            marks={marks}
            columns={columns}
            graphList={graphList}
            time_list2={time_list2}
            cls1={cls1}
          />
        </Box>
      </Box>
    </Layout>
  );
}
