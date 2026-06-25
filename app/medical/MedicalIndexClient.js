'use client';
import { Layout } from '@/components/layout';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import theme from '@/theme';
import Breadcrumb from '@/components/Breadcrumb';
const Windowed = dynamic(
  () => import('@/components/data/function/medical_windowed'),
  { ssr: false }
);

export default function MedicalIndexClient() {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box sx={{ [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' } }}>
          <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: '医科診療行為' }]} />
          <Windowed />
        </Box>
      </Box>
    </Layout>
  );
}
