'use client';
import { Layout } from '@/components/layout';
import theme from '@/theme';
import React from 'react';
import Pr2_windowed from '@/components/data/function/pr2_windowed';
import PopularClient from '@/components/data/function/popularClient';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { Typography, Box, Grid } from '@mui/material';
import pr2_path from '@/components/pr2_path/pr2_path.json';
import yasai_path from '@/components/pr2_path/yasai_path.json';

const region1 = [];
const prefec1 = [];
Object.keys(pr2_path.pref).forEach((v0, i0) => {
  region1.push(pr2_path.pref[v0].region);
  prefec1.push(pr2_path.pref[v0]);
});
const region2 = Array.from(new Set(region1));
const info3 = [];
region2.forEach((v0, i0) => {
  var prefec2 = prefec1.filter((s) => s.region == v0);
  info3.push([v0, prefec2]);
});

export default function PrefecturePage() {
  const title1 = '都道府県データランキング';
  const description1 =
    '日本全国の都道府県データランキングの年次推移を、表・グラフ・地図でまとめました。人口、面積、密度、経済、行政、家計などの指標を調べることができます。';

  var array4 = [...pr2_path.path, ...yasai_path.path];
  var mer_refs = { ...pr2_path.refs };
  Object.keys(yasai_path.refs).forEach((v, i) => {
    mer_refs[v] = yasai_path.refs[v];
  });
  var len1s = [];
  var len2s = [];
  array4.map((s) => {
    len1s.push(s.params.c1);
    len2s.push(s.params.c2);
  });

  var len1_set = Array.from(new Set(len1s));
  var len2_set = Array.from(new Set(len2s));
  var len0 = array4.length;
  var len1 = len1_set.length;
  var len2 = len2_set.length;

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: '都道府県ランキング' }]} />
          <Typography variant='h1'>{title1}</Typography>
          <Typography variant='body1'>{description1}</Typography>
          <Pr2_windowed />
          <Typography variant='h2'>よく見られている項目</Typography>
          <PopularClient path='prefecture' />
          <Typography variant='h2'>都道府県一覧</Typography>
          <Typography variant='body1'>
            各都道府県の人口・面積・教育・財政などの統計データをまとめたページへのリンク一覧です。
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0, md: 2 } }}>
            {info3.map((s, index) => {
              return (
                <Box
                  key={'s-' + index}
                  sx={{
                    width: { xs: '100%', md: 'calc(50% - 16px)' },
                    mb: 1,
                  }}
                >
                  <Typography variant='h3'>{s[0]}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 0.5 }}>
                    {s[1].map((t, tIndex) => {
                      return (
                        <Link
                          key={'t-' + tIndex}
                          href={'/prefecture/info/' + t.td_sq + '/category'}
                          prefetch={false}
                        >
                          {t.td_lt}
                        </Link>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Typography variant='h2'>都道府県ランキングのカテゴリー一覧</Typography>
          <Typography variant='body1'>
            　各都道府県の人口・面積・教育・財政などの統計データへのリンク一覧です。カッコ内の数字はそのカテゴリーのランキング数です。
          </Typography>
          <Typography variant='body1'>
            　<b>{len1}</b>
            の大カテゴリー、<b>{len2}</b>の小カテゴリーに分類された
            <b>{len0}</b>
            の都道府県データランキングがあります。
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0, md: 2 } }}>
            {Object.keys(mer_refs).map((v0, i0) => {
              var params0 = mer_refs[v0].params;
              return (
                <React.Fragment key={'s' + i0}>
                  {v0 != 'Z' && (
                    <Box
                      sx={{
                        width: { xs: '100%', md: 'calc(50% - 16px)' },
                        mb: 1,
                      }}
                    >
                      <Typography variant='h3'>
                        <Link href={'/prefecture/' + params0.lnk} prefetch={false}>
                          {params0.nam}
                        </Link>
                        （ {len1s.filter((x) => x == v0).length}）
                      </Typography>
                      {Object.keys(params0.c2s).map((v1, i1) => {
                        return (
                          <Typography variant='body1' key={'p' + i1}>
                            <Link
                              href={'/prefecture/' + params0.lnk + '#grid' + i1}
                              prefetch={false}
                            >
                              {params0.c2s[v1].nm2}
                            </Link>
                            （{params0.c2s[v1].url.length}）
                          </Typography>
                        );
                      })}
                    </Box>
                  )}
                </React.Fragment>
              );
            })}
          </Box>
          <Typography
            variant='body2'
            fontStyle='italic'
            color='dimgrey'
            align='right'
            display='block'
          >
            出典：「政府統計の総合窓口(e-Stat)」
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}
