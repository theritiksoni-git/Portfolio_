import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import adminStore from '../services/adminStore';

const BASE_URL = 'https://www.ritiksoni.in';

const PAGE_METADATA = {
  '/': {
    title: 'Ritik Soni | Video Editor & Filmmaker in Pune, India',
    description: 'Ritik Soni is a Pune-based video editor and filmmaker creating cinematic brand films, UGC and high-retention short-form reels for Indian brands.',
    name: 'Home',
  },
  '/about': {
    title: 'About Ritik Soni | Video Editor & Filmmaker in Pune',
    description: 'Learn about Ritik Soni, a Pune-based video editor, filmmaker, and UGC content creator delivering high-retention visual stories.',
    name: 'About',
  },
  '/work': {
    title: 'Portfolio & Commercial Projects | Ritik Soni Pune',
    description: 'Explore video editing and directorial projects by Ritik Soni in Pune, featuring commercial brand films, social reels, and product videos.',
    name: 'Work',
  },
  '/process': {
    title: 'Filmmaking & Video Editing Workflow | Ritik Soni',
    description: "Discover Ritik Soni's 6-stage video editing and directing workflow, from hook psychology to sound design and master color grading.",
    name: 'Process',
  },
  '/skills': {
    title: 'Editing Suite & NLE Skills | Ritik Soni Pune',
    description: 'Technical proficiency in Adobe Premiere Pro, After Effects, and DaVinci Resolve Studio for commercial video editing and color grading.',
    name: 'Skills',
  },
  '/contact': {
    title: 'Hire Ritik Soni | Video Editor & Filmmaker in Pune',
    description: 'Hire Ritik Soni for commercial video editing, UGC campaigns, or directorial commissions in Pune and across India. Get in touch today.',
    name: 'Contact',
  },
  '/resume': {
    title: 'Resume & Experience | Ritik Soni Video Editor Pune',
    description: "View Ritik Soni's professional background, video editing credentials, client metrics, and commercial production experience.",
    name: 'Resume',
  },
};

function setOrCreateMeta(nameOrProp, attrName, value) {
  let el = document.querySelector(`meta[${attrName}="${nameOrProp}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, nameOrProp);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setOrCreateCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

export default function usePageMetadata() {
  const { pathname } = useLocation();
  const [settings, setSettings] = useState(() => adminStore.getModule('settings'));

  useEffect(() => {
    const handleUpdate = () => setSettings(adminStore.getModule('settings'));
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  useEffect(() => {
    const meta = PAGE_METADATA[pathname] || PAGE_METADATA['/'];
    let title = meta.title;
    if (pathname === '/' && settings?.studioTitle && settings.studioTitle !== 'Ritik Soni' && settings.studioTitle !== 'Ritik Soni Creative Studios') {
      title = `${settings.studioTitle} | Video Editor & Filmmaker in Pune, India`;
    }
    document.title = title;

    const description = (pathname === '/' && settings?.metaDescription)
      ? settings.metaDescription
      : meta.description;

    const pageUrl = `${BASE_URL}${pathname === '/' ? '' : pathname}`;
    const ogImage = `${BASE_URL}/img/og-card.png`;

    // Canonical link
    setOrCreateCanonical(pageUrl);

    // Standard description
    setOrCreateMeta('description', 'name', description);

    // Open Graph
    setOrCreateMeta('og:title', 'property', title);
    setOrCreateMeta('og:description', 'property', description);
    setOrCreateMeta('og:url', 'property', pageUrl);
    setOrCreateMeta('og:image', 'property', ogImage);
    setOrCreateMeta('og:image:width', 'property', '1200');
    setOrCreateMeta('og:image:height', 'property', '630');
    setOrCreateMeta('og:image:alt', 'property', 'Ritik Soni, video editor and filmmaker in Pune');

    // Twitter Card
    setOrCreateMeta('twitter:card', 'property', 'summary_large_image');
    setOrCreateMeta('twitter:title', 'property', title);
    setOrCreateMeta('twitter:description', 'property', description);
    setOrCreateMeta('twitter:url', 'property', pageUrl);
    setOrCreateMeta('twitter:image', 'property', ogImage);

    // Dynamic Breadcrumb Schema
    if (pathname !== '/') {
      let script = document.querySelector('script[data-schema="breadcrumb"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-schema', 'breadcrumb');
        document.head.appendChild(script);
      }
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: meta.name || 'Page',
            item: pageUrl,
          },
        ],
      };
      script.textContent = JSON.stringify(breadcrumbData);
    } else {
      const script = document.querySelector('script[data-schema="breadcrumb"]');
      if (script) script.remove();
    }
  }, [pathname, settings]);
}
