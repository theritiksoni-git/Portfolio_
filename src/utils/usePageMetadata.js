import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_METADATA = {
  '/': {
    title: 'Ritik Soni | Film Director, Video Editor & SMM Lead',
    description: 'High-impact commercial films, viral retention edits, and full-funnel social media campaigns directed by Ritik Soni.',
  },
  '/about': {
    title: 'About Ritik Soni | Biography, Directorial Journey & Philosophy',
    description: 'Explore Ritik Soni\'s background, career experience timeline with premier brands, and artistic philosophy.',
  },
  '/work': {
    title: 'Directed Works & Cinema Repertoire | Ritik Soni',
    description: 'Complete cinematic portfolio featuring commercial films, music videos, social media retention edits, and brand stories.',
  },
  '/process': {
    title: 'How I See a Story | 6-Stage Filmmaking Framework - Ritik Soni',
    description: 'From initial hook psychology to theatrical master grade: inspect the 6-stage filmmaking methodology.',
  },
  '/skills': {
    title: 'Technical Console & NLE Suite | Ritik Soni',
    description: 'Frame-accurate mastery across Premiere Pro, After Effects, DaVinci Resolve, and post-production hardware.',
  },
  '/contact': {
    title: 'Initiate Contact & Booking Terminal | Ritik Soni',
    description: 'Direct priority terminal for commercial commissions, full-time video executive inquiries, and collaborative projects.',
  },
  '/resume': {
    title: 'Executive Resume & ATS Curriculum Vitae | Ritik Soni',
    description: 'Executive CV, career timeline, brand impact metrics, and technical competencies for Ritik Soni - Video Production Executive & Editor.',
  },
};

export default function usePageMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = PAGE_METADATA[pathname] || PAGE_METADATA['/'];
    document.title = meta.title;

    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.name = 'description';
      document.head.appendChild(descEl);
    }
    descEl.setAttribute('content', meta.description);
  }, [pathname]);
}
