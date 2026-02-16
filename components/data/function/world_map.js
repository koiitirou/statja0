import { Box, Typography, Chip, Slider } from '@mui/material';
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps';
import features1 from '@/components/wor/w110m_iso2.json';
//import features1 from './features.json';
import { scaleQuantize } from 'd3-scale';
import { geoCentroid } from 'd3-geo';
import mss from '@/components/d3css/map.module.css';
const color1 = [
  '#F7FBFF',
  '#DEEBF7',
  '#C6DBEF',
  '#9ECAE1',
  '#6BAED6',
  '#4292C6',
  '#2171B5',
  '#08519C',
  '#08306B',
];
import { useMemo, useState, useEffect } from 'react';
const color2 = ['black', 'black', 'black', 'black', 'black', 'white', 'white', 'white', 'white'];

const Map1 = ({ ssg1, marks, cls1, isLoaded }) => {
  const [value, setValue] = useState(() => ssg1.def.tmx);
  const [data, setData] = useState(() => ssg1.tab[ssg1.def.tmx].data);
  const [gid, setGid] = useState(data[0].i);
  const [html1, setHtml1] = useState();
  const [content, setContent] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setData(ssg1.tab[value].data);
    }
  }, [ssg1, value, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      var cur2 = ssg1.tab[value].data.find((s) => s.i == gid);
      var html2 = () => {
        return (
          <div>
            <Typography content='h6'>
              {cur2 ? cls1[cur2.i].jpn : ''} {value}
            </Typography>

            <Box sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
              <table className={mss.table}>
                <tbody>
                  <tr>
                    <th>分類</th>
                    <th>値</th>
                  </tr>

                  <tr>
                    <td>{ssg1.def.idj}</td>
                    <td>
                      {cur2
                        ? Number(cur2.v[0]).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : ''}
                      {ssg1.def.ut1}
                    </td>
                  </tr>
                  <tr>
                    <td>順位</td>
                    <td>{cur2 ? cur2.r : ''}</td>
                  </tr>
                  <tr>
                    <td>前年比</td>
                    <td>
                      {ssg1.def.tmn != value && (
                        <span
                          className={
                            cur2
                              ? cur2.d < 0
                                ? mss.mi1
                                : (cur2.d == 0) | (cur2.d == 'NaN')
                                ? mss.ne1
                                : mss.pl1
                              : ''
                          }
                        >
                          {cur2 ? ((cur2.d < 0) | (cur2.d == 'NaN') ? '' : '+') : ''}
                          {cur2
                            ? cur2.d == 'NaN'
                              ? ''
                              : cur2.d == 'Inf'
                              ? 'Inf%'
                              : `${Number(cur2.d).toFixed(2)}%`
                            : ''}
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </div>
        );
      };
      setHtml1(html2);
      setContent(html2);
    }
  }, [value, gid, ssg1, cls1, isLoaded]);

  const minmax1 = [ssg1.def.vmn, ssg1.def.vmx];
  const colorScale1 = scaleQuantize().domain(minmax1).range(color1);
  const colorScale2 = scaleQuantize().domain(minmax1).range(color2);

  const handleChange = (event, value1) => {
    if (typeof value1 === 'number' && ssg1.tab[value1]) {
      setValue(value1);
    }
  };
  return (
    <>
      <Typography variant='h2'>
        {ssg1.def.idj}の地図ヒートマップ {value}
      </Typography>
      <Box
      // maxWidth='600px'
      >
        <Box maxWidth='600px'>
          <Typography display='inline' gutterBottom sx={{ paddingLeft: '10px' }}>
            年度: <span style={{ fontWeight: 'bold' }}>{value} </span>
          </Typography>
          <Chip
            label='－'
            size='small'
            variant='outlined'
            onClick={() => {
              const ind1 = marks.findIndex((ss) => ss.value == value);
              marks[ind1 - 1] ? setValue(marks[ind1 - 1].value) : null;
              setContent(html1);
            }}
          />{' '}
          <Chip
            label='＋'
            size='small'
            variant='outlined'
            onClick={() => {
              const ind1 = marks.findIndex((ss) => ss.value == value);
              marks[ind1 + 1] ? setValue(marks[ind1 + 1].value) : null;
              setContent(html1);
            }}
          />
          <Box margin='auto' padding='0px 50px'>
            <Slider
              value={Number(value)}
              aria-label='non-linear-slider'
              defaultValue={Number(value)}
              min={Number(ssg1.def.tmn)}
              max={Number(ssg1.def.tmx)}
              //valueLabelFormat={valueLabelFormat}
              //getAriaValueText={valuetext}
              step={null}
              valueLabelDisplay='auto'
              marks={marks}
              onChange={handleChange}
            />
          </Box>
          <Box
            sx={{ fontSize: { xs: '12px', sm: '14px' } }}
            className={[mss.legend, mss.legendHorizontal, mss.legendScale].join(' ')}
            // className='legend legend-horizontal legend-scale'
          >
            <span className={mss.legendValue}>
              {Number(minmax1[0]).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className={mss.legendBox} style={{ backgroundColor: '#f7fbff' }}></span>
            <span className={mss.legendBox} style={{ backgroundColor: '#deebf7' }}></span>
            <span className={mss.legendBox} style={{ backgroundColor: '#c6dbef' }}></span>
            <span className={mss.legendBox} style={{ backgroundColor: '#9ecae1' }}></span>
            <span className={mss.legendBox} style={{ backgroundColor: '#6baed6' }}></span>
            <span className={mss.legendBox} style={{ backgroundColor: '#4292c6' }}></span>
            <span className={mss.legendBox} style={{ backgroundColor: '#2171b5' }}></span>
            <span className={mss.legendBox} style={{ backgroundColor: '#08519c' }}></span>
            <span className={mss.legendBox} style={{ backgroundColor: '#08306b' }}></span>
            <span className={mss.legendValue}>
              {Number(minmax1[1]).toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
              {ssg1.def.unit2}
            </span>
          </Box>
        </Box>
        <ComposableMap
          height={400}
          data-tip=''
          projection='geoMercator'
          projectionConfig={{
            // rotate: [-10.0, -53.0, 0],
            center: [0, 20],
            scale: 130,
          }}
          // projection='geoEqualEarth'
        >
          <ZoomableGroup
            // center={center}
            // onMove={(x, y, k, dragging) => {
            // }}
            zoom={1}
            // onMoveEnd={handlePanChange}
            translateExtent={[
              [0, 0],
              [800, 400],
            ]}
          >
            <Geographies geography={features1}>
              {({ geographies }) =>
                geographies.map((geo, i1) => {
                  const centroid = geoCentroid(geo);
                  const cur = data.find((s) => s.i === geo.id);

                  return (
                    <g key={'g' + i1}>
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        stroke='#909090'
                        fill={cur ? colorScale1(cur.v[0]) : 'lightgrey'}
                        onMouseEnter={() => {
                          if (!isClicked) {
                            setGid(geo.id);
                            setContent(html1);
                          }
                        }}
                        onClick={() => {
                          setGid(geo.id);
                          setContent(html1);
                          if (!isClicked) {
                            setIsClicked(true);
                          } else {
                            setIsClicked(false);
                          }
                        }}
                        style={{
                          default: {
                            /* fill: '#D6D6DA', */
                            outline: 'none',
                          },
                          hover: {
                            fill: '#F58462',
                            outline: 'none',
                          },
                          pressed: {
                            fill: '#F58462',
                            outline: 'none',
                          },
                        }}
                      />
                    </g>
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        <Box
          className={mss.squaireToolbox}
          sx={{
            display: {
              xs: 'block',
              //  sm: 'none'
            },
          }}
        >
          {content}
        </Box>
      </Box>
    </>
  );
};

export default Map1;
