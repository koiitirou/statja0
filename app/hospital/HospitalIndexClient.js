'use client';
import regeneratorRuntime from 'regenerator-runtime';
import { Box, Grid, Typography, Button } from '@mui/material';
import { Layout } from '@/components/layout';
import React from 'react';
import Search_dpc from '@/components/data/function/search_dpc';
import array4 from '@/public/comp/data/link/hospital_ssg_list.json';
import classes from '@/components/d3css/retable.module.css';
import Link from 'next/link';
import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce, usePagination } from 'react-table';
import { useMemo, useState, useEffect } from 'react';
import { matchSorter } from 'match-sorter';
import PopularClient from '@/components/data/function/popularClient.js';
import index_data from '@/components/prefecture/index_data.json';

///////////////都道府県
var options2 = [];
const o1 = Object.entries(index_data);
o1.forEach((s) => {
  s[1].forEach((t) => {
    options2.push(t.short_name);
  });
});

var ct1 = array4[0].params.short_name;
var rr1 = [];
var oo1 = array4[0].params.short_name;
var options1 = [oo1];
array4.forEach((s, i1) => {
  var ct2 = s.params.short_name;
  ct1 = ct2;
  rr1.push(s.params);
  var oo2 = s.params.short_name;
  if (oo1 != oo2) {
    options1.push(s.params.short_name);
  }
  oo1 = oo2;
});
////////////////////////////////
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

const data1 = rr1;

const columns1 = [
  { Header: '都道府県', accessor: 'short_name' },
  { Header: '病院名', accessor: 'hs2' },
  {
    Header: '病床数',
    columns: [
      { Header: '総病床', accessor: 'bll' },
      { Header: 'DPC病床', accessor: 'dpb' },
    ],
  },
  {
    Header: '入院患者数　月あたりの数',
    columns: [
      { Header: '全患者', accessor: 'apn' },
      { Header: '救急車搬送', accessor: 'amn' },
      { Header: '予定外', accessor: 'e1n' },
      { Header: '救急医療', accessor: 'e2n' },
      { Header: '他院紹介', accessor: 'rfn' },
    ],
  },
];

////////////////App ()
const HospitalIndexClient = () => {
  const data = useMemo(() => data1);

  var columns = useMemo(() => columns1);
  columns[0].Filter = SelectColumnFilter;
  columns[0].filter = 'includes';
  columns[0].disableSortBy = true;

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
    // pagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    prepareRow,
    preGlobalFilteredRows,
    visibleColumns,
    setGlobalFilter,
    state,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 100, pageIndex: 0 },
      filterTypes,
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
        {options2.map((option, i) => {
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
  ////
  const [hash, setHash] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHash(window.location.hash.replace('#', ''));
    }
  }, []);
  const desc2 = `入院患者数(月平均)ランキングの第1位は${data[0].hsn}で${data[0].apn}人、第2位は${data[1].hsn}で${data[1].apn}人、第3位は${data[2].hsn}で${data[2].apn}人、第4位は${data[3].hsn}で${data[3].apn}人でした。`;
  return (
    <Layout>
    <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
      <Search_dpc />
      <Typography variant='h2'>よく見られている病院</Typography>
      <PopularClient path='hospital' />
      <Typography variant='h2'>よく見られている疾患名・病気</Typography>
      <PopularClient path='dpc' />
      <Typography variant='h1'>
        DPC病院一覧と治療実績【入院患者数ランキング（月平均数）】
      </Typography>
      <Typography variant='body1'>　{desc2}</Typography>
      <Typography variant='body1'>
        　DPC病院一覧から、全国・各都道府県の病院の診療実績（症例数、手術数、在院日数）を比較することができます。
      </Typography>
      <Box className={classes.retable}>
        <Box sx={{ overflowX: 'auto' }}>
          <table
            {...getTableProps()}
            className={classes.table3}
          >
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
                          {index3 != 1 ? (
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
        </Box>
        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 2, mb: 2, flexWrap: 'wrap' }}>
          <Button
            variant='outlined' size='small'
            onClick={() => gotoPage(0)} disabled={!canPreviousPage}
            sx={{ color: '#1976d2', borderColor: '#1976d2', '&.Mui-disabled': { color: '#bdbdbd', borderColor: '#e0e0e0' } }}
          >
            {'<<'}
          </Button>
          <Button
            variant='outlined' size='small'
            onClick={() => previousPage()} disabled={!canPreviousPage}
            sx={{ color: '#1976d2', borderColor: '#1976d2', '&.Mui-disabled': { color: '#bdbdbd', borderColor: '#e0e0e0' } }}
          >
            {'<'}
          </Button>
          <Typography variant='body2' sx={{ mx: 1, color: '#333' }}>
            {pageIndex + 1} / {pageOptions.length} ページ
          </Typography>
          <Button
            variant='outlined' size='small'
            onClick={() => nextPage()} disabled={!canNextPage}
            sx={{ color: '#1976d2', borderColor: '#1976d2', '&.Mui-disabled': { color: '#bdbdbd', borderColor: '#e0e0e0' } }}
          >
            {'>'}
          </Button>
          <Button
            variant='outlined' size='small'
            onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}
            sx={{ color: '#1976d2', borderColor: '#1976d2', '&.Mui-disabled': { color: '#bdbdbd', borderColor: '#e0e0e0' } }}
          >
            {'>>'}
          </Button>
        </Box>
      </Box>
    </Box>
    </Layout>
  );
};

export default HospitalIndexClient;
