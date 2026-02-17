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
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box sx={{ [theme.breakpoints.up('md')]: { maxWidth: '1300px', margin: 'auto' } }}>
          <Checkup ssg1={ssg1} ssg2={ssg2} />
        </Box>
      </Box>
    </Layout>
  );
}


