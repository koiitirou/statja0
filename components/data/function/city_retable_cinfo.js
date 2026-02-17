'use client';
import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import { useMemo, Fragment, useState, useEffect, memo } from 'react';
import regeneratorRuntime from 'regenerator-runtime';
import React from 'react';
import { Box, Typography } from '@mui/material';
import classes from '@/components/d3css/cinfo.module.css';
import Link from 'next/link';
import { matchSorter } from 'match-sorter';

///////////////////////////
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
        placeholder={`${count} 統計...`}
        className={classes.filter}
      />
    </span>
  );
}
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

////////////////App ()
const App = ({ data, columns, category1, th_prefec }) => {
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
  //////SelectColumnFilter
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
        {category1.map((v, i) => {
          return (
            <option key={i} value={v}>
              {v}
            </option>
          );
        })}
      </select>
    );
  }
  columns[0].Filter = SelectColumnFilter;
  columns[0].disableSortBy = true;
  //////////////
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
    selectedFlatRows,
    state: { selectedRowIds },
    //
  } = useTable(
    {
      columns,
      data,
      initialState: [],
      filterTypes,
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetGlobalFilter: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
  );
  /////
  return (
    <Box className={classes.retable}>
      <Typography variant='h2' component='h2'>
        {th_prefec ? th_prefec.jln : ''}の市区町村ランキング
      </Typography>

      <Box className={classes.world1}>
        <table {...getTableProps()} className={classes.table1}>
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
                    <div>{column.Header == '統計分類' ? column.render('Filter') : null}</div>
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
                        {index3 == 0 && cell.value[0]}
                        {index3 == 1 && Number(cell.value).toLocaleString()}
                        {index3 == 2 && (
                          <Fragment>
                            <Link prefetch={false} href={'/city/category/' + cell.value[1]}>
                              {Number(cell.value[0])}位
                            </Link>
                          </Fragment>
                        )}
                        {index3 == 3 && cell.value}
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
  );
};
export default memo(App);
