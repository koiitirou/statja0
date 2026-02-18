'use client';
import { Box, Typography } from '@mui/material';
import MuiLink from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/**
 * Breadcrumb component with JSON-LD structured data.
 * items: [{ name: 'トップ', href: '/' }, { name: 'DPC', href: '/dpc' }, { name: '現在のページ' }]
 * Last item has no href (current page).
 */
export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `https://statja.com${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Box
        component='nav'
        aria-label='パンくずリスト'
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          py: 1,
          px: { xs: 1, md: 0 },
          mb: 1,
          fontSize: '13px',
        }}
      >
        {items.map((item, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <NavigateNextIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.4)', mx: 0.3 }} />
            )}
            {item.href ? (
              <MuiLink
                href={item.href}
                underline='hover'
                sx={{ fontSize: '13px', whiteSpace: 'nowrap', color: '#1976d2' }}
              >
                {item.name}
              </MuiLink>
            ) : (
              <Typography
                component='span'
                sx={{ fontSize: '13px', color: 'rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}
              >
                {item.name}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </>
  );
}
