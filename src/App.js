import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// 3D & HUD Persistent Shell Components
import CinematicCanvas from './components/3d/CinematicCanvas';
import WebGLFallback from './components/common/WebGLFallback';
import Navbar from './components/hud/Navbar';
import CustomCursor from './components/hud/CustomCursor';
import ViewportHUD from './components/hud/ViewportHUD';
import LoadingScreen from './components/common/LoadingScreen';
import AnimusPlexusVoid from './components/common/AnimusPlexusVoid';
import ScrollToTop from './components/common/ScrollToTop';
import CinematicFooter from './components/hud/CinematicFooter';
import soundEngine from './utils/SoundEngine';
import usePageMetadata from './utils/usePageMetadata';
import adminStore from './services/adminStore';

// Immediate Landing Page for Instant First Paint
import HomePage from './pages/HomePage';

// Data
import { PROJECTS } from './data/projects';

// Lazy-Loaded Secondary Pages for Lightweight Initial Bundle
const AboutPage = lazy(() => import('./pages/AboutPage'));
const WorkPage = lazy(() => import('./pages/WorkPage'));
const ProcessPage = lazy(() => import('./pages/ProcessPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminHome = lazy(() => import('./pages/AdminHome'));

// Lazy-Loaded Heavy Interactive Modals
const ProjectModal = lazy(() => import('./components/sections/ProjectModal'));
const ResumeModal = lazy(() => import('./components/sections/ResumeModal'));
const TheaterArchiveModal = lazy(() => import('./components/modals/TheaterArchiveModal'));

// Elegant Cinematic Suspense Fallback
const RouteLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 select-none" aria-busy="true">
    <div className="w-8 h-8 rounded-full border border-cyan-500/20 border-t-cyan-400 animate-spin" />
    <span className="font-mono text-[10px] tracking-widest text-cyan-400/80 uppercase">
      INITIALIZING SCENE...
    </span>
  </div>
);

/**
 * Shell layout wrapper for the cinematic experience.
 * Houses the 3D WebGL background canvas, ambient plexus void, HUD viewfinder,
 * persistent floating navbar, and global project/resume modals.
 */
function ExperienceShell({ isBackgroundSoundOn, onToggleBackgroundSound, onAdminDetected }) {
  const location = useLocation();
  const navigate = useNavigate();
  usePageMetadata();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isTheaterArchiveOpen, setIsTheaterArchiveOpen] = useState(false);
  const [isLetterbox, setIsLetterbox] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastNavScrollY = useRef(0);

  // Synchronized scroll direction handler for both Navbar and ViewportHUD
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 15) {
        setIsNavbarVisible(true);
        lastNavScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastNavScrollY.current;

      if (Math.abs(delta) > 6) {
        if (delta > 0) {
          // Scrolling DOWN -> Slide navbar upwards / move HUD top bar to top
          setIsNavbarVisible(false);
        } else {
          // Scrolling UP -> Slide navbar down / restore HUD top bar
          setIsNavbarVisible(true);
        }
        lastNavScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsNavbarVisible(true);
    lastNavScrollY.current = window.scrollY;
  }, [location.pathname]);

  // Redirect to hero page ('/') on initial site visit or browser reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    const scrollToHero = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    scrollToHero();
    requestAnimationFrame(scrollToHero);

    if (location.pathname !== '/' && !location.pathname.startsWith('/admin') && !adminStore.isAuthenticated()) {
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Proactively detect admin session or admin route to dismiss loaders
  useEffect(() => {
    if (location.pathname.startsWith('/admin') || adminStore.isAuthenticated()) {
      if (onAdminDetected) onAdminDetected();
    }
  }, [location.pathname, onAdminDetected]);

  useEffect(() => {
    soundEngine.enableEffects();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Map route to active cinematic scene
  const activeScene = (() => {
    if (location.pathname === '/about') return 'about';
    if (location.pathname === '/work') return 'work';
    if (location.pathname === '/process') return 'process';
    if (location.pathname === '/skills') return 'skills';
    if (location.pathname === '/resume') return 'skills';
    if (location.pathname === '/contact') return 'contact';
    return 'home';
  })();

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Pause heavy canvas rendering during modal inspection, document viewing, or admin control room
  const isCanvasPaused = Boolean(
    selectedProject ||
    isResumeOpen ||
    isTheaterArchiveOpen ||
    location.pathname === '/resume' ||
    isAdminRoute
  );

  return (
    <WebGLFallback>
      <div className="app-shell relative min-h-screen bg-[#050608] text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
        {/* Scroll Position Reset On Route Change */}
        <ScrollToTop />

        {/* 35mm Celluloid Film Grain Texture */}
        {!isAdminRoute && <div className="film-grain" />}

        {/* 3D WebGL Digital Film Environment Canvas (Auto-paused when modal/resume/admin active) */}
        {!isAdminRoute && (
          <CinematicCanvas activeSection={activeScene} isMobile={isMobile} isPaused={isCanvasPaused} />
        )}

        {/* Assassin's Creed Animus Point-Cloud Web (Auto-paused when modal/resume/admin active) */}
        {!isAdminRoute && (
          <AnimusPlexusVoid className="animus-plexus-void--fixed" opacity={0.48} isPaused={isCanvasPaused} />
        )}

        {/* Viewfinder Viewport HUD (REC status, SMPTE timecode, Aspect toggle) - Hidden on official resume and admin */}
        {!isAdminRoute && location.pathname !== '/resume' && !isResumeOpen && (
          <ViewportHUD
            activeSection={activeScene}
            isLetterbox={isLetterbox}
            onToggleLetterbox={() => setIsLetterbox(!isLetterbox)}
            isNavbarVisible={isNavbarVisible}
          />
        )}

        {/* Floating HUD Navbar - Hidden on admin control room */}
        {!isAdminRoute && (
          <Navbar
            onOpenResume={() => setIsResumeOpen(true)}
            isBackgroundSoundOn={isBackgroundSoundOn}
            onToggleBackgroundSound={onToggleBackgroundSound}
            isVisible={isNavbarVisible}
          />
        )}

        {/* Dynamic Route Pages with Code-Splitting Suspense */}
        <main className="relative z-10">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onSelectProject={(proj) => setSelectedProject(proj)}
                    onOpenResume={() => setIsResumeOpen(true)}
                  />
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/work"
                element={
                  <WorkPage
                    onSelectProject={(proj) => setSelectedProject(proj)}
                    onOpenTheaterArchive={() => setIsTheaterArchiveOpen(true)}
                  />
                }
              />
              <Route path="/process" element={<ProcessPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route
                path="/contact"
                element={<ContactPage onOpenResume={() => setIsResumeOpen(true)} />}
              />
              <Route
                path="/resume"
                element={<ResumePage onOpenResume={() => setIsResumeOpen(true)} />}
              />
              <Route path="/admin" element={<Admin />} />
              <Route path="/adminhome" element={<AdminHome />} />
              {/* Fallback to Home */}
              <Route
                path="*"
                element={
                  <HomePage
                    onSelectProject={(proj) => setSelectedProject(proj)}
                    onOpenResume={() => setIsResumeOpen(true)}
                  />
                }
              />
            </Routes>
          </Suspense>
        </main>

        {/* Universal Cinematic Production Footer - Hidden on admin control room */}
        {!isAdminRoute && <CinematicFooter onOpenResume={() => setIsResumeOpen(true)} />}

        {/* Fullscreen Cinema Theater Modal (Lazy Loaded) */}
        {selectedProject && (
          <Suspense fallback={null}>
            <ProjectModal
              project={selectedProject}
              allProjects={PROJECTS}
              onClose={() => setSelectedProject(null)}
              onSelectNext={(nextProj) => setSelectedProject(nextProj)}
            />
          </Suspense>
        )}

        {/* Downloadable Resume Modal (Lazy Loaded) */}
        <Suspense fallback={null}>
          <ResumeModal
            isOpen={isResumeOpen}
            onClose={() => setIsResumeOpen(false)}
          />
        </Suspense>

        {/* Fullscreen Theater Archive Vault Modal (Lazy Loaded) */}
        <Suspense fallback={null}>
          <TheaterArchiveModal
            isOpen={isTheaterArchiveOpen}
            onClose={() => setIsTheaterArchiveOpen(false)}
            onSelectProject={(project) => setSelectedProject(project)}
          />
        </Suspense>
      </div>
    </WebGLFallback>
  );
}

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname || '';
      return adminStore.isAuthenticated() || pathname.startsWith('/admin');
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname || '';
      // Only skip loading screen when directly visiting the /admin route
      if (pathname.startsWith('/admin')) {
        return false;
      }
    }
    return true;
  });

  const [isBackgroundSoundOn, setIsBackgroundSoundOn] = useState(false);

  useEffect(() => {
    const checkAdminState = () => {
      const isAuth = adminStore.isAuthenticated();
      const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      if (isAuth || isAdminPath) {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
      }
    };

    checkAdminState();

    const handleAuthChange = (e) => {
      if (e.detail?.authenticated) {
        setIsAdminLoggedIn(true);
      } else {
        checkAdminState();
      }
    };

    window.addEventListener('control-room-auth-changed', handleAuthChange);
    window.addEventListener('storage', checkAdminState);
    window.addEventListener('popstate', checkAdminState);
    return () => {
      window.removeEventListener('control-room-auth-changed', handleAuthChange);
      window.removeEventListener('storage', checkAdminState);
      window.removeEventListener('popstate', checkAdminState);
    };
  }, []);

  useEffect(() => {
    soundEngine.initContext();
    return () => {
      soundEngine.stopSoundtrack();
    };
  }, []);

  const startReckoningTrack = () => {
    if (!isAdminLoggedIn) {
      soundEngine.playTrack('reckoning');
      setIsBackgroundSoundOn(true);
    }
  };

  const handleComplete = useCallback(() => {
    setIsLoading(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleStartSiteTransition = useCallback(() => {
    if (!isAdminLoggedIn) {
      soundEngine.stopTrack('reckoning');
      soundEngine.playTrack('melancholy');
      soundEngine.playTrack('horizon');
      setIsBackgroundSoundOn(true);
    }
  }, [isAdminLoggedIn]);

  const toggleBackgroundSound = () => {
    const newState = soundEngine.toggleSoundtrack();
    setIsBackgroundSoundOn(newState);
  };

  return (
    <>
      <CustomCursor />
      {/* 35mm Celluloid Film Grain Texture Overlay */}
      <div className="film-grain" aria-hidden="true" />
      <Router>
        <ExperienceShell
          isBackgroundSoundOn={isBackgroundSoundOn}
          onToggleBackgroundSound={toggleBackgroundSound}
          onAdminDetected={() => {
            setIsAdminLoggedIn(true);
            setIsLoading(false);
          }}
        />
        <Analytics />
        <SpeedInsights />
      </Router>
      {isLoading && (
        <LoadingScreen
          onComplete={handleComplete}
          onEnableSound={startReckoningTrack}
          onStartSiteTransition={handleStartSiteTransition}
        />
      )}
    </>
  );
}

export default App;
