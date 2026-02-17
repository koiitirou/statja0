'use client';
import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Search_dpc from '@/components/data/function/search_dpc';
import HospitalCategory from '@/components/data/function/hospital_category';
import HospitalKihon from '@/components/data/function/hospital_kihon';
import PopularClient from '@/components/data/function/popularClient.js';
import { server } from '@/components/config';
import classes from '@/components/d3css/retableh.module.css';

export default function HospitalDetailClient({ ssg2, hospital1 }) {
  const [ydata, setYdata] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    fetch(`${server}/hospital/${hospital1}_ssg.json`)
      .then((res) => res.json())
      .then((data) => {
        setYdata(data);
        setIsLoaded(true);
      });
  }, [hospital1]);

  return (
    <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
      <Search_dpc />
      <Typography variant='h2'>よく見られている病院</Typography>
      <PopularClient path='hospital' />
      <Typography variant='h2'>よく見られている疾患名・病気</Typography>
      <PopularClient path='dpc' />
      <Typography variant='h1'>
        {ssg2.def.hospital}の治療実績と症例数ランキング・手術件数
      </Typography>
      <Typography variant='body1'>
        　{ssg2.def.hospital}({ssg2.def.short_name})
        の治療実績と症例数ランキング。入院患者数（症例数）・手術件数・在院日数を他の病院と比較。DPCオープンデータをもとにまとめています。
      </Typography>
      <HospitalCategory ssg2={ssg2} hospital1={hospital1} isLoaded={isLoaded} ydata={ydata} />
      <HospitalKihon ssg2={ssg2} hospital1={hospital1} isLoaded={isLoaded} ydata={ydata} />
    </Box>
  );
}
