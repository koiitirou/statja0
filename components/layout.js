'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiLink from '@mui/material/Link';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const footerLink = [
  { title: '人口ピラミッド', href: '/pyramid/JP' },
  { title: '世界ランキング', href: '/world' },
  { title: '都道府県ランキング', href: '/prefecture' },
  { title: '市区町村ランキング', href: '/city' },
  { title: '処方薬ランキング', href: '/ndb' },
  { title: '特定健診データ', href: '/ndb/checkup' },
  { title: '病院ランキング', href: '/hospital' },
  { title: 'プライバシーポリシー', href: '/post/privacypolicy' },
];

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  );
}

const ResponsiveAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const Title_text = () => {
    return (
      <>
        <AnalyticsRoundedIcon
          sx={{ transform: 'translateY(5%)', verticalAlign: 'text-bottom', fill: '#007FFF' }}
          fontSize='large'
        />
        <Typography display='inline' sx={{ fontSize: '28px' }}>
          統計リアル
        </Typography>
      </>
    );
  };

  const BasicMenu = () => {
    return (
      <div>
        <Button style={{ color: 'black' }}>
          <Typography textAlign='center'>
            <MuiLink href={'/pyramid/JP'} sx={{ color: 'black' }}>
              人口ピラミッド
            </MuiLink>
          </Typography>
        </Button>
        <Button style={{ color: 'black' }}>
          <Typography textAlign='center'>
            <MuiLink href={'/world/'} sx={{ color: 'black' }}>
              世界
            </MuiLink>
          </Typography>
        </Button>
        <Button style={{ color: 'black' }}>
          <Typography textAlign='center'>
            <MuiLink href={'/prefecture/'} sx={{ color: 'black' }}>
              都道府県
            </MuiLink>
          </Typography>
        </Button>
        <Button style={{ color: 'black' }}>
          <Typography textAlign='center'>
            <MuiLink href={'/city/'} sx={{ color: 'black' }}>
              市区町村
            </MuiLink>
          </Typography>
        </Button>
        <Button style={{ color: 'black' }}>
          <Typography textAlign='center'>
            <MuiLink href={'/ndb/'} sx={{ color: 'black' }}>
              処方薬
            </MuiLink>
          </Typography>
        </Button>
        <Button style={{ color: 'black' }}>
          <Typography textAlign='center'>
            <MuiLink href={'/ndb/checkup/'} sx={{ color: 'black' }}>
              特定健診
            </MuiLink>
          </Typography>
        </Button>
      </div>
    );
  };

  const DpcMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const dpcLinks = [
      { href: '/hospital', label: '病院一覧' },
      { href: '/dpc', label: 'DPC病名一覧' },
      { href: '/dpc/alternative', label: '病気名一覧' },
      { href: '/patient/m05', label: '【診療科別】患者数ランキング' },
      { href: '/zaiin/m05', label: '【診療科別】在院日数ランキング' },
      { href: '/bed', label: '病床数ランキング' },
      { href: '/bed/ambulance', label: '救急車搬送ランキング' },
      { href: '/bed/emergent', label: '予定外・救急医療ランキング' },
      { href: '/bed/referrel', label: '他院紹介入院ランキング' },
      { href: '/bed/outcome', label: '退院時転帰の割合' },
      { href: '/bed/route', label: '入院経路の割合' },
      { href: '/bed/discharge', label: '退院先の割合' },
      { href: '/bed/readmission', label: '再入院の状況' },
    ];

    return (
      <div>
        <Button
          id='basic-button'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          style={{ color: 'black' }}
          endIcon={<KeyboardArrowDownIcon style={{ marginLeft: '-4px' }} />}
        >
          <Typography textAlign='center'>病院</Typography>
        </Button>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {dpcLinks.map((item, i) => (
            <MenuItem
              key={i}
              onClick={handleCloseNavMenu}
              sx={{ padding: '2px 8px', borderColor: 'lightgrey' }}
            >
              <Typography textAlign='center'>
                <MuiLink href={item.href} sx={{ color: 'black' }}>
                  {item.label}
                </MuiLink>
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  const [expanded, setExpanded] = React.useState('panel2');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const mobileMenuLinks = [
    { href: '/pyramid/JP', label: '人口ピラミッド' },
    { href: '/world/', label: '世界ランキング' },
    { href: '/prefecture/', label: '都道府県ランキング' },
    { href: '/city/', label: '市区町村ランキング' },
    { href: '/ndb/', label: '処方薬ランキング' },
    { href: '/ndb/checkup/', label: '特定健診データ' },
  ];

  const dpcMobileLinks = [
    { href: '/hospital', label: '病院一覧' },
    { href: '/dpc', label: 'DPC病名一覧' },
    { href: '/dpc/alternative', label: '病気名一覧' },
    { href: '/patient/m05', label: '【診療科別】患者数ランキング' },
    { href: '/zaiin/m05', label: '【診療科別】在院日数ランキング' },
    { href: '/bed', label: '病床数ランキング' },
    { href: '/bed/ambulance', label: '救急車搬送ランキング' },
    { href: '/bed/emergent', label: '予定外・救急医療ランキング' },
    { href: '/bed/referrel', label: '他院紹介入院ランキング' },
    { href: '/bed/outcome', label: '退院時転帰の割合' },
    { href: '/bed/route', label: '入院経路の割合' },
    { href: '/bed/discharge', label: '退院先の割合' },
    { href: '/bed/readmission', label: '再入院の状況' },
  ];

  return (
    <HideOnScroll {...props}>
      <AppBar
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#fcfcfc',
          width: { md: `calc(100% )` },
        }}
      >
        <Container maxWidth='xl'>
          <Toolbar disableGutters sx={{ p: '0' }}>
            <Typography
              fontWeight='bold'
              variant='h6'
              noWrap
              component='div'
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              <MuiLink href='/' underline='none' color='black'>
                {Title_text()}
              </MuiLink>
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='メニュー'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {mobileMenuLinks.map((item, i) => (
                  <MenuItem key={i} style={{ color: 'black' }}>
                    <Typography textAlign='center'>
                      <MuiLink href={item.href} sx={{ color: 'black' }}>
                        {item.label}
                      </MuiLink>
                    </Typography>
                  </MenuItem>
                ))}
                <Accordion
                  style={{ boxShadow: 'none' }}
                  expanded={expanded === 'panel2'}
                  onChange={handleChange('panel2')}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    style={{ maxHeight: '40px' }}
                    id='panel1a-header'
                  >
                    <Typography>病院実績ランキング</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ padding: '0px 25px' }}>
                    {dpcMobileLinks.map((item, i) => (
                      <MenuItem key={i} sx={{ padding: '6px 0px', minHeight: 'auto' }}>
                        <Typography textAlign='center'>
                          <MuiLink href={item.href} sx={{ color: 'black' }}>
                            {item.label}
                          </MuiLink>
                        </Typography>
                      </MenuItem>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </Menu>
            </Box>

            <Typography
              fontWeight='bold'
              color='black'
              variant='h6'
              noWrap
              component='div'
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              <MuiLink href='/' underline='none' color='black'>
                {Title_text()}
              </MuiLink>
            </Typography>
            <IconButton size='large' color='inherit'>
              <MenuIcon style={{ fill: '#fcfcfc' }} />
            </IconButton>
            {/*     PC view */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
              }}
              color='textPrimary'
            >
              <BasicMenu />
              <DpcMenu />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export function Layout({ children, ...props }) {
  return (
    <div {...props}>
      <Box sx={{ minHeight: '100vh', display: { md: 'flex' } }}>
        <ResponsiveAppBar />
        <Box component='main' sx={{ width: { md: `calc(100%)` } }}>
          <Toolbar />

          <Box p={{ xs: 0, md: 3 }} sx={{ minHeight: '100vh', paddingRight: { md: 0 } }}>
            {children}
          </Box>
          <Box
            bgcolor='white'
            color='text.secondary'
            sx={{
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              position: 'relative',
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
            <footer>
              <Container>
                <Box
                  pt={{ xs: 1 }}
                  textAlign='center'
                  display='flex'
                  flexWrap='wrap'
                  justifyContent='center'
                >
                  {footerLink.map((v, i) => (
                    <MuiLink
                      key={'l' + i}
                      underline='none'
                      color='rgba(0, 0, 0, 0.6)'
                      href={v.href}
                      style={{ margin: '0 10px', whiteSpace: 'nowrap' }}
                    >
                      {v.title}
                    </MuiLink>
                  ))}
                </Box>
                <Box textAlign='center' p={{ xs: 1 }}>
                  © 2022 統計リアル
                </Box>
              </Container>
            </footer>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
