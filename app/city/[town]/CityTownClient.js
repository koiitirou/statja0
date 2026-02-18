'use client';
import { Layout } from '@/components/layout';
import Cit_link from '@/components/data/function/cit_link';
import Cit_windowed from '@/components/data/function/cit_windowed';
import { Box, Typography } from '@mui/material';
import theme from '@/theme';
import cit_path from '@/components/cit_path/cit_path.json';
import Breadcrumb from '@/components/Breadcrumb';

const ref2 = cit_path.pref;

export default function CityTownClient({ json1, town, array4 }) {
  const ref1 = array4.find((v) => v.params.town == town)?.params;
  if (!ref1) return null;

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: '市区町村ランキング', href: '/city' }, { name: ref1.nam }]} />
          <Cit_windowed />
          <Cit_link ref1={ref1} json1={json1} array4={array4} ref2={ref2} />
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
}
