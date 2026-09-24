import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import adminStore from '../services/adminStore';

const BASE_URL = 'https://www.ritiksoni.in';

const PAGE_METADATA = {
  '/': {
    title: 'Ritik Soni | Commercial Film Director, Video Production Executive & Lead Editor',
    description: 'Official portfolio of Ritik Soni — Commercial Film Director, Video Production Executive, and Lead Video Editor. Crafting high-retention brand films, viral reels, and corporate documentaries generating 50M+ views for Red Bull, Reliance, AdenTech.',
    name: 'Home',
  },
  '/about': {
    title: 'About Ritik Soni | Biography, Directorial Journey & Storytelling Philosophy',
    description: 'Explore Ritik Soni\'s background, 5+ year career timeline with premier global brands (Red Bull, Reliance, AdenTech), and cinematic directing philosophy.',
    name: 'About',
  },
  '/work': {
    title: 'Directed Works & Commercial Repertoire | Ritik Soni',
    description: 'Complete commercial portfolio featuring commercial cuts, tech product films, music videos, 9:16 viral short-form retention edits, and enterprise documentaries.',
    name: 'Work',
  },
  '/process': {
    title: 'How I See a Story | 6-Stage Filmmaking Framework - Ritik Soni',
    description: 'From initial hook psychology to theatrical master grading: inspect Ritik Soni\'s 6-stage frame-accurate commercial filmmaking methodology.',
    name: 'Process',
  },
  '/skills': {
    title: 'Technical Console & NLE Suite | Ritik Soni - Premiere, After Effects, DaVinci',
    description: 'Frame-accurate editing suite across Adobe Premiere Pro, After Effects, DaVinci Resolve Studio (ACES/Rec.709), and broadcast sound engineering.',
    name: 'Skills',
  },
  '/contact': {
    title: 'Initiate Contact & Commission Terminal | Ritik Soni',
    description: 'Direct priority booking terminal for commercial directing commissions, post-production lead retainers, and full-time video executive inquiries.',
    name: 'Contact',
  },
  '/resume': {
    title: 'Executive Resume & ATS Curriculum Vitae | Ritik Soni - Video Production Executive',
    description: 'Verified CV, career timeline, brand impact metrics (50M+ views), and technical competencies for Ritik Soni — Video Production Executive & Lead Editor.',
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
    if (pathname === '/' && settings?.studioTitle) {
      title = `${settings.studioTitle} | Film Director, Video Editor & SMM Lead`;
    }
    document.title = title;

    const description = (pathname === '/' && settings?.metaDescription)
      ? settings.metaDescription
      : meta.description;

    const pageUrl = `${BASE_URL}${pathname === '/' ? '' : pathname}`;

    // Canonical link
    setOrCreateCanonical(pageUrl);

    // Standard description
    setOrCreateMeta('description', 'name', description);

    // Open Graph
    setOrCreateMeta('og:title', 'property', title);
    setOrCreateMeta('og:description', 'property', description);
    setOrCreateMeta('og:url', 'property', pageUrl);

    // Twitter Card
    setOrCreateMeta('twitter:title', 'property', title);
    setOrCreateMeta('twitter:description', 'property', description);
    setOrCreateMeta('twitter:url', 'property', pageUrl);

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
