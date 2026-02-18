'use client';
import { Layout } from '@/components/layout';
import theme from '@/theme';
import React from 'react';
import Link from 'next/link';
import { Typography, Box, Button } from '@mui/material';
import Pr2_windowed from '@/components/data/function/pr2_windowed';
import Breadcrumb from '@/components/Breadcrumb';

export default function PrefecInfoClient({ prefec, res2, ref3, pref1 }) {
  const th_prefec = pref1[prefec[0]];
  if (!th_prefec) {
    return (
      <Layout>
        <Box sx={{ p: 2 }}>
          <Typography variant='h1'>都道府県が見つかりません</Typography>
        </Box>
      </Layout>
    );
  }

  const lnk = prefec[1];
  const refKey = Object.keys(ref3).find((k) => ref3[k].params.lnk === lnk);
  const th_res = refKey ? ref3[refKey].params : null;

  const title1 = th_prefec.tln + 'の統計ランキング' + (th_res ? '【' + th_res.nam + '】' : '');
  const description1 =
    th_prefec.tln +
    'の統計データランキング・年次推移をまとめました。' +
    (th_res ? th_res.nam + '統計の詳細・順位・前年比がわかるページへリンクしています。' : '');

  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: '都道府県ランキング', href: '/prefecture' }, { name: th_prefec.tln }]} />
          <Pr2_windowed />
          <Typography variant='h1'>{title1}</Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {Object.keys(ref3).map((v, i) => {
              return (
                <Button
                  key={'a' + i}
                  color='secondary'
                  variant={lnk == ref3[v].params.lnk ? 'contained' : 'outlined'}
                  size='small'
                  sx={{ fontSize: { xs: '12px', sm: '14px' }, textTransform: 'none' }}
                  href={'/prefecture/info/' + prefec[0] + '/' + ref3[v].params.lnk}
                >
                  {ref3[v].params.nam.split('・')[0]}
                </Button>
              );
            })}
          </Box>

          <Typography variant='body1'>{description1}</Typography>

          {th_res &&
            Object.keys(th_res.c2s).map((v0, i0) => {
              var th_url = Array.isArray(th_res.c2s[v0].url)
                ? th_res.c2s[v0].url
                : [th_res.c2s[v0].url];
              var th_items = [];
              th_url.forEach((vv) => {
                var th_item0 = res2.find((zz) => zz.u == vv);
                if (th_item0 != undefined) {
                  th_items.push(th_item0);
                }
              });

              return (
                <React.Fragment key={'b' + i0}>
                  <Typography variant='h2'>
                    {th_prefec.tln}の{th_res.c2s[v0].nm2}ランキング
                  </Typography>
                  <Box
                    component='table'
                    sx={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: { xs: '12px', sm: '14px' },
                    }}
                  >
                    <thead>
                      <tr>
                        <Box
                          component='th'
                          sx={{
                            textAlign: 'left',
                            p: '4px',
                            borderBottom: '2px solid #ddd',
                            fontSize: { xs: '13px', sm: '15px' },
                            width: '40%',
                          }}
                        >
                          統計分類
                        </Box>
                        <Box
                          component='th'
                          sx={{
                            textAlign: 'right',
                            p: '4px',
                            borderBottom: '2px solid #ddd',
                            fontSize: { xs: '13px', sm: '15px' },
                            width: '35%',
                          }}
                        >
                          値
                        </Box>
                        <Box
                          component='th'
                          sx={{
                            textAlign: 'right',
                            p: '4px',
                            borderBottom: '2px solid #ddd',
                            fontSize: { xs: '13px', sm: '15px' },
                            width: '12.5%',
                          }}
                        >
                          順位
                        </Box>
                        <Box
                          component='th'
                          sx={{
                            textAlign: 'right',
                            p: '4px',
                            borderBottom: '2px solid #ddd',
                            fontSize: { xs: '13px', sm: '15px' },
                            width: '12.5%',
                          }}
                        >
                          年度
                        </Box>
                      </tr>
                    </thead>
                    <tbody>
                      {th_items.map((v1, i1) => {
                        return (
                          <tr key={'c' + i1}>
                            <Box
                              component='td'
                              sx={{
                                p: '4px',
                                borderTop: '1px solid #ddd',
                              }}
                            >
                              {v1.n}
                            </Box>
                            <Box
                              component='td'
                              sx={{
                                p: '4px',
                                borderTop: '1px solid #ddd',
                                textAlign: 'right',
                              }}
                            >
                              {Number(v1.v).toLocaleString()} {v1.t}
                            </Box>
                            <Box
                              component='td'
                              sx={{
                                p: '4px',
                                borderTop: '1px solid #ddd',
                                textAlign: 'right',
                              }}
                            >
                              <Link
                                prefetch={false}
                                href={
                                  lnk == 'vegetable' || lnk == 'fruit'
                                    ? `/prefecture/vegetable/${v1.u}`
                                    : `/prefecture/category/${v1.u}`
                                }
                              >
                                {v1.r}
                              </Link>
                            </Box>
                            <Box
                              component='td'
                              sx={{
                                p: '4px',
                                borderTop: '1px solid #ddd',
                                textAlign: 'right',
                              }}
                            >
                              {v1.i}
                            </Box>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Box>
                </React.Fragment>
              );
            })}
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
