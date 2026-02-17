'use client';
import React, { useState, useEffect, memo, Suspense } from 'react';
import array4 from '@/public/comp/data/link/dpc_ssg_list2.json';
import array44 from '@/public/comp/data/link/dpc_alternative_path.json';
import { Typography, Box, Grid } from '@mui/material';
import rsearch from '@/components/d3css/rsearch.module.css';
import SearchIcon from '@mui/icons-material/Search';
import Link from '@mui/material/Link';
import WindowedSelect from 'react-windowed-select';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { components } from 'react-windowed-select';
import array5 from '@/public/comp/data/link/hospital_ssg_list.json';

var options2 = [];
array5.map((s) => {
  var child2 = {};
  child2['value'] = s.params.hospital;
  child2['label'] = s.params.hsn;
  child2['td_sq'] = s.params.td_sq;
  options2.push(child2);
});

var options1 = [];
array4.map((s) => {
  var child1 = {};
  child1['value'] = s.params.did;
  child1['label'] = s.params.dis;
  child1['icd'] = s.params.icd;
  options1.push(child1);
});
var options11 = [];
array44.map((s) => {
  var child1 = {};
  child1['value'] = 'alternative/' + s.params.dhsh;
  child1['label'] = s.params.dext;
  options11.push(child1);
});
options1 = options1.concat(options11);

const customFilter = (option, searchText) => {
  const labelBoo = option.data.label.toLowerCase().includes(searchText.toLowerCase());
  const valueBoo = option.data.value.toLowerCase().includes(searchText.toLowerCase());
  const icdBoo = option.data.icd
    ? option.data.icd.toLowerCase().includes(searchText.toLowerCase())
    : false;
  if (labelBoo || valueBoo || icdBoo) {
    return true;
  } else {
    return false;
  }
};
const customComponents = {
  ClearIndicator: (props) => (
    <components.ClearIndicator {...props}>clear</components.ClearIndicator>
  ),
};

const SearchDpcInner = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [input1, setInput1] = useState('');
  const [inputSave1, setSave1] = useState('');
  const [query1, setQuery1] = useState('');
  useEffect(() => {
    const i1 = searchParams.get('i1') || '';
    setSave1(i1);
    setQuery1(i1);
  }, [searchParams.get('i1')]);

  const [input2, setInput2] = useState('');
  const [inputSave2, setSave2] = useState('');
  const [query2, setQuery2] = useState('');

  useEffect(() => {
    const i2 = searchParams.get('i2') || '';
    setSave2(i2);
    setQuery2(i2);
  }, [searchParams.get('i2')]);

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
          治療実績を調べる
        </Typography>

        <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='caption' paddingLeft='10px'>
              病気名から調べる
            </Typography>
            <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
              <Grid size={{ xs: 10 }}>
                <WindowedSelect
                  className={rsearch.select1}
                  options={options1}
                  onChange={(e) => {
                    window.location.assign(`/dpc/${e.value}`);
                  }}
                  filterOption={customFilter}
                  components={customComponents}
                  placeholder={
                    inputSave1 ? (
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{inputSave1}</span>
                    ) : (
                      '狭心症...'
                    )
                  }
                  value={inputSave1}
                  inputValue={input1}
                  onInputChange={setInput1}
                  onMenuClose={() => setSave1(input1)}
                  onFocus={() => {
                    setInput1(inputSave1);
                    setSave1('');
                  }}
                  blurInputOnSelect
                  id='selectbox1'
                  instanceId='selectbox1'
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
                  }}
                  onClick={() => {
                    setQuery1(inputSave1);
                    const params = new URLSearchParams();
                    if (inputSave1) params.set('i1', inputSave1);
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                  }}
                ></SearchIcon>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='caption' paddingLeft='10px'>
              病院名から調べる
            </Typography>
            <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
              <Grid size={{ xs: 10 }}>
                <WindowedSelect
                  className={rsearch.select1}
                  options={options2}
                  onChange={(e) => {
                    window.location.assign(`/hospital/${e.value}`);
                  }}
                  filterOption={customFilter}
                  components={customComponents}
                  placeholder={
                    inputSave2 ? (
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{inputSave2}</span>
                    ) : (
                      '病院...'
                    )
                  }
                  value={inputSave2}
                  inputValue={input2}
                  onInputChange={setInput2}
                  onMenuClose={() => setSave2(input2)}
                  onFocus={() => {
                    setInput2(inputSave2);
                    setSave2('');
                  }}
                  blurInputOnSelect
                  id='selectbox2'
                  instanceId='selectbox2'
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
                    setQuery2(inputSave2);
                    const params = new URLSearchParams();
                    if (inputSave2) params.set('i2', inputSave2);
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                  }}
                ></SearchIcon>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {query1 && <Result1 query0={query1} options={options1} />}
        {query2 && <Result2 query0={query2} options={options2} />}
      </Box>
    </>
  );
};

const MyComponent = () => {
  return (
    <Suspense fallback={null}>
      <SearchDpcInner />
    </Suspense>
  );
};
export default MyComponent;

const Result1 = memo(function Foo(props) {
  const query0 = props.query0;
  const options = props.options;
  const [res0, setRes0] = useState(options);

  useEffect(() => {
    setRes0(
      options.filter((s) => s.label.includes(query0) || (s.icd ? s.icd.includes(query0) : false)),
    );
  }, [query0]);

  const Highlighted = ({ text = '', highlight = '' }) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
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
                <Link color='#nnn' href={`/dpc/${s.value}`}>
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
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
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
                <Link color='#nnn' href={`/hospital/${s.value}`}>
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
