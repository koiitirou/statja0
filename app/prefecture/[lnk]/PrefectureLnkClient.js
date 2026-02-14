'use client';
import { Layout } from '@/components/layout';
import Pr2_link from '@/components/data/function/pr2_link';
import Pr2_windowed from '@/components/data/function/pr2_windowed';
import { Box, Typography } from '@mui/material';
import theme from '@/theme';
import ref2 from '@/components/prefecture_list2.json';
import pr2_path from '@/components/pr2_path/pr2_path.json';
import yasai_path from '@/components/pr2_path/yasai_path.json';

var array4_full = [];
Object.keys(pr2_path.refs).forEach((v, i) => {
  array4_full.push(pr2_path.refs[v]);
});
Object.keys(yasai_path.refs).forEach((v, i) => {
  array4_full.push(yasai_path.refs[v]);
});

export default function PrefectureLnkClient({ json1, lnk, array4 }) {
  const ref1 = array4_full.find((v) => v.params.lnk == lnk)?.params;
  if (!ref1) return null;
  
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Pr2_windowed />
          <Pr2_link ref1={ref1} json1={json1} array4={array4_full} ref2={ref2} />
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
