'use client';
import { components, createFilter } from 'react-windowed-select';
import React, { useState, useEffect, memo, Fragment } from 'react';
import dynamic from 'next/dynamic';
const WindowedSelect = dynamic(() => import('react-windowed-select').then((mod) => mod.default), {
  ssr: false,
  loading: () => null,
});
import array3 from '@/components/path_ndb/sum_prescription_path.json';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import { Typography, Box, Grid } from '@mui/material';
import rsearch from '@/components/d3css/rsearch.module.css';
import Link from 'next/link';

var options = [];
const array4 = array3.path;
array4.map((s) => {
  var child1 = {};
  child1['value'] = s.params.id2;
  if (s.params.ei2 == 'gen') {
    child1['label'] = '【一般名】' + s.params.dn2;
  } else {
    child1['label'] = s.params.dn2;
  }
  child1['eid'] = s.params.eid;
  options.push(child1);
});

var option2 = [];
const epath = array3.epath;
epath.map((s) => {
  var child1 = {};
  child1['value'] = s.params.eid;
  child1['label'] = s.params.enm;
  option2.push(child1);
});

const customFilter = createFilter({ ignoreAccents: false });
const customComponents = {
  ClearIndicator: (props) => (
    <components.ClearIndicator {...props}>clear</components.ClearIndicator>
  ),
};

const App = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [input, setInput] = useState('');
  const [inputSave, setSave] = useState('');
  const [query0, setQuery0] = useState();

  useEffect(() => {
    const i = searchParams.get('i');
    setSave(i);
    setQuery0(i);
  }, [searchParams]);

  const [inpu2, setInpu2] = useState('');
  const [inputSav2, setSav2] = useState('');
  const [query2, setQuery2] = useState();

  useEffect(() => {
    const i2 = searchParams.get('i2');
    setSav2(i2);
    setQuery2(i2);
  }, [searchParams]);
  const title_list = { yak: '薬効分類', kkn: '効能・作用機序', ksk: '疾患・病気' };
  const kbn_list = { nai: '内服', gai: '外用', tyu: '注射' };
  const kbn_length = ['yak', 'kkn', 'ksk'].map((v, i) => {
    const epath_child1 = epath.filter((vv, ii) => vv.params.cl2 == v);
    return epath_child1.length;
  });
  return (
    <>
      <Box
        border='solid 1px lightgrey'
        p={1}
        borderRadius={2}
        sx={{ backgroundColor: '#f2f2f2' }}
        marginTop='10px'
      >
        <Typography variant='h1' component='h2'>
          処方薬（内服・外用・注射）を調べる
        </Typography>
        <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='caption' paddingLeft='10px'>
              商品名/一般名から検索する
            </Typography>
            <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
              <Grid size={10}>
                <WindowedSelect
                  className={rsearch.select1}
                  placeholder={
                    inputSave ? (
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{inputSave}</span>
                    ) : (
                      'ロキソニン...'
                    )
                  }
                  value={inputSave}
                  inputValue={input}
                  onInputChange={setInput}
                  onChange={(e) => {
                    window.location.assign(`/ndb/prescription/${e.value}`);
                  }}
                  onMenuClose={() => setSave(input)}
                  onFocus={() => {
                    setInput(inputSave);
                    setSave('');
                  }}
                  blurInputOnSelect
                  components={customComponents}
                  filterOption={customFilter}
                  options={options}
                  id='selectbox'
                  instanceId='selectbox'
                />
              </Grid>
              <Grid size={2}>
                <SearchIcon
                  sx={{
                    borderRadius: '4px',
                    padding: '3px',
                    fontSize: '34px',
                    height: '38px',
                    width: '38px',
                    background: '#2196f3',
                    color: '#fff',
                    verticalAlign: 'text-bottom',
                  }}
                  onClick={() => {
                    setQuery0(inputSave);
                    const params = new URLSearchParams();
                    if (inputSave) params.set('i', inputSave);
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                ></SearchIcon>
              </Grid>
            </Grid>
            <Result1 query0={query0} options={options} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='caption' paddingLeft='10px'>
              薬効分類/効能/病気・疾患名から検索する
            </Typography>
            <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
              <Grid size={10}>
                <WindowedSelect
                  className={rsearch.select1}
                  placeholder={
                    inputSav2 ? (
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{inputSav2}</span>
                    ) : (
                      '高血圧...'
                    )
                  }
                  value={inputSav2}
                  inputValue={inpu2}
                  onInputChange={setInpu2}
                  onChange={(e) => {
                    window.location.assign(`/ndb/${e.value}`);
                  }}
                  onMenuClose={() => setSav2(inpu2)}
                  onFocus={() => {
                    setInpu2(inputSav2);
                    setSav2('');
                  }}
                  blurInputOnSelect
                  components={customComponents}
                  filterOption={customFilter}
                  options={option2}
                  id='selectbo2'
                  instanceId='selectbo2'
                />
              </Grid>
              <Grid size={2}>
                <SearchIcon
                  sx={{
                    borderRadius: '4px',
                    padding: '3px',
                    fontSize: '34px',
                    height: '38px',
                    width: '38px',
                    background: '#2196f3',
                    color: '#fff',
                    verticalAlign: 'text-bottom',
                  }}
                  onClick={() => {
                    setQuery2(inputSav2);
                    const params = new URLSearchParams();
                    if (inputSave) params.set('i', inputSave);
                    if (inputSav2) params.set('i2', inputSav2);
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                ></SearchIcon>
              </Grid>
            </Grid>
            <Result2 query2={query2} option2={option2} />
          </Grid>
        </Grid>
      </Box>

      {pathname == '/ndb' && (
        <>
          <Typography variant='body1'>
            {kbn_length.map((v, i) => {
              return (
                <React.Fragment key={'kl' + i}>
                  <b>{v}</b>の
                  <Link href={'#' + Object.entries(title_list)[i][0]} prefetch={false}>
                    {Object.entries(title_list)[i][1]}リスト
                  </Link>
                  、
                </React.Fragment>
              );
            })}
            に分類された処方薬ランキングがあります。
          </Typography>
          {['yak', 'kkn', 'ksk'].map((v, i) => {
            const epath_child1 = epath.filter((vv, ii) => vv.params.cl2 == v);
            return (
              <Fragment key={'r' + i}>
                <Typography variant='h2' id={v}>
                  {title_list[v]}リスト
                </Typography>
                {['nai', 'gai', 'tyu'].map((v0, i0) => {
                  const epath_child2 = epath_child1.filter((vvv, iii) => vvv.params.kbn == v0);
                  return (
                    <Fragment key={'s' + i0}>
                      <Typography variant='h3'>{kbn_list[v0]}</Typography>
                      <Grid container rowSpacing={0.5} columns={12} columnSpacing={4}>
                        {epath_child2.map((v1, i1) => {
                          return (
                            <Grid size={{ xs: 12, md: 6 }} key={'t' + i1}>
                              <Typography variant='body1'>
                                <Link prefetch={false} href={`/ndb/${v1.params.eid}`}>
                                  {v1.params.enm}
                                </Link>
                              </Typography>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Fragment>
                  );
                })}
              </Fragment>
            );
          })}
        </>
      )}
    </>
  );
};
export default App;

const Result1 = memo(function Foo(props) {
  const query0 = props.query0;
  const options = props.options;
  const [res0, setRes0] = useState(options);

  useEffect(() => {
    setRes0(options.filter((s) => s.label.includes(query0)));
  }, [query0]);

  const Highlighted = ({ text = '', highlight = '' }) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts
          .filter((part) => part)
          .map((part, i) =>
            regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
          )}
      </span>
    );
  };
  return (
    <>
      {query0 && (
        <Box>
          <Typography>
            <mark>{res0.length}件</mark>見つかりました
          </Typography>
          {res0.map((s, i1) => (
            <React.Fragment key={'s' + i1}>
              <Typography variant='body2' paddingTop={0.5}>
                ・
                <Link prefetch={false} href={`/ndb/prescription/${s.value}`}>
                  <Highlighted text={s.label} highlight={query0} />
                </Link>
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      )}
    </>
  );
});

const Result2 = memo(function Foo(props) {
  const query0 = props.query2;
  const option2 = props.option2;
  const [res0, setRes0] = useState(option2);

  useEffect(() => {
    setRes0(option2.filter((s) => s.label.includes(query0)));
  }, [query0]);

  const Highlighted = ({ text = '', highlight = '' }) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts
          .filter((part) => part)
          .map((part, i) =>
            regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
          )}
      </span>
    );
  };
  return (
    <>
      {query0 && (
        <Box>
          <Typography>
            <mark>{res0.length}件</mark>見つかりました
          </Typography>
          {res0.map((s, i1) => (
            <React.Fragment key={'s' + i1}>
              <Typography variant='body2' paddingTop={0.5}>
                ・
                <Link prefetch={false} href={`/ndb/${s.value}`}>
                  <Highlighted text={s.label} highlight={query0} />
                </Link>
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      )}
    </>
  );
});
