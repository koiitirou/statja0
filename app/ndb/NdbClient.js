'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import theme from '@/theme';
const Windowed = dynamic(
  () => import('@/components/data/function/prescription_windowed'),
  { ssr: false }
);

export default function NdbClient() {
  return (
    <Layout>
      <Box sx={{ paddingTop: { xs: '10px', md: '10px' } }} maxWidth={theme.maxWidth}>
        <Windowed />
      </Box>
    </Layout>
  );
}
