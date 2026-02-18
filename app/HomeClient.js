'use client';
import { Layout } from '@/components/layout';
import { Box } from '@mui/material';
import theme from '@/theme';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { Typography, Card, CardContent, CardHeader, CardActionArea } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PublicIcon from '@mui/icons-material/Public';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PlaceIcon from '@mui/icons-material/Place';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Blogcard = (props) => {
  return (
    <CardActionArea href={props.href1}>
      <Card sx={{ display: 'flex', marginBottom: '15px' }}>
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {props.icon1}
        </CardContent>
        <CardHeader
          sx={{
            display: 'flex',
            flex: '1',
          }}
          title={
            <Typography fontWeight='bold' fontSize={{ xs: '16px', md: '18px' }}>
              {props.title1}
            </Typography>
          }
          subheader={
            <Typography color='dimgrey' fontSize={{ xs: '12px', md: '14px' }}>
              {props.sub1}
            </Typography>
          }
        ></CardHeader>

        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowForwardIosIcon />
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export default function HomeClient() {
  const title1 = '世界・都道府県・市区町村・医療のデータランキング';
  return (
    <Layout>
      <Box sx={{ p: 1, maxWidth: '1300px', width: 'auto', margin: 'auto' }}>
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { width: '67%', margin: 'auto' },
          }}
        >
          <Typography variant='h1'>{title1}</Typography>
          <Blogcard
            href1='/pyramid/JP/'
            title1='人口ピラミッド'
            sub1='世界各国、日本、都道府県、市区町村の人口ピラミッド'
            icon1={<EqualizerIcon sx={{ fill: '#007FFF' }} fontSize='large' />}
          />
          <Blogcard
            href1='/world/'
            title1='世界ランキング'
            sub1='世界各国の統計データランキング'
            icon1={<PublicIcon sx={{ fill: '#007FFF' }} fontSize='large' />}
          />
          <Blogcard
            href1='/prefecture/'
            title1='都道府県ランキング'
            sub1='都道府県の統計データランキング'
            icon1={<PlaceIcon sx={{ fill: '#007FFF' }} fontSize='large' />}
          />
          <Blogcard
            href1='/city/'
            title1='市区町村ランキング'
            sub1='市区町村の統計データランキング'
            icon1={<PinDropIcon sx={{ fill: '#007FFF' }} fontSize='large' />}
          />
          <Blogcard
            href1='/ndb/'
            title1='処方薬ランキング'
            sub1='処方数・薬価の性別・都道府県別・区分別データランキング推移'
            icon1={<VaccinesIcon sx={{ fill: '#007FFF' }} fontSize='large' />}
          />
          <Blogcard
            href1='/ndb/checkup/'
            title1='特定健診データ'
            sub1='BMI、血圧、血液検査などのデータを比較'
            icon1={<FavoriteIcon sx={{ fill: '#007FFF' }} fontSize='large' />}
          />
          <Blogcard
            href1='/dpc/'
            title1='病院実績ランキング'
            sub1='日本のDPC病院一覧、診断病名一覧から治療実績ランキングを比較'
            icon1={<LocalHospitalIcon sx={{ fill: '#007FFF' }} fontSize='large' />}
          />
        </Box>
      </Box>
    </Layout>
  );
}
