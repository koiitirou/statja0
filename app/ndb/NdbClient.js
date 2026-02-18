'use client';
import { Layout } from '@/components/layout';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import theme from '@/theme';
import Breadcrumb from '@/components/Breadcrumb';
const Windowed = dynamic(
  () => import('@/components/data/function/prescription_windowed'),
  { ssr: false }
);

export default function NdbClient() {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box sx={{ [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' } }}>
          <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: '処方薬ランキング' }]} />
          <Windowed />
        </Box>
      </Box>
    </Layout>
  );
}

