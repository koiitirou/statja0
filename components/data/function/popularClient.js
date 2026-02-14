'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { server } from '@/components/config';
import { json } from 'd3-fetch';

const PopularClient = ({ path }) => {
  const [popular, setPopular] = useState();
  useEffect(() => {
    json(`${server}/gap/${path}.json`)
      .then((collection) => {
        setPopular(collection);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }, []);
  return (
    <>
      {popular &&
        popular.map((v, i) => {
          return (
            <Link
              key={'n' + i}
              href={v.p}
              prefetch={false}
              style={{
                margin: '0 10px',
                textDecoration: 'none',
                color: 'blue',
              }}
            >
              {v.t}
            </Link>
          );
        })}
    </>
  );
};

export default PopularClient;
