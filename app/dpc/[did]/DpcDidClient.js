'use client';
import { Box } from '@mui/material';
import { Layout } from '@/components/layout';
import Retable from '@/components/data/function/retable';

export default function DpcDidClient(props) {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Retable {...props} />
      </Box>
    </Layout>
  );
}
