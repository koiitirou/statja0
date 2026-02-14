'use client';
import { components, createFilter } from 'react-windowed-select';
import React, { useState, useEffect, memo } from 'react';
import WindowedSelect from 'react-windowed-select';

import { useRouter, useSearchParams } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import { Typography, Box } from '@mui/material';
import rsearch from '@/components/d3css/rsearch.module.css';
import Link from 'next/link';
import pr2_path from '@/components/pr2_path/pr2_path.json';
import yasai_path from '@/components/pr2_path/yasai_path.json';

var options = [];

pr2_path.path.map((s, i) => {
  var child1 = {};
  child1['value'] = s.params.id;
  child1['label'] = s.params.nm;
  child1['c'] = s.params.c1;
  child1['l'] = 'category';
  options.push(child1);
});
yasai_path.path.map((s, i) => {
  var child1 = {};
  child1['value'] = s.params.yasai;
  child1['label'] = s.params.nm;
  child1['c'] = s.params.c1;
  child1['l'] = 'vegetable';
  options.push(child1);
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
  const [input, setInput] = useState('');
  const [inputSave, setSave] = useState('');
  const [query0, setQuery0] = useState();

  useEffect(() => {
    const i = searchParams.get('i');
    setSave(i || '');
    setQuery0(i || '');
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
          都道府県ランキングを調べる
        </Typography>
        <Typography variant='caption' paddingLeft='10px'>
          ランキングの項目を検索する
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box sx={{ width: { xs: '85%', sm: '80%', md: '500px' } }}>
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
                window.location.assign(`/prefecture/${e.l}/${e.value}`);
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
              router.push(`?i=${encodeURIComponent(inputSave)}`);
            }}
          ></SearchIcon>
        </Box>
        <Result1 query0={query0} options={options} />
      </Box>
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
                <Link prefetch={false} href={`/prefecture/${s.l}/${s.value}`}>
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
