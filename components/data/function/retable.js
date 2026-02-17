'use client';
import regeneratorRuntime from 'regenerator-runtime';
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
import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import index_data from '@/components/prefecture/index_data.json';
import classes from '@/components/d3css/retable.module.css';
import Search_dpc from '@/components/data/function/search_dpc';
import Link from 'next/link';
import { matchSorter } from 'match-sorter';
import dynamic from 'next/dynamic';
import { server } from '@/components/config';
import { json } from 'd3-fetch';
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

const Select = dynamic(() => import('react-select').then((mod) => mod.default), {
  ssr: false,
  loading: () => null,
});

///////////////////////
///////////////都道府県
var options1 = [];
const o1 = Object.entries(index_data);
o1.forEach((s) => {
  s[1].forEach((t) => {
    options1.push(t.short_name);
  });
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
        placeholder={`${count} 件...`}
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

//////////////////////////
////////////////App ()
const App = ({ ssg1, did1, graphList, time_list2, yearList, columns, dhsh, tArray, icdis }) => {
  /////////////////
  const tDis = dhsh ? tArray.params.dext : ssg1.definition.dis;
  const DisDes = ({ tDis, ssg1, did1 }) => {
    return dhsh ? (
      <Typography variant='body1'>
        　※「{tDis}」はDPC分類「
        <Link prefetch={false} href={'/dpc/' + did1}>
          {ssg1.definition.dis}
        </Link>
        」 に含まれるため、参考として「{ssg1.definition.dis}
        」の治療実績についてまとめています。
      </Typography>
    ) : (
      ' '
    );
  };

  columns[1].Filter = SelectColumnFilter;
  /////////////////
  const [graph, setGraph] = useState(graphList[1]);
  const [year, setYear] = useState(ssg1.definition.tim);
  const [summary, setSummary] = useState(ssg1);
  const [ydata, setYdata] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [init1, setInit1] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [did_list1, setDid] = useState(ssg1.definition.rank123_kok);
  const [dis_list1, setDnm] = useState(ssg1.definition.rank123_pre);
  useEffect(() => {
    setInit1([]);
  }, [year]);

  useEffect(() => {
    json(`${server}/retable/${did1}_all.json`).then((collection) => {
      setYdata(collection);
      setIsLoaded(true);
    });
    /////////////////
    if (did_list1 != undefined) {
      var init2 = {
        selectedRowIds: {},
      };
      did_list1.forEach((v0, i0) => {
        if (i0 > 10) {
          return;
        }
        init2.selectedRowIds[summary.table.data.findIndex((s) => s.hkj[1] == v0)] = true;
      });
    } else {
      var init2 = {
        selectedRowIds: {
          0: true,
        },
      };
    }
    setInit1(init2);
  }, []);
  useEffect(() => {
    if (isLoaded & (ydata != null)) {
      setSummary(ydata[year][0]);
    }
  }, [ydata, isLoaded, year]);
  /////

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

  const data = summary.table.data;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
    selectedFlatRows,
    state: { selectedRowIds, pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { ...init1, pageSize: 100, pageIndex: 0 },
      filterTypes,
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetGlobalFilter: false,
      autoResetPage: false,
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

  const title1 = `${tDis}の病院ランキング${ssg1.definition.time_min1}〜${ssg1.definition.time_max1}【入院数、手術件数】`;
  const description1 = `全国都道府県の${tDis}の病院ランキングです。治療実績（入院患者数、症例数）・手術件数・在院日数の推移を比較。${ssg1.definition.time_max1}年の1位は${ssg1.definition.rank123_pre[0]}で${ssg1.definition.rank123_val[0]}件、2位は${ssg1.definition.rank123_pre[1]}で${ssg1.definition.rank123_val[1]}件、3位は${ssg1.definition.rank123_pre[2]}で${ssg1.definition.rank123_val[2]}件でした。`;

  /////////////////column filter
  function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value=''>全国</option>
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

  const rep1 = {
    dpc: '病気名一覧',
    hospital: '病院一覧',
    alternative: '一般病名',
  };
  rep1[ssg1.definition.did] = tDis;
  rep1[dhsh] = tDis;

  ///////////////////////////////////////////////////
  const check_length = selectedFlatRows.length;
  useEffect(() => {
    if (ydata) {
      var did_list2 = [];
      var dis_list2 = [];
      selectedFlatRows.forEach((v, i) => {
        if (i > 10) {
          return;
        }
        did_list2.push(v.original.hkj[1]);
        dis_list2.push(v.original.hkj[0]);
      });
      setDid(did_list2);
      setDnm(dis_list2);
    }
  }, [check_length]);

  useEffect(() => {
    if (ydata && did_list1 != undefined) {
      var child1 = [];
      time_list2.forEach((v0, i0) => {
        var child2 = {};
        child2['year'] = v0;
        did_list1.forEach((v1, i1) => {
          var th_categories = ydata[v0][0].table.data.find((s0) => s0.hkj[1] == did_list1[i1]);
          var th_categories_base = ydata[time_list2[time_list2.length - 1]][0].table.data.find(
            (s0) => s0.hkj[1] == did_list1[i1],
          );
          if (th_categories && th_categories_base != undefined) {
            if (th_categories[graph.value] != '') {
              child2[th_categories_base.hkj[0]] = Number(th_categories[graph.value]);
            }
          }
        });
        child1.push(child2);
      });
      setChartData(child1);
    }
  }, [check_length, graph, did_list1]);
  //////////////////

  ///////////////////////////////////////////////////
  return (
    <Box>
      <Search_dpc />
      <Typography variant='h1' component='h1'>
        {title1}
      </Typography>
      <Typography variant='body1'>　{description1}</Typography>
      <Box marginTop='10px'>
        <DisDes tDis={tDis} ssg1={ssg1} did1={did1} />
      </Box>
      <Box marginTop='10px' marginBottom='10px'>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1-content'
            id='panel1-header'
            sx={{ justifyContent: 'flex-start' }}
          >
            {`・${ssg1.definition.dis}に含まれる病気名リスト`}
          </AccordionSummary>
          <AccordionDetails>{icdis}</AccordionDetails>
        </Accordion>
      </Box>
      <Box className={classes.retable}>
        <Kihon ssg1={ssg1} summary={summary} />
      </Box>
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
        {ssg1.definition.dis}の病院ランキング {year}
      </Typography>
      <Box sx={{ maxWidth: '400px' }}>
        <Select
          placeholder={'年度を選択する'}
          filterOption={false}
          options={yearList}
          onChange={(e) => {
            setYear(e.value);
          }}
          isSearchable={false}
        />
      </Box>
      <Box sx={{ overflowX: 'auto' }} className={classes.retable}>
        <table
          {...getTableProps()}
          className={[classes.table1, classes.dpc1].join(' ')}
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
                <tr key={'u' + index2} {...rowProps}>
                  {row.cells.map((cell, index3) => {
                    const { key: cKey, ...cellProps } = cell.getCellProps();
                    return (
                      <td
                        key={'v' + index3}
                        {...cellProps}
                      >
                        {index3 != 3 ? (
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
      <Typography variant='caption'>
        　*各病院で件数が10件未満のものは集計されていません。
      </Typography>
      <Typography variant='caption'>
        　*各病院のDPC病床におけるデータのみの集計で、全体を反映していません。
      </Typography>
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
                {label} {props.ssg1.definition.dis}
              </Typography>
              <table className={classes.tiptable} style={{ fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th>病気名</th>
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
                            {payload[i].value}
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
        {props.ssg1.definition.dis}の治療実績・手術件数・在院日数の推移グラフ
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

// eslint-disable-next-line react/display-name
const Kihon = memo((props) => {
  return (
    <>
      <Typography variant='h2' component='h2'>
        {props.ssg1.definition.dis}の手術分類別の治療実績と在院日数 {props.summary.definition.tim}
      </Typography>
      <Typography variant='body1'>診断分類：{props.ssg1.definition.nid_name}</Typography>
      <table className={classes.table2}>
        <thead>
          <tr>
            <th>手術分類</th>
            <th>治療実績 (件)</th>
            <th>在院日数 (日)</th>
          </tr>
        </thead>
        <tbody>
          {props.summary.summary.map((s, i1) => {
            return (
              <tr key={'t' + i1}>
                <td>{s.手術分類}</td>
                <td>{s.件数}</td>
                <td>{s.在院日数}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
});
