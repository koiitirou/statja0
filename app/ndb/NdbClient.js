'use client';
import { Layout } from '@/components/layout';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import theme from '@/theme';
const Windowed = dynamic(
  () => import('@/components/data/function/prescription_windowed'),
  { ssr: false }
);

export default function NdbClient() {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box sx={{ [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' } }}>
          <Windowed />
        </Box>
      </Box>
    </Layout>
  );
}

