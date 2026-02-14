'use client';
import Link from 'next/link';
const Popular = ({ popular }) => {
  return (
    <>
      {popular.map((v, i) => {
        return (
          <Link key={'n' + i} href={v.p} prefetch={false}>
            <a
              style={{
                margin: '0 10px',
                // whiteSpace: 'nowrap',
                textDecoration: 'none',
                color: 'blue',
              }}
            >
              {v.t}
            </a>
          </Link>
        );
      })}
    </>
  );
};

export default Popular;
