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

  return {
    data,
    projects: data?.projects || [],
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
