'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import theme from '@/theme';
import Breadcrumb from '@/components/Breadcrumb';

const Windowed = dynamic(
  () => import('@/components/data/function/medical_windowed'),
  { ssr: false }
);
const MedicalView = dynamic(
  () => import('@/components/data/function/medical_view'),
  { ssr: false }
);

export default function MedicalClient({ mid, res2, con_name, breadcrumbItems }) {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box sx={{ [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' } }}>
          {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
          <Windowed />
          <Typography variant='h1' sx={{ background: 'lightgrey', padding: '8px' }}>
            {con_name}の算定回数の推移
          </Typography>
          <MedicalView mid={mid} res2={res2} con_name={con_name} />
        </Box>
      </Box>
    </Layout>
  );
}
