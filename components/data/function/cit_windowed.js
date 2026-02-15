'use client';
import { components, createFilter } from 'react-windowed-select';
import React, { useState, useEffect, memo, Suspense } from 'react';
import WindowedSelect from 'react-windowed-select';

import { useRouter, useSearchParams } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import { Typography, Box, Grid } from '@mui/material';
import rsearch from '@/components/d3css/rsearch.module.css';
import Link from 'next/link';
import cit_path from '@/components/cit_path/cit_path.json';
var options = [];

cit_path.path.map((s, i) => {
  var child1 = {};
  child1['value'] = s.params.city;
  child1['label'] = s.params.nm;
  child1['c'] = s.params.c1;
  child1['l'] = 'category';
  options.push(child1);
});

var option2 = [];
Object.keys(cit_path.pref).map((s0, i) => {
  var s = cit_path.pref[s0];
  var child1 = {};
  child1['value'] = s.jis;
  child1['label'] = s.jln;
  option2.push(child1);
});
const customFilter = createFilter({ ignoreAccents: false });
const customComponents = {
  ClearIndicator: (props) => (
    <components.ClearIndicator {...props}>clear</components.ClearIndicator>
  ),
};

const Cit_windowed = () => {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
};
export default Cit_windowed;

const App = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState('');
  const [inputSave, setSave] = useState('');
  const [query0, setQuery0] = useState();

  useEffect(() => {
    const i = searchParams.get('i');
    setSave(i || '');
    setQuery0(i || '');
  }, [searchParams]);

  const [inpu2, setInpu2] = useState('');
  const [inputSav2, setSav2] = useState('');
  const [query2, setQuery2] = useState();

  useEffect(() => {
    const i2 = searchParams.get('i2');
    setSav2(i2 || '');
    setQuery2(i2 || '');
  }, [searchParams]);

  return (
    <>
      <Box
        border='solid 1px lightgrey'
        p={1}
        borderRadius={2}
        sx={{ backgroundColor: '#f2f2f2' }}
        marginTop='10px'
        marginBottom='15px'
      >
        <Typography variant='h1' component='h2'>
          市区町村ランキングを調べる
        </Typography>
        <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='caption' paddingLeft='10px'>
              ランキングの項目を検索する
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box sx={{ flex: 1 }}>
                <WindowedSelect
                  className={rsearch.select1}
                  placeholder={
                    inputSave ? (
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{inputSave}</span>
                    ) : (
                      '人口...'
                    )
                  }
                  value={inputSave}
                  inputValue={input}
                  onInputChange={setInput}
                  onChange={(e) => {
                    window.location.assign(`/city/${e.l}/${e.value}`);
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
                  id='cit_selectbox'
                  instanceId='cit_selectbox'
                />
              </Box>
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
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                onClick={() => {
                  setQuery0(inputSave);
                  router.push(`?i=${encodeURIComponent(inputSave)}&i2=${encodeURIComponent(inputSav2)}`);
                }}
              ></SearchIcon>
            </Box>
            <Result1 query0={query0} options={options} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='caption' paddingLeft='10px'>
              市区町村を検索する
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box sx={{ flex: 1 }}>
                <WindowedSelect
                  className={rsearch.select1}
                  placeholder={
                    inputSav2 ? (
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{inputSav2}</span>
                    ) : (
                      '大阪市　天王寺区...'
                    )
                  }
                  value={inputSav2}
                  inputValue={inpu2}
                  onInputChange={setInpu2}
                  onChange={(e) => {
                    window.location.assign(`/city/cinfo/${e.value}`);
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
                  id='cit_selectbo2'
                  instanceId='cit_selectbo2'
                />
              </Box>
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
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                onClick={() => {
                  setQuery2(inputSav2);
                  router.push(`?i=${encodeURIComponent(inputSave)}&i2=${encodeURIComponent(inputSav2)}`);
                }}
              ></SearchIcon>
            </Box>
            <Result2 query2={query2} option2={option2} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

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
                <Link prefetch={false} href={`/city/${s.l}/${s.value}`}>
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
                <Link prefetch={false} href={`/city/cinfo/${s.value}`}>
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
