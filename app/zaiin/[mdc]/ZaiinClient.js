'use client';
import { Box } from '@mui/material';
import { Layout } from '@/components/layout';
import Mdc from '@/components/data/function/mdc';

export default function ZaiinClient({ ssg2, columns1, category1, category2, mdc1, path1, this_path1 }) {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Mdc
          ssg2={ssg2}
          columns1={columns1}
          category1={category1}
          category2={category2}
          mdc1={mdc1}
          path1={path1}
          this_path1={this_path1}
        />
      </Box>
    </Layout>
  );
}
