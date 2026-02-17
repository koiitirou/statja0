'use client';
import { useTable, useSortBy, useFilters, useGlobalFilter } from 'react-table';
import { useMemo, useState, useEffect, Fragment } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import Slider from '@mui/material/Slider';
import classes from '@/components/d3css/checkup.module.css';
import ref1 from '@/components/prefecture_list2.json';
import { scaleQuantize } from 'd3-scale';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Select from 'react-select';

const blue1 = ['#F7FBFF','#DEEBF7','#C6DBEF','#9ECAE1','#6BAED6','#4292C6','#2171B5','#08519C','#08306B'];
const red1 = ['#fee5e8','#fbc5cd','#f79baa','#f17287','#ee7989','#e44f67','#d62345','#ae1a39','#850e2c'];
const color1 = ['black','black','black','black','black','white','white','white','white'];

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}
fuzzyTextFilterFn.autoRemove = (val) => !val;

const Pyramid2 = (props) => {
  var init1 = [];
  const [value, setValue] = useState(props.ssg1.dat[props.ssg1.dat.length - 1].yrs);
  const marks = [];
  props.ssg1.dat.forEach((v) => { marks.push({ value: v.yrs }); });
  const handleChange = (event, value) => { if (typeof value === 'number') { setValue(value); } };
  const columns = props.ssg1.def.hea;
  const [data, setData] = useState(useMemo(() => props.ssg1.dat.find((s) => s.yrs == value).yal));
  useEffect(() => { setData(props.ssg1.dat.find((s) => s.yrs == value).yal); }, [value]);
  const filterTypes = useMemo(() => ({
    fuzzyText: fuzzyTextFilterFn,
    text: (rows, id, filterValue) => {
      return rows.filter((row) => {
        const rowValue = row.values[id];
        return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true;
      });
    },
  }), []);
  var init1 = [];
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable(
    { columns, data, initialState: init1, filterTypes, autoResetFilters: false, autoResetSortBy: false },
    useFilters, useGlobalFilter, useSortBy,
  );
  const minmax1 = [props.ssg1.def.mnm, props.ssg1.def.mxm];
  const minmax2 = [props.ssg1.def.mnf, props.ssg1.def.mxf];
  const colorScale1m = scaleQuantize().domain(minmax1).range(blue1);
  const colorScale2m = scaleQuantize().domain(minmax1).range(color1);
  const colorScale1f = scaleQuantize().domain(minmax2).range(red1);
  const colorScale2f = scaleQuantize().domain(minmax2).range(color1);
  const ageLength = props.ssg1.def.hea[[1]].columns.length;

  return (
    <>
      <Typography variant='h2'>
        {props.ssg1.def.i_0}の平均値推移 {props.ssg1.dat[0].yrs}〜{props.ssg1.dat[props.ssg1.dat.length - 1].yrs}（都道府県別・年齢別）
      </Typography>
      <Box>
        <Box style={{ position: 'sticky', top: '0px', backgroundColor: 'white' }} paddingTop={1}>
          <Box maxWidth='600px'>
            <Typography display='inline' gutterBottom sx={{ paddingLeft: '10px' }}>
              表示年度: <span style={{ fontWeight: 'bold' }}>{value}</span>年　
            </Typography>
            <Chip label='－' size='small' variant='outlined' onClick={() => { const ind1 = marks.findIndex((ss) => ss.value == value); marks[ind1 - 1] ? setValue(marks[ind1 - 1].value) : null; }} />{' '}
            <Chip label='＋' size='small' variant='outlined' onClick={() => { const ind1 = marks.findIndex((ss) => ss.value == value); marks[ind1 + 1] ? setValue(marks[ind1 + 1].value) : null; }} />
            <Box padding='0px 50px'>
              <Slider valueLabelDisplay='auto' value={Number(value)} aria-label='non-linear-slider' defaultValue={Number(props.ssg1.dat[props.ssg1.dat.length - 1].yrs)} min={Number(props.ssg1.dat[0].yrs)} max={Number(props.ssg1.dat[props.ssg1.dat.length - 1].yrs)} step={null} marks={marks} onChange={handleChange} />
            </Box>
          </Box>
        </Box>
        <Box className={classes.retable}>
          <table {...getTableProps()} className={[classes.table1].join(' ')}>
            <thead>
              {headerGroups.map((headerGroup, i1) => {
                const { key: hgKey, ...hgProps } = headerGroup.getHeaderGroupProps();
                return (
                <tr key={'s' + i1} {...hgProps}>
                  {headerGroup.headers.map((column, i2) => {
                    const { key: _k1, ...sortProps } = column.getHeaderProps(column.getSortByToggleProps());
                    const { key: _k2, ...colProps } = column.getHeaderProps();
                    return (
                      <th key={'t' + i2} {...sortProps} {...colProps}
                        className={column.Header == '男性' ? classes.male : (i2 >= 1) & (i2 <= ageLength) ? classes.female : i2 == 0 ? '' : classes.male}>
                        {column.render('Header')}
                        <span>{column.isSorted && !column.disableSortBy ? column.isSortedDesc ? ' 🔽' : ' 🔼' : ''}</span>
                      </th>
                    );
                  })}
                </tr>
                );
              })}
              <tr><th colSpan={visibleColumns.length} style={{ textAlign: 'left' }}></th></tr>
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, index2) => {
                prepareRow(row);
                const { key: rKey, ...rowProps } = row.getRowProps();
                return (
                  <tr key={'u' + index2} {...rowProps}>
                    {row.cells.map((cell, i3) => {
                      const { key: cKey, ...cellProps } = cell.getCellProps();
                      return (
                        <td key={'v' + i3}
                          style={i3 >= ageLength + 1 ? { color: colorScale2m(Number(cell.value)), backgroundColor: colorScale1m(Number(cell.value)) }
                            : i3 >= 1 ? { color: colorScale2f(Number(cell.value)), backgroundColor: colorScale1f(Number(cell.value)) } : {}}
                          {...cellProps}>
                          {i3 == 0 ? (<span>{ref1[cell.value].tln}</span>) : (<span>{cell.value}</span>)}
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
      <Kubun props={props} />
    </>
  );
};
export default Pyramid2;

const Kubun = ({ props }) => {
  const [legend_ref, setLegend_ref] = useState(props.ssg2.dat[0].tag);
  const uniqueYear = [...new Set(props.ssg2.dat.map((item) => item.yrs))];
  const [year, setYear] = useState(uniqueYear[uniqueYear.length - 1]);
  const [pref, setPref] = useState(props.ssg2.dat[props.ssg2.dat.length - 1].yat[0].pre);
  const [data, setData] = useState(props.ssg2.dat.find((s) => s.yrs == year).yat[0].pat);
  const [uniquePref, setUniquePref] = useState([...new Set(props.ssg2.dat.find((s) => s.yrs == year).yat.map((item) => item.pre))]);
  useEffect(() => { setUniquePref([...new Set(props.ssg2.dat.find((s) => s.yrs == year).yat.map((item) => item.pre))]); }, [year]);
  useEffect(() => {
    setData(props.ssg2.dat.find((s) => s.yrs == year).yat.find((t) => t.pre == pref).pat);
    setLegend_ref(props.ssg2.dat.find((s) => s.yrs == year).tag);
  }, [year, pref]);
  const select1List = [];
  uniquePref.forEach((v) => { select1List.push({ value: v, label: ref1[v].tln }); });
  const marks = [];
  uniqueYear.forEach((v) => { marks.push({ value: Number(v) }); });
  const CustomLegend = ({ payload }) => {
    const legend_rev = legend_ref.reduceRight((p, c) => [...p, c], []);
    const payload_rev = payload.reduceRight((p, c) => [...p, c], []);
    return (
      <ul style={{ marginLeft: '60px', display: 'block', textAlign: 'left', padding: 0, listStyle: 'none' }}>
        {payload_rev.map((entry, index) => {
          return (
            <li key={`item-${index}`} style={{ marginRight: '20px', display: 'inline-block' }}>
              <span className='legend-icon' style={{ marginRight: '4px', display: 'inline-block', width: '12px', height: '12px', backgroundColor: entry.color }}></span>
              {legend_rev[index].tag}
            </li>
          );
        })}
      </ul>
    );
  };
  const CustomTooltip = ({ active, payload, label }) => {
    const legend_rev = legend_ref.reduceRight((p, c) => [...p, c], []);
    const payload_rev = payload.reduceRight((p, c) => [...p, c], []);
    if (active && payload && payload.length) {
      return (
        <Box sx={{ fontSize: { xs: '12px', sm: '14px' }, backgroundColor: 'white', opacity: '0.9', padding: '5px 10px 5px 10px' }}>
          <Typography style={{ color: 'dimgrey' }}>
            性別：{payload[0].payload.s == 'f' ? (<span style={{ color: '#EE7989' }}>女性</span>) : (<span style={{ color: 'steelblue' }}>男性</span>)}
          </Typography>
          <Typography style={{ color: 'dimgrey' }}>{`年齢：${label}`}</Typography>
          <table className='table'>
            <tbody>
              {payload_rev.map((v, i) => {
                return (
                  <tr key={'t' + i}>
                    <td style={{ borderTop: '1px solid #ddd' }}>
                      <span className='legend-icon' style={{ marginRight: '4px', display: 'inline-block', width: '12px', height: '12px', backgroundColor: v.color }}></span>
                      {legend_rev[i].tag}
                    </td>
                    <td style={{ textAlign: 'right', paddingLeft: '10px', borderTop: '1px solid #ddd' }}>{v.value}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      );
    }
    return null;
  };
  const handleChange = (event, value) => { if (typeof value === 'number') { setYear(value); } };
  return (
    <>
      <Typography variant='h2'>
        {props.ssg2.def.i_0}の区分割合の推移 {uniqueYear[0]}〜{uniqueYear[uniqueYear.length - 1]}（年齢別・都道府県別・性別）
      </Typography>
      <Box maxWidth='600px'>
        <Typography display='inline' gutterBottom sx={{ paddingLeft: '10px' }}>
          表示年度: <span style={{ fontWeight: 'bold' }}>{year}</span>年　
        </Typography>
        <Chip label='－' size='small' variant='outlined' onClick={() => { const ind1 = marks.findIndex((ss) => ss.value == year); marks[ind1 - 1] ? setYear(marks[ind1 - 1].value) : null; }} />{' '}
        <Chip label='＋' size='small' variant='outlined' onClick={() => { const ind1 = marks.findIndex((ss) => ss.value == year); marks[ind1 + 1] ? setYear(marks[ind1 + 1].value) : null; }} />
        <Box padding='0px 50px'>
          <Slider valueLabelDisplay='auto' value={Number(year)} aria-label='non-linear-slider' defaultValue={Number(uniqueYear[uniqueYear.length - 1])} min={Number(uniqueYear[0])} max={Number(uniqueYear[uniqueYear.length - 1])} step={null} marks={marks} onChange={handleChange} />
        </Box>
      </Box>
      <Box sx={{ maxWidth: '400px' }} paddingBottom={2}>
        <Select defaultValue={select1List[0]} filterOption={false} options={select1List} onChange={(e) => { setPref(e.value); }} isSearchable={false} id='selectbox3' instanceId='selectbox3' />
      </Box>
      <ResponsiveContainer height={400}>
        <BarChart height={400} data={data} margin={{ top: 40, right: 5, left: -50, bottom: 5 }} style={{ fontSize: '0.8em' }}>
          <Tooltip content={<CustomTooltip />} />
          {legend_ref.map((v, i) => { return (<Fragment key={'b' + i}><Bar dataKey={v.key} stackId='a' fill={v.col} /></Fragment>); })}
          <Legend content={CustomLegend} />
          <YAxis tick={{ dx: 34, dy: -10, width: 0 }} orientation='left' type='number' domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(tick) => { return tick == 100 ? tick + '%' : ''; }} />
          <XAxis dataKey='n' type='category' />
          <CartesianGrid strokeDasharray='3 3' />
          <text x='26%' y='7%' style={{ fontSize: '1em', fontWeight: 'bold', fill: '#EE7989' }} width={200} textAnchor='middle'>女性</text>
          <text x='75%' y='7%' style={{ fontSize: '1em', fontWeight: 'bold', fill: 'steelblue' }} width={200} textAnchor='middle'>男性</text>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};
