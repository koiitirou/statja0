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
const Retable = dynamic(
  () => import('@/components/data/function/shohou_retable'),
  { ssr: false }
);
const Retable2 = dynamic(
  () => import('@/components/data/function/shohou_retable_generic'),
  { ssr: false }
);

export default function NdbEidClient({ eid, ssg1, ssg2, kbn1, graphList, graphList2, breadcrumbItems }) {
  const did1 = eid;
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box sx={{ [theme.breakpoints.up('md')]: { maxWidth: '1300px', margin: 'auto' } }}>
          {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
          <Windowed />
          <Retable did1={did1} ssg1={ssg1} ssg2={ssg2} kbn1={kbn1} graphList={graphList} />
          <Retable2 did1={did1} ssg1={ssg2} kbn1={kbn1} graphList={graphList2} />
        </Box>
      </Box>
    </Layout>
  );
}

