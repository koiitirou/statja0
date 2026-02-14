'use client';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { memo, useMemo, Fragment, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import classes from '@/components/d3css/prefecture.module.css';
import Link from 'next/link';
import { matchSorter } from 'match-sorter';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';

////////////////////
///////////////都道府県

function GlobalFilter({ table }) {
  const [value, setValue] = useState('');

  return (
    <span className={classes.filter}>
      検索:{' '}
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          table.setGlobalFilter(e.target.value || undefined);
        }}
        placeholder={`47 都道府県...`}
        className={classes.filter}
      />
    </span>
  );
}

const fuzzyFilter = (row, columnId, filterValue) => {
  const itemRank = matchSorter([row.getValue(columnId)], filterValue);
  return itemRank.length > 0;
};

////////////////App ()
const App = (props) => {
  const marks = props.marks;
  const ssg1 = props.ssg1;
  const [value, setValue] = useState(ssg1.def.tmx);
  const [data, setData] = useState(ssg1.tab[ssg1.def.tmx].data);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    if (props.isfetch) {
      setData(ssg1.tab[value].data);
    }
  }, [ssg1, value]);

  const handleChange = (event, value) => {
    if (typeof value === 'number' && ssg1.tab[value]) {
      setValue(value);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'r',
        header: '順位',
        sortingFn: (rowA, rowB) => Number(rowA.original.r) - Number(rowB.original.r),
      },
      {
        accessorKey: 'p',
        header: '都道府県',
        sortingFn: (rowA, rowB) => {
          const a = String(rowA.original.p);
          const b = String(rowB.original.p);
          return a > b ? 1 : a < b ? -1 : 0;
        },
        cell: ({ getValue }) => {
          const cellValue = getValue();
          return (
            <Fragment>
              <img
                src={'/img/logo/' + cellValue[1] + '.png'}
                width={16}
                height={16}
                alt={cellValue[0]}
                className={classes.img1}
              />
              <Link prefetch={false} href={'/prefecture/info/' + cellValue[1] + '/category/'}>
                {cellValue[0]}
              </Link>
            </Fragment>
          );
        },
      },
      {
        accessorKey: 'v',
        header: ssg1.tab[ssg1.def.tmx].columns[2]?.Header || '値',
        sortingFn: (rowA, rowB) => Number(rowA.original.v[0]) - Number(rowB.original.v[0]),
        cell: ({ getValue }) => {
          const cellValue = getValue();
          return (
            <div className={classes.p1}>
              <div className={classes.p2}>{cellValue[0].toLocaleString()}</div>
              <div className={classes.p4}>
                <div
                  className={classes.p3}
                  style={{
                    width: cellValue[1] + '%',
                    backgroundColor: ssg1.ref[cellValue[2]]?.color || '#2196f3',
                  }}
                ></div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'd',
        header: '前年比',
        sortingFn: (rowA, rowB) => Number(rowA.original.d) - Number(rowB.original.d),
        cell: ({ getValue }) => {
          const cellValue = getValue();
          if (value == Number(ssg1.def.tmn)) return '';
          return (
            <span
              className={
                classes[
                  Number(cellValue) < 0 ? 'mi1' : Number(cellValue) == 0 ? 'ne1' : 'pl1'
                ]
              }
            >
              {Number(cellValue) < 0 ? '' : '+'}
              {Number(cellValue).toFixed(2)}%
            </span>
          );
        },
      },
      {
        accessorKey: 'f',
        header: '前年差',
        sortingFn: (rowA, rowB) => Number(rowA.original.f) - Number(rowB.original.f),
        cell: ({ getValue }) => {
          const cellValue = getValue();
          if (value == Number(ssg1.def.tmn)) return '';
          return (
            <span
              className={
                classes[
                  Number(cellValue) < 0 ? 'mi1' : Number(cellValue) == 0 ? 'ne1' : 'pl1'
                ]
              }
            >
              {Number(cellValue) < 0 ? '' : '+'}
              {Number(cellValue).toLocaleString()}
            </span>
          );
        },
      },
      {
        accessorKey: 'n',
        header: '順位差',
        sortingFn: (rowA, rowB) => Number(rowA.original.n) - Number(rowB.original.n),
        cell: ({ getValue }) => {
          const cellValue = getValue();
          if (value == Number(ssg1.def.tmn)) return '';
          if (Number(cellValue) == 0) return '';
          return (
            <span
              className={
                classes[
                  Number(cellValue * -1) < 0 ? 'mi1' : Number(cellValue) == 0 ? 'ne1' : 'pl1'
                ]
              }
            >
              {Number(cellValue * -1) < 0 ? '' : '+'}
              {Number(cellValue * -1)}
            </span>
          );
        },
      },
    ],
    [ssg1, value],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const unit1 = ssg1.def.ut1;
  return (
    <Box>
      <Typography variant='h2' component='h2' id='ind'>
        {ssg1.def.tl1}の都道府県別のランキング順位表【{ssg1.def.tmn}〜{ssg1.def.tmx}
      </Typography>
      <Box maxWidth='600px'>
        <Typography fontWeight='bold' variant='body2' padding='10px'>
          平均：{Number(ssg1.val[value].mn).toLocaleString()}
          {ssg1.def.ut1}
          {'　'}
          {ssg1.val[value].sv != ''
            ? `合計：${Number(ssg1.val[value].sv).toLocaleString()}${ssg1.def.ut1}`
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
        <table className={[classes.table1, classes.shohou1].join(' ')}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span>
                      {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted()] ?? ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
            <tr>
              <th
                colSpan={columns.length}
                style={{
                  textAlign: 'left',
                }}
              >
                <GlobalFilter table={table} />
              </th>
            </tr>
          </thead>
          <tbody className={classes.tb}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default memo(App);
