'use client';
import { Layout } from '@/components/layout';
import theme from '@/theme';
import React from 'react';
import Cit_windowed from '@/components/data/function/cit_windowed';
import { Typography, Box, Grid } from '@mui/material';
import cit_path from '@/components/cit_path/cit_path.json';
import Link from 'next/link';

export default function CityPage() {
  const title1 = '市区町村データランキング';
  const description1 =
    '日本の市区町村データランキングの年次推移を、表・グラフ・地図でまとめました。人口、面積、密度、経済、行政、家計などの指標を調べることができます。';

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Typography variant='h1'>{title1}</Typography>
          <Typography variant='body1'>{description1}</Typography>
          <Cit_windowed />
          <Typography variant='h2'>市区町村ランキングのカテゴリー一覧</Typography>
          <Typography variant='body1'>
            　各市区町村の人口・面積・教育・財政などの統計データへのリンク一覧です。カッコ内の数字はそのカテゴリーのランキング数です。
          </Typography>
          <Grid container rowSpacing={0.5} columns={12} columnSpacing={4}>
            {Object.keys(cit_path.refs).map((v0, i0) => {
              var params0 = cit_path.refs[v0].params;
              return (
                <React.Fragment key={'s' + i0}>
                  {v0 != 'Z' && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant='h3'>
                        <Link href={'/city/' + params0.town} prefetch={false}>
                          {params0.nam}
                        </Link>
                        （ {params0.url.length}）
                      </Typography>
                    </Grid>
                  )}
                </React.Fragment>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}
