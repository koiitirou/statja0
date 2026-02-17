'use client';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useRowSelect,
} from 'react-table';
import { useMemo, Fragment, useState, useEffect, memo, forwardRef, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import classes from '@/components/d3css/ndb.module.css';
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
/////////////////////
// eslint-disable-next-line react/display-name
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type='checkbox' ref={resolvedRef} {...rest} />
    </>
  );
});
///////////////都道府県
var options1 = [];
const formatNumber = (number) => {
  if (typeof number !== 'number') {
    return number;
  } else if (number >= 1000000000000) {
    return (number / 1000000000000).toFixed(1) + '兆';
  } else if (number >= 100000000) {
    return (number / 100000000).toFixed(1) + '億';
  } else if (number >= 10000) {
    return (number / 10000).toFixed(1) + '万';
  } else {
    return number.toFixed(1);
  }
};
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
        placeholder={`${count} 薬剤...`}
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
const App = (props) => {
  const ssg1 = props.ssg1;
  const did1 = props.did1;
  const kbn1 = props.kbn1;
  const graphList = props.graphList;
  const [graph, setGraph] = useState(graphList[1]);
  const marks = [];

  for (let i = 0; i < ssg1.def.tml.length; i++) {
    var thisYear = {};
    thisYear['value'] = ssg1.def.tml[i];
    marks.push(thisYear);
  }
  const retable1 = ssg1.tab;
  var columns = retable1.columns;

  ////////////sortin
  function numberSort(rowA, rowB, id, desc) {
    let a = Number(rowA.values[id][0]);
    let b = Number(rowB.values[id][0]);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  function numberSor2(rowA, rowB, id, desc) {
    let a = Number(rowA.values[id]);
    let b = Number(rowB.values[id]);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  function stringSort(rowA, rowB, id, desc) {
    let a = String(rowA.values[id][0]);
    let b = String(rowB.values[id][0]);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  columns[1].sortType = stringSort;
  columns[2].sortType = numberSort;
  columns[3].sortType = numberSort;
  columns[4].sortType = numberSor2;
  /////////////////
  const [value, setValue] = useState(ssg1.def.tmx);
  const [data, setData] = useState(useMemo(() => retable1.data));
  const [integ, setInteg] = useState([]);
  const [isfetch, setIsfetch] = useState(false);
  const [init1, setInit1] = useState([]);
  useEffect(() => {
    setInit1([]);
  }, [value]);
  useEffect(() => {
    json(`${server}/shohou/${did1}_gen_int.json`).then((collection) => {
      setInteg(collection);
    });
    setIsfetch(true);
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
    if (isfetch && integ && integ.tab && integ.tab[value]) {
      setData(integ.tab[value].data);
    }
  }, [integ, value, isfetch]);
  const handleChange = (event, value) => {
    if (typeof value === 'number' && integ && integ.tab && integ.tab[value]) {
      setValue(value);
    }
  };

  // Define a default UI for filtering

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
    selectedFlatRows,
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

  const unit1 = '';
  const title1 = `${
    ssg1.def.enm +
    'の処方数ランキング' +
    ssg1.def.tmn +
    '〜' +
    ssg1.def.tmx +
    '【' +
    ssg1.def.kbn +
    '】'
  }`;

  const description1 = '';
  const rep1 = {
    ndb: '処方薬ランキング',
  };
  rep1[ssg1.def.did] = ssg1.def.dis;

  ////for Suiig
  const [chartData, setChartData] = useState([]);
  const [did_list1, setDid] = useState([]);
  const [dis_list1, setDnm] = useState([]);

  /////
  const check_length = selectedFlatRows.length;
  useEffect(() => {
    if (integ) {
      var did_list2 = [];
      var dis_list2 = [];
      selectedFlatRows.forEach((v, i) => {
        if (i > 10) {
          return;
        }
        did_list2.push(v.original.dnm[1]);
        dis_list2.push(v.original.dnm[0]);
      });
      setDid(did_list2);
      setDnm(dis_list2);
    }
  }, [check_length]);
  /////////////
  useEffect(() => {
    if (integ && integ.tab && did_list1 != undefined) {
      var child1 = [];
      ssg1.def.tml.forEach((v0, i0) => {
        var child2 = {};
        child2['year'] = v0;
        if (!integ.tab[v0]) return;
        did_list1.forEach((v1, i1) => {
          var th_categories = integ.tab[v0].data.find((s0) => s0.dnm[1] == did_list1[i1]);
          var lastYear = ssg1.def.tml[ssg1.def.tml.length - 1];
          if (!integ.tab[lastYear]) return;
          var th_categories_base = integ.tab[lastYear].data.find(
            (s0) => s0.dnm[1] == did_list1[i1],
          );
          if (th_categories && th_categories_base != undefined) {
            if (th_categories[graph.value] != '') {
              if (Array.isArray(th_categories[graph.value])) {
                child2[th_categories_base.dnm[0]] = Number(th_categories[graph.value][0]);
              } else {
                child2[th_categories_base.dnm[0]] = Number(th_categories[graph.value]);
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
    <Box sx={{ flex: 1, alignSelf: 'flex-start', alignItems: 'flex-start' }}>
      <Typography variant='h2' component='h2' id='gen'>
        【一般名・成分】{ssg1.def.enm}の処方数・売上の推移グラフ【{kbn1[ssg1.def.kbn]}】【
        {ssg1.def.tmn}〜{ssg1.def.tmx}年】
      </Typography>
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
      <Typography variant='h2' component='h2' id='gen'>
        【一般名・成分】{ssg1.def.enm}の処方数ランキング{value}【{kbn1[ssg1.def.kbn]}】
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
      <Box className={classes.retable}>
        <table
          {...getTableProps()}
          className={[classes.table1, classes.shohou1, classes.gen].join(' ')}
        >
          <thead>
            {headerGroups.map((headerGroup, index1) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={'s' + index1}>
                {headerGroup.headers.map((column, index12) => (
                  <th
                    key={'t' + index12}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted && !column.disableSortBy
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
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
              return (
                <tr {...row.getRowProps()} key={'u' + index2}>
                  {row.cells.map((cell, index3) => {
                    return (
                      <td key={'v' + index3} {...cell.getCellProps()}>
                        {index3 == 0 && cell.render('Cell')}
                        {index3 == 1 && cell.render('Cell')}
                        {index3 == 2 && (
                          <Fragment>
                            <Link
                              prefetch={false}
                              href={'/ndb/prescription/' + ssg1.def.shd + '_' + cell.value[1]}
                            >
                              {cell.value[0]}
                            </Link>
                          </Fragment>
                        )}
                        {index3 == 3 && (
                          <div className={classes.p1}>
                            <div className={classes.p2}>{cell.value[0].toLocaleString()}</div>
                            <div className={classes.p4}>
                              <div
                                className={classes.p3}
                                style={{
                                  width: cell.value[1] + '%',
                                  backgroundColor: cell.value[2],
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {index3 == 4 && (
                          <span className={classes[cell.value[1]]}>
                            {cell.value[2]}
                            {cell.value[0]}%
                          </span>
                        )}
                        {index3 == 5 && <span>{formatNumber(cell.value)}</span>}
                        {index3 == 6 && <span>{cell.value}%</span>}
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

export default App;

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
                    <th>薬剤名</th>
                    <th>{props.graph.label}</th>
                  </tr>
                </thead>
                <tbody>
                  {payload.map((v, i) => {
                    return (
                      <Fragment key={'t' + i}>
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
                          <td>
                            {Number(payload[i].value).toLocaleString()}
                            {props.graph.unit}
                          </td>
                        </tr>
                      </Fragment>
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
                dot={{ r: 1.5, fill: palette1[i3 % 100] }}
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
