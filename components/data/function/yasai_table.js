import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import { memo, useMemo, Fragment, useState, useEffect, React } from 'react';
import { Box, Typography } from '@mui/material';
import classes from '@/components/d3css/prefecture.module.css';
import Link from 'next/link';
import { matchSorter } from 'match-sorter';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import regeneratorRuntime from 'regenerator-runtime';
/////////////////////
///////////////都道府県

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
        placeholder={`${count} 都道府県...`}
        className={classes.filter}
      />
    </span>
  );
}
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  // return matchSorter(rows, filterValue, { keys: [(row) => String(ssg1.ref[row.values[id]].td_name) ] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

////////////////App ()
const App = (props) => {
  const ref1 = props.ref1;
  const marks = props.marks;
  const ssg1 = props.ssg1;
  var init1 = [];
  const [value, setValue] = useState(useMemo(() => ssg1.def.tmx));
  const [data, setData] = useState(useMemo(() => ssg1.tab[ssg1.def.tmx].data));
  useEffect(() => {
    if (props.isfetch) {
      setData(ssg1.tab[value].data);
    }
  }, [ssg1, value]);
  /////////////////

  // useEffect(() => {
  //   if (isfetch) {
  //     var marks0 = [];
  //     for (let i = 0; i < ssg1.def.tml.length; i++) {
  //       var thisYear = {};
  //       thisYear['value'] = Number(ssg1.def.tml[i]);
  //       marks0.push(thisYear);
  //     }
  //     setMarks(marks0);
  //   }
  // }, [isfetch]);

  const handleChange = (event, value) => {
    if (typeof value === 'number' && ssg1.tab[value]) {
      setValue(value);
    }
  };
  var columns = ssg1.tab[ssg1.def.tmx].columns;

  function numberSort(rowA, rowB, id, desc) {
    let a = Number(rowA.values[id][0]);
    let b = Number(rowB.values[id][0]);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  function tdSort(rowA, rowB, id, desc) {
    // let a = String(ssg1.ref[rowA.values[id]].td_name);
    // let b = String(ssg1.ref[rowB.values[id]].td_name);
    let a = String(rowA.values[id]);
    let b = String(rowB.values[id]);
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  function NumSort(rowA, rowB, id, desc) {
    // let a = String(ssg1.ref[rowA.values[id]].td_name);
    // let b = String(ssg1.ref[rowB.values[id]].td_name);
    let a = Number(rowA.values[id]);
    let b = Number(rowB.values[id]);
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }

  columns[0].columns[3].sortType = NumSort;
  columns[0].columns[4].sortType = NumSort;
  columns[0].columns[5].sortType = NumSort;

  /////////////////Filter option

  // var options0 = [];
  // retable1.data.forEach((v) => {
  //   options0.push(v.dng[0]);
  // });
  // var options1 = [...new Set(options0)];
  /////////////////column filter
  // function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
  //   return (
  //     <select
  //       value={filterValue}
  //       onChange={(e) => {
  //         setFilter(e.target.value || undefined);
  //       }}
  //     >
  //       <option value=''>全て</option>
  //       {options1.map((v, i) => {
  //         return (
  //           <option key={i} value={v}>
  //             {v}
  //           </option>
  //         );
  //       })}
  //     </select>
  //   );
  // }
  //////////////////////////////////
  /////initial state
  // const [select1, setSelect1] = useState('ジアゼパム');
  // const [filter1, setFilter1] = useState({
  //   filters: [
  //     {
  //       id: 'dng',
  //       value: 'ジアゼパム',
  //     },
  //   ],
  // });
  // var init1 = filter1;
  // useEffect(() => {
  //   setFilter1({
  //     filters: [
  //       {
  //         id: 'dng',
  //         value: select1,
  //       },
  //     ],
  //   });
  // });
  // filters: [
  //   {
  //     id: 'dng',
  //     value: 'ロラぜパム',
  //   },
  // ],
  // var init1 = [];
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
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
  );

  const unit1 = ssg1.def.ut0;
  return (
    <Box>
      <Typography variant='h2' component='h2' id='ind'>
        {ssg1.def.tl1}収穫量の都道府県別のランキング順位表【{ssg1.def.tmn}〜{ssg1.def.tmx}】
      </Typography>
      <Box maxWidth='600px'>
        <Typography fontWeight='bold' variant='body2' padding='10px'>
          平均：{Number(ssg1.tab[value].def.mn).toLocaleString()}
          {ssg1.def.ut0}
          {'　'}
          {ssg1.tab[value].def.sv != ''
            ? `合計：${Number(ssg1.tab[value].def.sv).toLocaleString()}${ssg1.def.ut0}`
            : ''}
        </Typography>
        <Typography display='inline' gutterBottom sx={{ paddingLeft: '10px' }}>
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
        <Box padding='0px 50px'>
          <Slider
            valueLabelDisplay='auto'
            value={Number(value)}
            aria-label='non-linear-slider'
            defaultValue={Number(ssg1.def.tmx)}
            min={Number(ssg1.def.tmn)}
            max={Number(ssg1.def.tmx)}
            step={null}
            marks={marks}
            onChange={handleChange}
          />
        </Box>
      </Box>
      <Box className={classes.retable}>
        <table {...getTableProps()} className={[classes.table1, classes.yasai1].join(' ')}>
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
                    {/* <span>
                    {column.isSorted && !column.disableSortBy
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>*/}
                    {/* <div>{column.Header == '一般名' ? column.render('Filter') : null}</div> */}
                  </th>
                  );
                })}
              </tr>
              );
            })}
            {/* <tr>
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
            </tr> */}
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
                      <td
                        key={'v' + index3}
                        {...cellProps}
                        /*   className={[classes['td' + index3], classes.td].join(' ')} */
                      >
                        {index3 == 0 && cell.render('Cell')}
                        {index3 == 1 && (
                          <Fragment>
                            <img
                              src={'/img/logo/' + cell.value + '.png'}
                              width={16}
                              height={16}
                              alt={cell.value}
                              className={classes.img1}
                            />
                            <Link
                              prefetch={false}
                              href={'/prefecture/info/' + cell.value + '/category/'}
                            >
                                {ref1[cell.value].tln}
                            </Link>
                            {/* （
                          <Link prefetch={false} href={'/ndb/prescription/' + cell.value[4]}>
                            <a>{cell.value[3]}</a>
                          </Link>
                          ） */}
                          </Fragment>
                        )}
                        {index3 == 2 && (
                          <div className={classes.p1}>
                            <div className={classes.p2}>
                              {Number(cell.value[0]).toLocaleString()}
                              {unit1}
                            </div>
                            <div className={classes.p4}>
                              <div
                                className={classes.p3}
                                style={{
                                  width: (cell.value[1] == '' ? 0 : cell.value[1]) + '%',
                                  backgroundColor: ref1[cell.value[2]].tcl,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {index3 == 3 &&
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
                              {Number(cell.value).toLocaleString()}
                            </span>
                          ))}
                        {index3 == 5 &&
                          (value == Number(ssg1.def.tmn) ? (
                            ''
                          ) : Number(cell.value) == 0 ? (
                            ''
                          ) : (
                            <span
                              className={
                                classes[
                                  Number(cell.value * -1) < 0
                                    ? 'mi1'
                                    : Number(cell.value) == 0
                                    ? 'ne1'
                                    : 'pl1'
                                ]
                              }
                            >
                              {Number(cell.value * -1) < 0 ? '' : '+'}
                              {Number(cell.value * -1)}
                            </span>
                          ))}
                        {index3 == 6 && (
                          <span>
                            {Number(cell.value).toLocaleString()}
                            {ssg1.def.ut1}
                          </span>
                        )}
                        {index3 == 7 && (
                          <span>
                            {Number(cell.value).toLocaleString()}
                            {ssg1.def.ut2}
                          </span>
                        )}
                        {index3 == 8 && (
                          <span>
                            {Number(cell.value).toLocaleString()}
                            {ssg1.def.ut3}
                          </span>
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
  );
};

export default memo(App);
