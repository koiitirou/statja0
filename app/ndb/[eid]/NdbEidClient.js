'use client';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import theme from '@/theme';

const Windowed = dynamic(
  () => import('@/components/data/function/prescription_windowed'),
  { ssr: false }
);
const Retable = dynamic(
  () => import('@/components/data/function/shohou_retable'),
  { ssr: false }
);
const Retable2 = dynamic(
  () => import('@/components/data/function/shohou_retable_generic'),
  { ssr: false }
);

export default function NdbEidClient({ eid, ssg1, ssg2, kbn1, graphList }) {
  const did1 = eid;
  return (
    <Box sx={{ paddingTop: { xs: '10px', md: '10px' } }} maxWidth={theme.maxWidth}>
      <Windowed />
      <Retable ssg1={ssg1} ssg2={ssg2} kbn1={kbn1} did1={did1} graphList={graphList} />
      <Retable2 ssg1={ssg2} kbn1={kbn1} did1={did1} graphList={graphList} />
    </Box>
  );
}
