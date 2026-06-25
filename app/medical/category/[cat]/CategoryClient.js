'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import theme from '@/theme';
import Breadcrumb from '@/components/Breadcrumb';

const Windowed = dynamic(() => import('@/components/data/function/medical_windowed'), { ssr: false });
const CategoryView = dynamic(() => import('@/components/data/function/medical_category'), { ssr: false });

export default function CategoryClient({ res, sec, breadcrumbItems }) {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box sx={{ [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' } }}>
          {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
          <Windowed />
          <Typography variant='h1' sx={{ background: 'lightgrey', padding: '8px' }}>
            {sec}の算定回数ランキング・推移
          </Typography>
          <CategoryView res={res} sec={sec} />
        </Box>
      </Box>
    </Layout>
  );
}
