'use client';
import { components, createFilter } from 'react-windowed-select';
import React, { useState, useEffect, memo, Suspense } from 'react';
import WindowedSelect from 'react-windowed-select';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import { Typography, Box, Grid } from '@mui/material';
import rsearch from '@/components/d3css/rsearch.module.css';
import Link from 'next/link';
import wor_path from '@/components/wor/wor_path.json';

var options = [];

wor_path.path.map((s, i) => {
  var child1 = {};
  child1['value'] = s.params.category;
  child1['label'] = s.params.nm2;
  child1['c'] = s.params.oid[0];
  child1['l'] = 'category';
  options.push(child1);
});

var option2 = [];
Object.keys(wor_path.country).map((s0, i) => {
  var s = wor_path.country[s0];
  var child1 = {};
  child1['value'] = s.is2;
  child1['label'] = s.jpn;
  option2.push(child1);
});
const country_array = Object.entries(wor_path.country).sort((a, b) =>
  a[1].jpn.localeCompare(b[1].jpn, 'ja-JP'),
);
const akas = country_array.map((v, i) => {
  return v[1].aka;
});

const pop_sum1 = [];
Array.from(new Set(akas)).forEach((v0, i0) => {
  var akas_array = country_array.filter((v) => v[1].aka == v0);
  var child_data = akas_array.map((v1, i1) => {
    return { jpni: v1[1].jpn, iso2: v1[1].is2 };
  });
  var child1 = { akas: v0, data: child_data };
  pop_sum1.push(child1);
});

const customFilter = createFilter({ ignoreAccents: false });
const customComponents = {
  ClearIndicator: (props) => (
    <components.ClearIndicator {...props}>clear</components.ClearIndicator>
  ),
};

const World_windowed = () => {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
};
export default World_windowed;

const App = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState('');
  const [inputSave, setSave] = useState('');
  const [query0, setQuery0] = useState();

  useEffect(() => {
    setSave(searchParams.get('i') || '');
    setQuery0(searchParams.get('i') || '');
  }, [searchParams]);

  const [inpu2, setInpu2] = useState('');
  const [inputSav2, setSav2] = useState('');
  const [query2, setQuery2] = useState();

  useEffect(() => {
    setSav2(searchParams.get('i2') || '');
    setQuery2(searchParams.get('i2') || '');
  }, [searchParams]);

  const [value, setValue] = useState('ナ');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
          世界各国のランキングを調べる
        </Typography>
        <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='caption' paddingLeft='10px'>
              ランキングの項目を検索する
            </Typography>
            <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
              <Grid size={{ xs: 10 }}>
                <WindowedSelect
                  className={rsearch.select1}
                  placeholder={
                    inputSave ? (
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{inputSave}</span>
                    ) : (
                      '総人口...'
                    )
                  }
                  value={inputSave}
                  inputValue={input}
                  onInputChange={setInput}
                  onChange={(e) => {
                    window.location.assign(`/world/${e.value}`);
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
              <Grid size={{ xs: 2 }}>
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
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('i', inputSave);
                    if (inputSav2) params.set('i2', inputSav2);
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                ></SearchIcon>
              </Grid>
            </Grid>
            <Result1 query0={query0} options={options} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='caption' paddingLeft='10px'>
              国名を検索する
            </Typography>
            <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
              <Grid size={{ xs: 10 }}>
                <WindowedSelect
                  className={rsearch.select1}
                  placeholder={
                    inputSav2 ? (
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{inputSav2}</span>
                    ) : (
                      'アメリカ...'
                    )
                  }
                  value={inputSav2}
                  inputValue={inpu2}
                  onInputChange={setInpu2}
                  onChange={(e) => {
                    window.location.assign(`/country/${e.value}`);
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
              <Grid size={{ xs: 2 }}>
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
                    const params = new URLSearchParams(searchParams.toString());
                    if (inputSave) params.set('i', inputSave);
                    params.set('i2', inputSav2);
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                ></SearchIcon>
              </Grid>
            </Grid>
            <Result2 query2={query2} option2={option2} />
          </Grid>
        </Grid>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChange}
              aria-label=''
              textColor='secondary'
              indicatorColor='secondary'
              sx={{
                '& .MuiTabs-flexContainer': {
                  display: 'block',
                  whiteSpace: 'normal',
                },
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  minHeight: 'auto',
                },
              }}
            >
              {pop_sum1.map((s) => {
                return <Tab label={s.akas} value={s.akas} key={s.akas} />;
              })}
            </TabList>
          </Box>
          {pop_sum1.map((s) => {
            return (
              <TabPanel value={s.akas} key={s.akas + '1'}>
                <Grid container spacing={0.5} columns={12}>
                  {s.data.map((t, index) => {
                    return (
                      <Grid size={{ xs: 6 }} key={'a' + index}>
                        <Typography textAlign='center' display='inline'>
                          <Link
                            href={'/country/' + t.iso2}
                            style={{ color: 'black', textDecoration: 'underline' }}
                          >
                            {t.jpni}
                          </Link>
                        </Typography>
                      </Grid>
                    );
                  })}
                </Grid>
              </TabPanel>
            );
          })}
        </TabContext>
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
                <Link prefetch={false} href={`/world/${s.value}`}>
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
                <Link prefetch={false} href={`/country/${s.value}`}>
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
