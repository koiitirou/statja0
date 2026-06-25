'use client';
import { components, createFilter } from 'react-windowed-select';
import React, { useState, useEffect, memo, Fragment } from 'react';
import dynamic from 'next/dynamic';
const WindowedSelect = dynamic(() => import('react-windowed-select').then((mod) => mod.default), {
  ssr: false,
  loading: () => null,
});
import array3 from '@/components/path_ndb/medical_path.json';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import { Typography, Box, Grid, Chip } from '@mui/material';
import rsearch from '@/components/d3css/rsearch.module.css';
import Link from 'next/link';

const array4 = array3.path;
const options = array4.map((s) => ({
  value: s.params.mid,
  label: s.params.nm,
  sec: s.params.sec,
}));

const cats = (array3.epath || []).map((s) => s.params); // [{sec, cat}]
const subsAll = (array3.subpath || []).map((s) => s.params); // [{sub, bnm, sec, cat}]
const subsBySec = {};
subsAll.forEach((s) => {
  (subsBySec[s.sec] = subsBySec[s.sec] || []).push(s);
});
Object.values(subsBySec).forEach((arr) => arr.sort((a, b) => String(a.sub).localeCompare(String(b.sub))));

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
  const [query0, setQuery0] = useState('');

  useEffect(() => {
    const i = searchParams.get('i') || '';
    setSave(i);
    setQuery0(i);
  }, [searchParams]);

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
          医科診療行為（算定回数）を調べる
        </Typography>
        <Typography variant='caption' paddingLeft='10px'>
          診療行為名から検索する
        </Typography>
        <Grid container rowSpacing={1} columns={12} columnSpacing={1}>
          <Grid size={10}>
            <WindowedSelect
              className={rsearch.select1}
              placeholder={
                inputSave ? (
                  <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{inputSave}</span>
                ) : (
                  '初診料...'
                )
              }
              value={inputSave}
              inputValue={input}
              onInputChange={setInput}
              onChange={(e) => {
                window.location.assign(`/medical/${e.value}`);
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
        <Result1 query0={query0} />
      </Box>

      {pathname == '/medical' && (
        <>
          <Typography variant='h2' sx={{ mt: 2 }}>
            区分・分類から選ぶ
          </Typography>
          <Typography variant='body1' sx={{ mb: 1 }}>
            区分（太字）ごとに算定回数ランキングと推移グラフ、その下の分類ごとにも個別ページがあります。
          </Typography>
          {cats.map((c, i) => {
            const subs = subsBySec[c.sec] || [];
            return (
              <Fragment key={'cat' + i}>
                <Typography variant='h3' id={`sec${i}`} sx={{ mt: 1.5 }}>
                  <Link prefetch={false} href={`/medical/category/${c.cat}`}>
                    {c.sec}
                  </Link>
                  <Typography component='span' variant='caption' color='dimgrey'>
                    {'　'}（{subs.length}分類）
                  </Typography>
                </Typography>
                <Grid container rowSpacing={0.25} columns={12} columnSpacing={4}>
                  {subs.map((s, j) => (
                    <Grid size={{ xs: 12, md: 6 }} key={'sub' + j}>
                      <Typography variant='body2'>
                        <Link prefetch={false} href={`/medical/sub/${s.sub}`}>
                          {s.sub} {s.bnm}
                        </Link>
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Fragment>
            );
          })}
        </>
      )}
    </>
  );
};
export default App;

const Result1 = memo(function Foo({ query0 }) {
  const [res0, setRes0] = useState(options);
  useEffect(() => {
    setRes0(options.filter((s) => s.label.includes(query0)));
  }, [query0]);

  const Highlighted = ({ text = '', highlight = '' }) => {
    if (!highlight.trim()) return <span>{text}</span>;
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
            <Typography key={'s' + i1} variant='body2' paddingTop={0.5}>
              ・
              <Link prefetch={false} href={`/medical/${s.value}`}>
                <Highlighted text={s.label} highlight={query0} />
              </Link>
            </Typography>
          ))}
        </Box>
      )}
    </>
  );
});
