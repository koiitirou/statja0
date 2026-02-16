'use client';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from 'react-table';
import { useMemo, useState, memo } from 'react';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import regeneratorRuntime from 'regenerator-runtime';
import React from 'react';
import { Box, Typography } from '@mui/material';
import classes from '@/components/d3css/ranking.module.css';
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
const App = ({ columns, data, cls1, options1 }) => {
  ///filter options
  function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value=''>全て</option>
        {options1.map((v, i) => {
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
  columns[0].filter = 'includes';
  columns[0].disableSortBy = true;

  ////
  const options = {
    myPageOptions: [100, 200, 500, 1000],
  };
  let { myPageOptions } = options;

  const init1 = { pageSize: 100 };
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
  //////////////
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
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
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetGlobalFilter: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  ///////////////////////////////////////////////////
  //////////////////////////
  return (
    <Box>
      <Typography variant='h2' component='h2'>
        各統計の世界各国ランキング【国別順位】
      </Typography>
      <Box className={classes.retable}>
        <table
          {...getTableProps()}
          className={[classes.table1, classes.world_en, classes.world1].join(' ')}
        >
          <thead>
            {headerGroups.map((headerGroup, index1) => {
              const { key: hgKey, ...hgProps } = headerGroup.getHeaderGroupProps();
              return (
              <tr key={'s' + index1} {...hgProps}>
                {headerGroup.headers.map((column, index12) => {
                  const { key: _k1, ...sortProps } = column.getHeaderProps(column.getSortByToggleProps());
                  const { key: _k2, ...baseProps } = column.getHeaderProps();
                  return (
                  <th
                    key={'t' + index12}
                    {...sortProps}
                    {...baseProps}
                  >
                    {column.render('Header')}
                    <div className={classes.category1}>
                      {column.Header == '統計' ? column.render('Filter') : null}
                    </div>
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
                <tr key={'u' + index2} {...rowProps}>
                  {row.cells.map((cell, i3) => {
                    const { key: cKey, ...cellProps } = cell.getCellProps();
                    return (
                      <td key={'v' + i3} {...cellProps}>
                        {i3 == 0 && (
                          <>
                            <AnalyticsRoundedIcon sx={{ verticalAlign: 'bottom' }} />
                            <Link prefetch={false} href={'/world/' + cell.value[1]}>
                              {cell.value[0]}
                            </Link>
                          </>
                        )}
                        {(i3 == 1 || i3 == 2 || i3 == 3 || i3 == 4) && (
                          <Box className={classes.tdbc}>
                            <Box className={classes.tdb1}>
                              <img src={`/img/wlogo2/${cell.value[1]}.png`} width={18}></img>

                              <Link prefetch={false} href={'/country/' + cell.value[1]}>
                                {cell.value[0]}
                              </Link>
                            </Box>
                            <Box className={classes.cnt_value}>{cell.value[2]}</Box>
                          </Box>
                        )}{' '}
                        {i3 == 5 && cell.value}
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
  );
};

export default memo(App);
