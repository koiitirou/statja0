import {
  LineChart,
  Line,
  Tooltip,
  XAxis,
  Legend,
  YAxis,
  ResponsiveContainer,
  Surface,
  Symbols,
} from 'recharts';
import _ from 'lodash';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select').then((mod) => mod.default), {
  ssr: false,
  loading: () => null,
});

const LineChart1 = ({ ssg1, isfetch, graphList, ref1 }) => {
  //////////////////////
  const [disabled, setDisabled] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartColors, setColors] = useState([]);
  const [graph, setGraph] = useState(graphList[1]);
  ///////////////////////
  useEffect(() => {
    if (isfetch) {
      setColors(ssg1.lin.color);
      setChartData(ssg1.lin.data);
      setDisabled(ssg1.lin.disable);
      var df0 = [];
      Object.keys(ssg1.tab).forEach((v0, i0) => {
        var df1 = [];
        df1['year'] = v0;
        df1['全国'] = ssg1.tab[v0].def.sv;
        ssg1.tab[v0].data.forEach((v1, i1) => {
          df1[ref1[v1.p].tsh] = Number(v1.v[0]);
        });

        df0.push(df1);
      });
      setChartData(df0);
    }
  }, [ssg1]);

  //
  const [isMounted, setIsMounted] = useState(false); // Need this for the react-tooltip
  useEffect(() => {
    setIsMounted(true);
  }, []);

  ///////////////////
  useEffect(() => {
    if (isfetch && chartData != []) {
      // var did_list1 = [];
      // ydata[time_list2[time_list2.length - 1]].categories.forEach((v0, i0) => {
      //   did_list1.push(v0.did);
      // });
      /////////////
      var child1 = [];
      ssg1.def.tml.forEach((v0, i0) => {
        var child2 = {};
        child2['y'] = v0;
        if (graph.value == 'v') {
          child2['全国'] = ssg1.tab[v0].data.sv;
        }
        ssg1.tab[v0].data.forEach((v1, i1) => {
          if (graph.value == 'r') {
            child2[ref1[v1.p].tsh] = Number(v1.r);
          } else if (graph.value == 'v') {
            child2[ref1[v1.p].tsh] = v1[graph.value][0];
          } else {
            child2[ref1[v1.p].tsh] = Number(v1[graph.value]);
          }

          // var th_categories = ydata[v0][0].table.data.find((s0) => s0.hkj[1] == did_list1[i1]);
          // var th_categories_base = ydata[time_list2[time_list2.length - 1]][0].table.data.find(
          //   (s0) => s0.hkj[1] == did_list1[i1],
          // );
          // if (th_categories && th_categories_base != undefined) {
          //   if (th_categories[graph.value] != '') {
          //     child2[th_categories_base.hkj[0]] = Number(th_categories[graph.value]);
          //   }
          // }
        });
        child1.push(child2);
      });
      setChartData(child1);
    }
  }, [graph]);

  //////////////////////
  const handleClick = (dataKey) => {
    if (_.includes(disabled, dataKey)) {
      setDisabled(disabled.filter((obj) => obj !== dataKey));
    } else {
      setDisabled(disabled.concat(dataKey));
    }
  };

  const renderCusomizedLegend = ({ payload }) => {
    return (
      <div className='customized-legend' style={{ paddingLeft: '50px' }}>
        {payload.map((entry) => {
          const { dataKey, color } = entry;
          const active = _.includes(disabled, dataKey);
          const style = {
            marginRight: 10,
            marginLeft: 10,
            display: 'inline-block',
            color: active ? '#AAA' : '#000',
            fontSize: '13px',
          };

          return (
            <span
              className='legend-item'
              onClick={() => handleClick(dataKey)}
              style={style}
              key={dataKey}
            >
              <Surface width={10} height={10} /* viewBox='0 0 10 10' */>
                <Symbols cx={5} cy={5} type='circle' size={50} fill={color} />
                {active && <Symbols cx={5} cy={5} type='circle' size={25} fill={'#FFF'} />}
              </Surface>
              <span>{dataKey}</span>
            </span>
          );
        })}
      </div>
    );
  };
  //////////////////////
  const CustomTooltip1 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='squaire-toolbox'>
          <Box
            sx={{
              backgroundColor: 'white',
              opacity: '0.9',
              padding: '5px 10px 5px 10px',
            }}
          >
            <Typography style={{ fontSize: '1em', color: 'dimgrey' }}>{label}</Typography>
            <table className='table'>
              <tbody>
                <tr style={{ fontSize: '0.8em', color: 'dimgrey' }}>
                  <td>都道府県</td>
                  <td>値</td>
                </tr>
                {payload.map((v, i) => {
                  return (
                    <tr key={'t' + i} style={{ fontSize: '0.8em' }}>
                      <td>
                        <Surface width={10} height={10} /* viewBox='0 0 10 10' */>
                          <Symbols cx={5} cy={5} type='circle' size={50} fill={v.color} />
                          {/* {active && (
                            <Symbols cx={5} cy={5} type='circle' size={25} fill={'#FFF'} />
                          )} */}
                        </Surface>
                        {v.name}
                      </td>
                      <td style={{ color: v.color }}>
                        {graph.value != 'n' && `${Number(v.value).toLocaleString()} ${graph.unit}`}
                        {graph.value == 'n' &&
                          `${Number(v.value * -1).toLocaleString()} ${graph.unit}`}
                        {/* {graph.value == 'n' && (v.value * -1 >= 0 ? '' : '+')}
                        {graph.value == 'n' && v.value == 0
                          ? `${Number(v.value).toLocaleString()} ${graph.unit}`
                          : `${Number(v.value * -1).toLocaleString()} ${graph.unit}`} */}
                        {/* {['d', 'f'].includes(graph.value) && (v.value < 0 ? '' : '+')}
                        {['d', 'f'].includes(graph.value) &&
                          `${Number(v.value).toLocaleString()} ${graph.unit}`} */}
                        {/* {['d', 'f', 'n'].includes(graph.value) && (v.value * -1 < 0 ? '' : '+')}
                        {v.value == 0
                          ? `${Number(v.value).toLocaleString()} ${graph.unit}`
                          : `${Number(v.value * 1).toLocaleString()} ${graph.unit}`} */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </div>
      );
    }
    ////new Intl.NumberFormat('en').format(value) + ' ' + ssg1.def.ut1
    return null;
  };
  ///////////////////////
  return (
    <Box
      sx={{
        p: 0,
      }}
    >
      <Typography variant='h2' component='h2'>
        {ssg1.def.tl1}収穫量の都道府県別の経年推移グラフ【{ssg1.def.tmn}〜{ssg1.def.tmx}】
      </Typography>
      <Box sx={{ maxWidth: '400px' }} paddingBottom={2}>
        <Select
          defaultValue={graphList[1]}
          filterOption={false}
          options={graphList}
          onChange={(e) => {
            setGraph(e);
          }}
          isSearchable={false}
          id='selectbox3'
          instanceId='selectbox3'
        />
      </Box>
      {isMounted && (
        <ResponsiveContainer height={450}>
          <LineChart
            width={800}
            height={400}
            data={chartData}
            margin={{
              top: 5,
              right: 5,
              left: -50,
              bottom: 5,
            }}
          >
            {_.toPairs(chartColors)
              .filter((pair) => !_.includes(disabled, pair[0]))
              .map((pair) => (
                <Line
                  type='monotone'
                  dataKey={pair[0]}
                  stroke={pair[1]}
                  key={pair[0]}
                  dot={{ r: 0 }}
                />
              ))}
            <XAxis dataKey='y' tick={{ fontSize: 12 }} />
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
              reversed={graph.rev}
            />
            {/* <Tooltip
              formatter={(value) => new Intl.NumberFormat('en').format(value) + ' ' + ssg1.def.ut1}
            /> */}
            <Tooltip content={CustomTooltip1} />
            <Legend
              payload={_.toPairs(chartColors).map((pair) => ({
                dataKey: pair[0],
                color: pair[1],
              }))}
              content={renderCusomizedLegend}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default LineChart1;
