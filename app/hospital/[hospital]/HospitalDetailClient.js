'use client';
import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import Search_dpc from '@/components/data/function/search_dpc';
import HospitalCategory from '@/components/data/function/hospital_category';
import HospitalKihon from '@/components/data/function/hospital_kihon';
import { server } from '@/components/config';
import { json } from 'd3-fetch';

export default function HospitalDetailClient({ ssg2, hospital1 }) {
  const [ydata, setYdata] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    json(`${server}/hospital3/${hospital1}_int.json`).then((collection) => {
      setYdata(collection);
      setIsLoaded(true);
    });
  }, [hospital1]);

  const title1 = `${ssg2.def.hospital}の手術件数・入院数・治療実績ランキング${ssg2.def.time_list2[0]}〜${ssg2.def.time_list2[ssg2.def.time_list2.length - 1]}`;
  const timeYear = ssg2.def.time_list2[ssg2.def.time_list2.length - 1];
  const desc1 = `${timeYear}年の${ssg2.def.hospital}の入院数(月平均)・手術件数・治療実績・在院日数・その他基本情報をDPCオープンデータをもとにまとめています。ランキング順位は全国、都道府県別に集計しています。`;

  return (
    <Layout>
    <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
      <Search_dpc />
      <Typography variant='h1'>{title1}</Typography>
      <Typography variant='body1'>
        　{desc1}
      </Typography>
      {ssg2.def.time_basic && (
        <HospitalKihon hospital1={hospital1} ssg2={ssg2} isLoaded={isLoaded} ydata={ydata} />
      )}
      {ssg2.def.time_category && (
        <HospitalCategory hospital1={hospital1} ssg2={ssg2} isLoaded={isLoaded} ydata={ydata} />
      )}
    </Box>
    </Layout>
  );
}
