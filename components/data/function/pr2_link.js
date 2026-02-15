'use client';
import { Grid, Typography, Button } from '@mui/material';
import Link from 'next/link';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import React from 'react';
import { memo } from 'react';

const Link2 = (props) => {
  const ref1 = props.ref1;
  const ref2 = props.ref2;
  const json1 = props.json1;
  const array4 = props.array4;
  const c2s = [];
  Object.keys(ref1.c2s).forEach((v, i) => {
    c2s.push(ref1.c2s[v]);
  });
  // const [content, setContent] = useState('');

  const pcr1 = () => {
    var all0 = 0;
    return (
      <>
        {c2s.map((v, i) => {
          all0 += v.url.length;
          return (
            <React.Fragment key={'c' + i}>
              「
              <Link href={'#grid' + i} prefetch={false}>
                {v.nm2}
              </Link>{' '}
              ({v.url.length})」
            </React.Fragment>
          );
        })}
        に分類された合計<span style={{ fontWeight: 'bold' }}>{all0}</span>
        のランキング・年次推移データがあります。
      </>
    );
  };

  return (
    <>
      {array4.map((v, i) => {
        return (
          <React.Fragment key={'a' + i}>
            <Button
              color='secondary'
              variant={ref1.lnk == v.params.lnk ? 'contained' : 'outlined'}
              fontSize={{ xs: '13px', sm: '16px' }}
              // prefetch={false}
              href={'/prefecture/' + v.params.lnk}
            >
              {v.params.nam}
            </Button>
          </React.Fragment>
        );
      })}
      {/* <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: { lg: `calc(100% - ${boxWidth}px)`} }}> */}
      <Typography variant='h1' component='h1'>
        <AnalyticsRoundedIcon sx={{ verticalAlign: 'middle', fill: '#007FFF' }} fontSize='large' />
        {ref1.nam}統計の都道府県ランキング
      </Typography>
      <Typography variant='body1'>
        　{ref1.nam}
        統計に関する都道府県ランキング・データを1ページにまとめました。各リンク先では順位ランキング、経年推移、前年比が一目で分かる表とグラフでまとめています。
      </Typography>
      <Typography>　{pcr1()}</Typography>
      <Grid container spacing={0.5} columns={{ xs: 12, sm: 12 }} key={'grid1'}>
        {Object.keys(ref1.c2s).map((v1, i1) => (
          <React.Fragment key={'d' + i1}>
            <Typography
              variant='h2'
              component='h2'
              sx={{
                flexBasis: '100%',
                marginTop: '15px',
                marginBottom: '5px',
                marginLeft: '10px',
              }}
              id={'grid' + i1}
            >
              {/* <CheckBoxRoundedIcon sx={{ verticalAlign: 'bottom' }} /> */}
              {ref1.c2s[v1].nm2}
            </Typography>

            <SubCategory c2s={ref1.c2s[v1]} ref1={ref1} json1={json1} ref2={ref2} />
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
};

function SubCategory({ c2s, ref1, json1, ref2 }, i2) {
  c2s.url = Array.isArray(c2s.url) ? c2s.url : [c2s.url];
  return (
    <React.Fragment key={'d' + i2}>
      <Grid size={{ xs: 6, sm: 5 }}>
        <Typography variant='body1' fontSize={{ xs: '13px', sm: '16px' }}>
          ランキング分類
        </Typography>
      </Grid>

      <Grid size={{ xs: 1.8, sm: 1.4 }}>
        <Typography variant='body1' fontSize={{ xs: '13px', sm: '16px' }}>
          1位
        </Typography>
      </Grid>
      <Grid size={{ xs: 1.8, sm: 1.4 }}>
        <Typography variant='body1' fontSize={{ xs: '13px', sm: '16px' }}>
          2位
        </Typography>
      </Grid>
      <Grid size={{ xs: 1.8, sm: 1.4 }}>
        <Typography variant='body1' fontSize={{ xs: '13px', sm: '16px' }}>
          3位
        </Typography>
      </Grid>
      <Grid size={{ xs: 1.8, sm: 1.4 }} display={{ xs: 'none', sm: 'block' }}>
        <Typography variant='body1' fontSize={{ xs: '13px', sm: '16px' }}>
          最下位
        </Typography>
      </Grid>
      <Grid size={{ xs: 1.3, sm: 0.9 }} display={{ xs: 'none', sm: 'block' }}>
        <Typography variant='body1' fontSize={{ xs: '13px', sm: '16px' }}>
          年度
        </Typography>
      </Grid>
      <Grid size={{ xs: 0.6, sm: 0.5 }}></Grid>
      {c2s.url.map((v3, i3) => {
        var cur1 = json1.cur.find((s) => s.u == v3);
        return (
          <React.Fragment key={'e' + i3}>
            <Grid size={{ xs: 6, sm: 5 }} borderTop={1} borderColor='#ddd'>
              <Typography variant='body1' fontSize={{ xs: '13px', sm: '16px' }}>
                <AnalyticsRoundedIcon sx={{ verticalAlign: 'bottom' }} />
                <Link
                  href={
                    ref1.ln2 != 'vegetable'
                      ? `/prefecture/category/${v3}`
                      : `/prefecture/vegetable/${v3}`
                  }
                  prefetch={false}
                >
                  {cur1.d}
                </Link>
              </Typography>
            </Grid>
            <Grid size={{ xs: 1.8, sm: 1.4 }} borderTop={1} borderColor='#ddd'>
              {cur1 && (
                <Typography variant='body1' fontSize={{ xs: '12px', sm: '14px' }}>
                  <img
                    src={'/img/logo/' + cur1.i[0] + '.png'}
                    width={12}
                    height={12}
                    alt={cur1.i[0]}
                  />
                  <Link prefetch={false} href={'/prefecture/info/' + cur1.i[0] + '/' + ref1.ln2}>
                    {ref2[cur1.i[0]].tsh}
                  </Link>
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 1.8, sm: 1.4 }} borderTop={1} borderColor='#ddd'>
              {cur1 && (
                <Typography variant='body1' fontSize={{ xs: '12px', sm: '14px' }}>
                  <img
                    src={'/img/logo/' + cur1.i[1] + '.png'}
                    width={12}
                    height={12}
                    alt={cur1.i[1]}
                  />
                  <Link prefetch={false} href={'/prefecture/info/' + cur1.i[1] + '/' + ref1.ln2}>
                    {ref2[cur1.i[1]].tsh}
                  </Link>
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 1.8, sm: 1.4 }} borderTop={1} borderColor='#ddd'>
              {cur1 && (
                <Typography variant='body1' fontSize={{ xs: '12px', sm: '14px' }}>
                  <img
                    src={'/img/logo/' + cur1.i[2] + '.png'}
                    width={12}
                    height={12}
                    alt={cur1.i[2]}
                  />
                  <Link prefetch={false} href={'/prefecture/info/' + cur1.i[2] + '/' + ref1.ln2}>
                    {ref2[cur1.i[2]].tsh}
                  </Link>
                </Typography>
              )}
            </Grid>
            <Grid
              size={{ xs: 1.8, sm: 1.4 }}
              borderTop={1}
              borderColor='#ddd'
              display={{ xs: 'none', sm: 'block' }}
            >
              {cur1 && (
                <Typography variant='body1' fontSize={{ xs: '12px', sm: '14px' }}>
                  <img
                    src={'/img/logo/' + cur1.i[3] + '.png'}
                    width={12}
                    height={12}
                    alt={cur1.i[3]}
                  />
                  <Link prefetch={false} href={'/prefecture/info/' + cur1.i[3] + '/' + ref1.ln2}>
                    {ref2[cur1.i[3]].tsh}
                  </Link>
                </Typography>
              )}
            </Grid>

            <Grid
              size={{ xs: 1.9, sm: 1.4 }}
              borderTop={1}
              borderColor='#ddd'
              display={{ xs: 'none', sm: 'block' }}
            >
              <Typography variant='body1' fontSize={{ xs: '12px', sm: '14px' }}>
                {cur1 ? cur1.y : ''}
              </Typography>
            </Grid>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

export default memo(Link2);
