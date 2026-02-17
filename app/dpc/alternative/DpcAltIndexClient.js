'use client';
import { Box, Typography } from '@mui/material';
import { Layout } from '@/components/layout';
import React, { Fragment } from 'react';
import Search_dpc from '@/components/data/function/search_dpc';
import array4 from '@/public/comp/data/link/dpc_alternative_path.json';
import Link from 'next/link';
import PopularClient from '@/components/data/function/popularClient.js';
import theme from '@/theme';

const dcat = Array.from(
  new Set(
    array4.map((v) => {
      return v.params.dcat;
    }),
  ),
);

const DpcAltIndexClient = () => {
  const title1 = '病名一覧【病院の手術件数・治療実績ランキング】';
  const desc2 = `病名一覧から、全国・各都道府県の病院の診療実績（症例数、手術数、在院日数）を比較することができます。`;

  return (
    <Layout>
    <Box
      sx={{
        p: 1,
        maxWidth: '1300px',
        width: 'auto',
        margin: 'auto',
        [theme.breakpoints.up('md')]: { width: '67%' },
      }}
    >
      <Search_dpc />
      <Typography variant='h2'>よく見られている病院</Typography>
      <PopularClient path='hospital' />
      <Typography variant='h2'>よく見られている疾患名・病気</Typography>
      <PopularClient path='dpc' />
      <Typography variant='h1'>{title1}</Typography>
      <Typography variant='body1'>　{desc2}</Typography>
      {dcat.map((v, i) => {
        const darr = array4.filter((s) => s.params.dcat == v);
        return (
          <Fragment key={'v' + i}>
            <Typography variant='h2'>{v}</Typography>
            {darr.map((v0, i0) => {
              return (
                <Link
                  key={'s' + i0}
                  href={'/dpc/alternative/' + v0.params.dhsh}
                  prefetch={false}
                  style={{
                    margin: '0 10px',
                    textDecoration: 'none',
                    color: 'blue',
                  }}
                >
                  {v0.params.dext}
                </Link>
              );
            })}
          </Fragment>
        );
      })}
    </Box>
    </Layout>
  );
};

export default DpcAltIndexClient;
