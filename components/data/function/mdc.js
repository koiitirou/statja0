'use client';
import regeneratorRuntime from 'regenerator-runtime';
import { Box, Typography, Grid } from '@mui/material';
import classes from '@/components/d3css/retable.module.css';
import Link from 'next/link';
import React from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from 'react-table';
import { useMemo, Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchSorter } from 'match-sorter';
import { server } from '@/components/config';
import { json } from 'd3-fetch';
import Search_dpc from '@/components/data/function/search_dpc';
import PopularClient from '@/components/data/function/popularClient.js';

import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select').then((mod) => mod.default), {
  ssr: false,
  loading: () => null,
});

function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span className={classes.filter}>
      検索:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} 件...`}
        className={classes.filter}
      />
    </span>
  );
}
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

fuzzyTextFilterFn.autoRemove = (val) => !val;

const App = (props) => {
  const columns = props.columns1;
  const row1 = props.ssg2.row1;
  const path1 = props.path1;
  const time_list1 = props.ssg2.time_list1;
  const time1 = props.ssg2.time1;
  const category2 = props.category2;
  const yearList = [];
  for (let i = 0; i < time_list1.length; i++) {
    var thisYear = {};
    thisYear['value'] = time_list1[i];
    thisYear['label'] = time_list1[i];
    yearList.push(thisYear);
  }
  const mdcList = [];
  for (let i = 0; i < path1.length; i++) {
    var thisPath = {};
    thisPath['value'] = path1[i].params.mdc;
    thisPath['label'] = path1[i].params.mdn;
    mdcList.push(thisPath);
  }
  const [year, setYear] = useState(time1);
  const [mdc1, setMdc1] = useState(props.mdc1);
  const [data, setData] = useState(useMemo(() => row1));
  useEffect(() => {
    json(`${server}/rank/${year}_${props.category2}_${mdc1}.json`).then((collection) => {
      setData(collection.row1);
    });
  }, [year, mdc1]);
  if (category2 == 'bed') {
    columns[1].Filter = SelectColumnFilter;
    columns[1].filter = 'includes';
    columns[1].disableSortBy = true;
  } else {
    columns[0].Filter = SelectColumnFilter;
    columns[0].filter = 'includes';
    columns[0].disableSortBy = true;
  }
  const category1 = props.category1;
  const mdn1 = props.this_path1[0].params.mdn;
  const title1 = mdn1 + 'の' + category1 + '【ランキング】';
  const desc1 = `全国・各都道府県の病院における、${mdn1}の${category1}ランキングをDPCオープンデータをもとにまとめています。`;
  const rep1 = {
    patient: '患者数ランキング',
    patprop: '患者割合',
    zaiin: '在院日数ランキング',
    bed: '病床数ランキング',
    ambulance: '救急搬送による入院ランキング',
  };
  for (let i = 0; i < path1.length; i++) {
    rep1[path1[i].params.mdc] = path1[i].params.mdn;
  }
  const options1 = props.ssg2.shn1;
  const options2 = props.ssg2.ntc1;
  var init1 = { pageSize: 100 };

  const options = {
    myPageOptions: [100, 200, 500, 1000, 10000],
  };
  let { myPageOptions } = options;

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    [],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    preGlobalFilteredRows,
    visibleColumns,
    setGlobalFilter,
    state,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: init1,
      filterTypes,
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetGlobalFilter: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  /////////////////column filter
  function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value=''>すべて</option>
        {options1.map((option, i) => {
          var aa1 = option;
          return (
            <option key={i} value={aa1}>
              {aa1}
            </option>
          );
        })}
      </select>
    );
  }

  const router = useRouter();
  const [hash, setHash] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHash(window.location.hash.replace('#', ''));
    }
  }, []);
  return (
    <>
      <Search_dpc />
      <Typography variant='h2'>よく見られている病院</Typography>
      <PopularClient path='hospital' />
      <Typography variant='h2'>よく見られている疾患名・病気</Typography>
      <PopularClient path='dpc' />
      <Typography variant='h1'>{title1}</Typography>
      <Typography variant='body1'>
        　{time_list1[0]}〜{time_list1[time_list1.length - 1]}年の{desc1}
      </Typography>
      <Box className={classes.retable}>
        <Typography variant='h2'>
          {title1} {year}
        </Typography>

        <Grid container rowSpacing={1} columns={12} columnSpacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Select
              placeholder={'年度を選択する'}
              filterOption={false}
              options={yearList}
              onChange={(e) => {
                setYear(e.value);
              }}
              isSearchable={false}
            />
          </Grid>
          {path1.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              {' '}
              <Select
                placeholder={'診断分類を選択する'}
                filterOption={false}
                options={mdcList}
                onChange={(e) => {
                  setMdc1(e.value);
                  router.push(`/${category2}/${e.value}`);
                }}
                isSearchable={false}
              />
            </Grid>
          )}
        </Grid>
        <Box
          sx={{ overflowX: 'auto' }}
          className={category2 == 'bed' ? classes.table7 : classes.table5}
        >
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup, index1) => {
                const { key: hgKey, ...hgProps } = headerGroup.getHeaderGroupProps();
                return (
                <tr key={'s' + index1} {...hgProps}>
                  {headerGroup.headers.map((column, index12) => {
                    const { key: _k1, ...sortProps } = column.getHeaderProps(column.getSortByToggleProps());
                    const { key: _k2, ...colProps } = column.getHeaderProps();
                    return (
                    <th
                      key={'t' + index12}
                      {...sortProps}
                      {...colProps}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted && !column.disableSortBy
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                      <div>{column.Header == '都道府県' ? column.render('Filter') : null}</div>
                    </th>
                    );
                  })}
                </tr>
                );
              })}
              <tr>
                <th
                  colSpan={visibleColumns.length}
                  style={{
                    textAlign: 'left',
                  }}
                >
                  <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                  />
                </th>
              </tr>
            </thead>
            <tbody {...getTableBodyProps()} className={classes.tb}>
              {page.map((row, index2) => {
                prepareRow(row);
                const { key: rKey, ...rowProps } = row.getRowProps();
                return (
                  <tr
                    key={'u' + index2}
                    {...rowProps}
                    id={row.original.hs2[1]}
                    style={{
                      border: row.original.hs2[1] === hash ? '2px solid rgb(238, 121, 137)' : '',
                    }}
                  >
                    {row.cells.map((cell, index3) => {
                      const { key: cKey, ...cellProps } = cell.getCellProps();
                      return (
                        <td key={'v' + index3} {...cellProps}>
                          {(index3 != 2 && category2 == 'bed') ||
                          (index3 != 1 && category2 != 'bed') ? (
                            cell.render('Cell')
                          ) : (
                            <Link prefetch={false} href={'/hospital/' + cell.value[1]}>
                              {cell.value[0]}
                            </Link>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className='pagination'>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </button>{' '}
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <span>
              | Go to page:{' '}
              <input
                type='number'
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: '100px' }}
              />
            </span>{' '}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {myPageOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default App;
