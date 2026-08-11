'use client';

import { NextStudio } from 'next-sanity/studio';
import { useLenis } from 'lenis/react';
import { useEffect } from 'react';
import config from '../../../../sanity.config';

export default function StudioPage() {
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.destroy();
    }
  }, [lenis]);

  return <NextStudio config={config} />;
}
