'use client';
import { Box } from '@mui/material';
import Retable from '@/components/data/function/retable';

export default function DpcAltDetailClient(props) {
  return (
    <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
      <Retable {...props} />
    </Box>
  );
}
