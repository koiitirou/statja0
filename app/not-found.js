'use client';
import { Layout } from '@/components/layout';
import { Box, Typography } from '@mui/material';
import theme from '@/theme';

export default function NotFound() {
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Typography variant='h1'>404 ERROR</Typography>
          <Typography>This page could not be found</Typography>
        </Box>
      </Box>
    </Layout>
  );
}
