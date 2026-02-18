'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import React from 'react';
import Windowed from '@/components/data/function/world_windowed';
import Retable from '@/components/data/function/world_retable_top';
import Link from 'next/link';
import PopularClient from '@/components/data/function/popularClient.js';
import Breadcrumb from '@/components/Breadcrumb';

export default function WorldIndexClient({ columns, data, cls1, options1 }) {
  // sortType functions must be set in client component (can't serialize functions across server/client boundary)
  function stringSort(rowA, rowB, id, desc) {
    let a = String(rowA.values[id][0]);
    let b = String(rowB.values[id][0]);
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  columns[1].sortType = stringSort;
  columns[2].sortType = stringSort;
  columns[3].sortType = stringSort;
  columns[4].sortType = stringSort;

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: '世界ランキング' }]} />
        <Windowed />
        <Typography variant='h1' component='h1'>
          各統計の世界ランキング【国別順位】
        </Typography>
        <Typography variant='body1'>
          　各種統計に関する世界ランキング・統計データを1ページにまとめました。各リンク先では国別順位ランキング、前年比が一目で分かる表とグラフでまとめています。
        </Typography>
        <Typography variant='body1'>
          【英語版は
          <Link prefetch={false} href={'https://www.statrend.net/world/'}>
            こちら
          </Link>
          】
        </Typography>
        <Typography variant='h2'>よく見られているページ</Typography>
        <PopularClient path='world' />
        <Retable columns={columns} data={data} cls1={cls1} options1={options1} />
      </Box>
    </Layout>
  );
}
