'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import theme from '@/theme';

const Windowed = dynamic(
  () => import('@/components/data/function/prescription_windowed'),
  { ssr: false }
);
const Pyramid2 = dynamic(
  () => import('@/components/data/function/Prescription_pyramid'),
  { ssr: false }
);

export default function PrescriptionClient({ id2, res2, con_name }) {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box sx={{ [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' } }}>
          <Windowed />
          <Typography variant='h1' sx={{ background: 'lightgrey', padding: '8px' }}>
            {con_name}の処方数・売上・薬価の推移
          </Typography>
          <Pyramid2 res2={res2} con_name={con_name} />
        </Box>
      </Box>
    </Layout>
  );
}


