'use client';
import { Box } from '@mui/material';
import { Layout } from '@/components/layout';
import Retable from '@/components/data/function/retable';
import Breadcrumb from '@/components/Breadcrumb';

export default function DpcAltDetailClient({ breadcrumbItems, ...props }) {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
        <Retable {...props} />
      </Box>
    </Layout>
  );
}
