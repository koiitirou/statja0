'use client';
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
    <Box sx={{ paddingTop: { xs: '10px', md: '10px' } }} maxWidth={theme.maxWidth}>
      <Typography variant='h1' component='h1'>
        {con_name}の処方数・売上・薬価の推移
      </Typography>
      <Windowed />
      <Pyramid2 res2={res2} con_name={con_name} />
    </Box>
  );
}
