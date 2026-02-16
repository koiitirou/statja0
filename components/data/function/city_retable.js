'use client';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useRowSelect,
  usePagination,
} from 'react-table';
import { useMemo, Fragment, useState, useEffect, memo } from 'react';
import regeneratorRuntime from 'regenerator-runtime';
import React from 'react';
import { Box, Typography } from '@mui/material';
import classes from '@/components/d3css/world.module.css';
import Link from 'next/link';
import { matchSorter } from 'match-sorter';
import { server } from '@/components/config';
import { json } from 'd3-fetch';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Surface,
  Symbols,
} from 'recharts';
import Select from 'react-select';
import palette1 from '@/components/dpc/palette.json';

// eslint-disable-next-line react/display-name
const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type='checkbox' ref={resolvedRef} {...rest} />
    </>
  );
});

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
        placeholder={`${count} 市区町村...`}
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
const App = ({ ssg1, did1, marks, columns, graphList, time_list2 }) => {
  const [graph, setGraph] = useState(graphList[1]);

  const [value, setValue] = useState(Number(ssg1.def.tmx));
  const [data, setData] = useState(ssg1.tab[ssg1.def.tmx].data);
  const [ydata, setYdata] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [init1, setInit1] = useState({ pageSize: 100 });
  useEffect(() => {
    setInit1();
  }, [value]);
  useEffect(() => {
    json(`${server}/citjson2/${did1}_int.json`).then((collection) => {
      setYdata(collection);
    });
    setIsLoaded(true);
    var init2 = {
      selectedRowIds: {
        0: true,
        1: true,
        2: true,
      },
    };
    setInit1(init2);
  }, []);
  useEffect(() => {
    if (isLoaded & (ydata != null)) {
      setData(ydata.tab[value].data);
    }
  }, [ydata, value, isLoaded]);
  const handleChange = (event, value) => {
    if (typeof value === 'number' && ydata.tab[value]) {
      setValue(value);
    }
  };
  ////////////
  /////
  const [chartData, setChartData] = useState([]);

  const [did_list1, setDid] = useState([]);
  const [dis_list1, setDnm] = useState([]);

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
        {Object.entries(ssg1.ref).map((v, i) => {
          return (
            <option key={i} value={v[1].td_name}>
              {v[1].td_name}
            </option>
          );
        })}
      </select>
    );
  }
  columns[1].Filter = SelectColumnFilter;
  columns[1].disableSortBy = true;
  //////////////
  ////
  const options = {
    myPageOptions: [100, 200, 500, 2000],
  };
  let { myPageOptions } = options;

  ///////
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    preGlobalFilteredRows,
    visibleColumns,
    setGlobalFilter,
    state,
    selectedFlatRows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds },
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
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );
  /////
  const check_length = selectedFlatRows.length;
  useEffect(() => {
    if (ydata) {
      var did_list2 = [];
      var dis_list2 = [];
      selectedFlatRows.forEach((v, i) => {
        if (i > 10) {
          return;
        }
        did_list2.push(v.original.s[0]);
        dis_list2.push(v.original.s[1]);
      });
      setDid(did_list2);
      setDnm(dis_list2);
    }
  }, [check_length]);
  /////////////

  useEffect(() => {
    if (ydata && did_list1 != undefined) {
      var child1 = [];
      time_list2.forEach((v0, i0) => {
        var child2 = {};
        child2['year'] = v0;
        did_list1.forEach((v1, i1) => {
          var th_categories = ydata.tab[v0].data.find((s0) => s0.s[0] == did_list1[i1]);
          var th_categories_base = ydata.tab[time_list2[time_list2.length - 1]].data.find(
            (s0) => s0.s[0] == did_list1[i1],
          );

          if (th_categories && th_categories_base != undefined) {
            if (th_categories[graph.value] != '') {
              if (Array.isArray(th_categories[graph.value])) {
                child2[th_categories_base.s[1]] = Number(th_categories[graph.value][0]);
              } else {
                child2[th_categories_base.s[1]] = Number(th_categories[graph.value]);
              }
            }
          }
        });
        child1.push(child2);
      });

      setChartData(child1);
    }
  }, [did_list1, graph]);

  return (
    <Box className={classes.retable}>
      {chartData != [] && (
        <Suiig
          ssg1={ssg1}
          graphList={graphList}
          graph={graph}
          setGraph={setGraph}
          dis_list1={dis_list1}
          chartData={chartData}
        />
      )}
      <Typography variant='h2' component='h2'>
        {ssg1.def.tl1}の市区町村ランキング {value}
      </Typography>
      <Box padding='10px 50px' maxWidth='600px'>
        <Typography display='inline' gutterBottom sx={{ paddingRight: '0px' }}>
          表示年度: <span style={{ fontWeight: 'bold' }}>{value}</span>年　
        </Typography>
        <Chip
          label='－'
          size='small'
          variant='outlined'
          onClick={() => {
            const ind1 = marks.findIndex((ss) => ss.value == value);
            marks[ind1 - 1] ? setValue(marks[ind1 - 1].value) : null;
          }}
        />{' '}
        <Chip
          label='＋'
          size='small'
          variant='outlined'
          onClick={() => {
            const ind1 = marks.findIndex((ss) => ss.value == value);
            marks[ind1 + 1] ? setValue(marks[ind1 + 1].value) : null;
          }}
        />
        <Slider
          valueLabelDisplay='auto'
          value={value}
          aria-label='non-linear-slider'
          defaultValue={Number(ssg1.def.tmx)}
          min={Number(ssg1.def.tmn)}
          max={Number(ssg1.def.tmx)}
          step={null}
          marks={marks}
          onChange={handleChange}
        />
      </Box>
      <Box className={classes.world1}>
        <table {...getTableProps()} className={classes.table1}>
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
                    <span>
                      {column.isSorted && !column.disableSortBy
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                    <div>{column.Header == '市区町村' ? column.render('Filter') : null}</div>
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
                  {row.cells.map((cell, index3) => {
                    const { key: cKey, ...cellProps } = cell.getCellProps();
                    return (
                      <td key={'v' + index3} {...cellProps}>
                        {index3 == 0 && cell.render('Cell')}
                        {index3 == 1 && cell.render('Cell')}
                        {index3 == 2 && (
                          <Fragment>
                            <Link prefetch={false} href={'/city/cinfo/' + cell.value[0]}>
                              {cell.value[1]}
                            </Link>
                          </Fragment>
                        )}
                        {index3 == 3 && (
                          <div className={classes.p1}>
                            <div className={classes.p2}>
                              {Number(cell.value[0]).toLocaleString()}
                              {ssg1.def.ut2}
                            </div>
                            <div className={classes.p4}>
                              <div
                                className={classes.p3}
                                style={{
                                  width: cell.value[1] == '' ? 0 : cell.value[1] + '%',
                                  backgroundColor: cell.value[2],
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {index3 == 4 &&
                          (value == Number(ssg1.def.tmn) ? (
                            ''
                          ) : (
                            <span
                              className={
                                classes[
                                  Number(cell.value) < 0
                                    ? 'mi1'
                                    : Number(cell.value) == 0
                                    ? 'ne1'
                                    : 'pl1'
                                ]
                              }
                            >
                              {Number(cell.value) < 0 ? '' : '+'}
                              {Number(cell.value).toFixed(2)}%
                            </span>
                          ))}
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

// eslint-disable-next-line react/display-name
const Suiig = memo((props) => {
  ////////////
  const CustomTooltip2 = (prps2) => {
    const payload = prps2.payload;
    const label = prps2.label;

    if (prps2.active && payload && payload.length) {
      return (
        <>
          <div>
            <Box
              sx={{
                backgroundColor: 'white',
                opacity: '0.9',
                padding: '5px 10px 5px 10px',
              }}
            >
              <Typography style={{ fontSize: '14px', color: 'dimgrey' }}>
                {label} {props.ssg1.def.tlj}
              </Typography>
              <table className={classes.tiptable} style={{ fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th>市区町村名</th>
                    <th>{props.graph.label}</th>
                  </tr>
                </thead>
                <tbody>
                  {payload.map((v, i) => {
                    return (
                      <React.Fragment key={'t' + i}>
                        <tr>
                          <td>
                            <Surface width={10} height={10}>
                              <Symbols
                                cx={5}
                                cy={5}
                                type='circle'
                                size={50}
                                fill={payload[i].color}
                              />
                            </Surface>
                            {payload[i].dataKey}
                          </td>
                          <td style={{ color: payload[i].color }}>
                            {Number(payload[i].value).toLocaleString()}
                            {props.graph.unit}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </div>
        </>
      );
    }

    return null;
  };
  /////////////
  return (
    <Box>
      <Typography variant='h2' component='h2'>
        {props.ssg1.def.tl1}の市区町村別の推移グラフ【{props.ssg1.def.tmn}〜{props.ssg1.def.tmx}年】
      </Typography>
      <Box sx={{ maxWidth: '400px' }} paddingBottom={2}>
        <Select
          defaultValue={props.graphList[1]}
          filterOption={false}
          options={props.graphList}
          onChange={(e) => {
            props.setGraph(e);
          }}
          isSearchable={false}
          id='selectbox3'
          instanceId='selectbox3'
        />
      </Box>
      <ResponsiveContainer height={400}>
        <LineChart
          width={600}
          height={400}
          data={props.chartData}
          margin={{
            top: 5,
            right: 5,
            left: -50,
            bottom: 5,
          }}
        >
          {props.dis_list1.map((v3, i3) => {
            return (
              <Line
                connectNulls
                type='monotone'
                dataKey={v3}
                stroke={palette1[i3 % 100]}
                dot={{ r: 0 }}
                key={'l' + i3}
              />
            );
          })}
          <XAxis dataKey='year' tick={{ fontSize: 12 }} />
          <YAxis
            domain={['auto', 'auto']}
            tickMargin={0}
            tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
            orientation='left'
            tickFormatter={(tick) => {
              if (tick >= 1000 && tick < 1000000) return Number(tick.toPrecision(3)) / 1000 + 'K';
              else if (tick >= 1000000 && tick < 1000000000)
                return Number(tick.toPrecision(3)) / 1000000 + 'M';
              else if (tick >= 1000000000) return Number(tick.toPrecision(3)) / 1000000000 + 'B';
              else return tick;
            }}
            reversed={props.graph.rev}
          />
          <Tooltip content={CustomTooltip2} wrapperStyle={{ zIndex: 1000 }} />
          <Legend
            align='left'
            wrapperStyle={{ paddingLeft: '50px' }}
            formatter={(value, entry, index) => <span className='text-color-class'>{value}</span>}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
});
