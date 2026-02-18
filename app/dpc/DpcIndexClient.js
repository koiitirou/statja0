'use client';
import regeneratorRuntime from 'regenerator-runtime';
import { Box, Grid, Typography } from '@mui/material';
import { Layout } from '@/components/layout';
import React from 'react';
import Search_dpc from '@/components/data/function/search_dpc';
import array4 from '@/public/comp/data/link/dpc_ssg_list2.json';
import array44 from '@/public/comp/data/link/dpc_alternative_path.json';
import classes from '@/components/d3css/retable.module.css';
import Link from 'next/link';
import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import { useMemo, useState, useEffect } from 'react';
import { matchSorter } from 'match-sorter';
import PopularClient from '@/components/data/function/popularClient.js';
import index_data from '@/components/prefecture/index_data.json';
import Breadcrumb from '@/components/Breadcrumb';

///////////////都道府県
var options2 = [];
const o1 = Object.entries(index_data);
o1.forEach((s) => {
  s[1].forEach((t) => {
    options2.push(t.short_name);
  });
});

// Build data from DPC list
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
  { Header: '病気名', accessor: 'di2' },
  {
    Header: '治療実績(件数)',
    columns: [
      { Header: '合計', accessor: 'kll' },
      { Header: '手術あり', accessor: 'yes' },
      { Header: '手術なし', accessor: 'non' },
    ],
  },
  {
    Header: '在院日数(日)',
    columns: [
      { Header: '合計', accessor: 'zll' },
      { Header: '手術あり', accessor: 'yez' },
      { Header: '手術なし', accessor: 'noz' },
    ],
  },
];

////////////////App ()
const DpcIndexClient = () => {
  const title1 = '病気名一覧｜DPC治療実績ランキング';
  const data = useMemo(() => data1);

  var columns = useMemo(() => columns1);
  columns[0].Filter = SelectColumnFilter;
  columns[0].filter = 'includes';
  columns[0].disableSortBy = true;
  var init1 = [];

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
    rows,
    prepareRow,
    preGlobalFilteredRows,
    visibleColumns,
    setGlobalFilter,
    state,
  } = useTable(
    {
      columns,
      data,
      initialState: init1,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
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

  return (
    <Layout>
    <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
      <Breadcrumb items={[{ name: 'トップ', href: '/' }, { name: 'DPC病名一覧' }]} />
      <Search_dpc />
      <Typography variant='h2'>よく見られている病院</Typography>
      <PopularClient path='hospital' />
      <Typography variant='h2'>よく見られている疾患名・病気</Typography>
      <PopularClient path='dpc' />
      <Typography variant='h1'>
        DPC病気名一覧【治療実績ランキング】
      </Typography>
      <Typography variant='body1'>
        　DPC病気名一覧を治療実績の多い順にランキング形式で表示しています。各病気名は年度ごとの治療実績、手術件数、在院日数が確認できます。
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
              {rows.map((row, index2) => {
                prepareRow(row);
                const { key: rKey, ...rowProps } = row.getRowProps();
                return (
                  <tr key={'u' + index2} {...rowProps}>
                    {row.cells.map((cell, index3) => {
                      const { key: cKey, ...cellProps } = cell.getCellProps();
                      return (
                        <td key={'v' + index3} {...cellProps}>
                          {index3 != 1 ? (
                            cell.render('Cell')
                          ) : (
                            <Link prefetch={false} href={'/dpc/' + cell.value[1]}>
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
      </Box>
    </Box>
    </Layout>
  );
};

export default DpcIndexClient;
