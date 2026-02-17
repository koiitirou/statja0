'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import Search_country from '@/components/data/function/search_country';
import Pyramid2 from '@/components/data/function/Pyramid2';
import theme from '@/theme';

export default function PyramidClient({ iso2, res2, res3, con_name }) {
  if (!res2 || res2.length === 0) {
    return (
      <Layout>
        <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
          <Typography>データが見つかりませんでした。</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Search_country res3={res3} />
          <Typography variant='h1' sx={{ background: 'lightgrey', padding: '8px' }}>
            {con_name}の人口ピラミッド
          </Typography>

          <Pyramid2 res2={res2} res3={res3} con_name={con_name} iso2={iso2} />
        </Box>
      </Box>
    </Layout>
  );
}

