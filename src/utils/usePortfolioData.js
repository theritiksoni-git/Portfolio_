import { useState, useEffect } from 'react';
import adminStore from '../services/adminStore';

/**
 * Custom React hook that subscribes to all reactive changes from the Admin Control Room.
 * Automatically synchronizes state in real time across the website, including multi-tab updates via storage events.
 */
export default function usePortfolioData() {
  const [data, setData] = useState(() => adminStore.getData());

  useEffect(() => {
    const handleUpdate = (e) => {
      setData(e.detail || adminStore.getData());
    };

    window.addEventListener('control-room-updated', handleUpdate);
    return () => {
      window.removeEventListener('control-room-updated', handleUpdate);
    };
  }, []);

  const allProjects = data?.projects || [];
  // Security & Publishing gate: Public visitors strictly see Published or Featured projects.
  // Any Google Drive items in staging or admin drafts remain completely hidden.
  const publishedProjects = allProjects.filter(
    (p) => p.status === 'Published' || p.status === 'Featured' || !p.status
  );

  return {
    data,
    projects: publishedProjects, // Public components receive ONLY published projects!
    allProjects,                // Unfiltered projects catalog for admin/inspectors
    stagedProjects: data?.stagedProjects || [], // Inbound Google Drive staging queue
    experience: data?.experience || [],
    skills: data?.skills || [],
    services: data?.services || [],
    clients: data?.clients || [],
    socialLinks: data?.socialLinks || [],
    availability: data?.availability || {},
    settings: data?.settings || {},
    overview: data?.overview || {},
    media: data?.media || [],
    team: data?.team || [],
  };
}
