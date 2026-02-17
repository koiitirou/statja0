'use client';
import { Layout } from '@/components/layout';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import theme from '@/theme';

const Checkup = dynamic(
  () => import('@/components/data/function/checkup_table'),
  { ssr: false }
);

export default function CheckupCidClient({ cid, ssg1, ssg2 }) {
  return (
    <Layout>
      <Box sx={{ paddingTop: { xs: '10px', md: '10px' } }} maxWidth={theme.maxWidth}>
        <Checkup ssg1={ssg1} ssg2={ssg2} />
      </Box>
    </Layout>
  );
}

