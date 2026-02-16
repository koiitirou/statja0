'use client';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from 'react-table';
import { useMemo, useState, memo, useEffect } from 'react';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import regeneratorRuntime from 'regenerator-runtime';
import React from 'react';
import { Box, Typography } from '@mui/material';
import classes from '@/components/d3css/ranking.module.css';
import Link from 'next/link';
import { matchSorter } from 'match-sorter';
import { json } from 'd3-fetch';
import { server } from '@/components/config';
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
const App = ({ columns, data0, cls1, options1, country }) => {
  const [data, setData] = useState(data0);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    json(`${server}/rn3/${country}_ja.json`).then((collection) => {
      setData(collection.data);
    });
    setIsLoaded(true);
  }, []);
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
  ////////////////////////
  return (
    <Box>
      <Box className={classes.retable}>
        <table
          {...getTableProps()}
          className={[classes.table1, classes.world_en, classes.world2].join(' ')}
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
                      {column.Header == '分類' ? column.render('Filter') : null}
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
                        {i3 == 0 && cell.value}
                        {i3 == 1 && (
                          <>
                            <AnalyticsRoundedIcon sx={{ verticalAlign: 'bottom' }} />
                            {cell.value}
                          </>
                        )}
                        {i3 == 2 && Number(cell.value).toLocaleString()}
                        {i3 == 3 && (
                          <>
                            <Link prefetch={false} href={'/world/' + cell.value[1]}>
                              #{cell.value[0]}
                            </Link>
                          </>
                        )}
                        {i3 == 4 && cell.value}
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
