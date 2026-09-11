import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
function ExperienceShell({ isBackgroundSoundOn, onToggleBackgroundSound }) {
  const location = useLocation();
  usePageMetadata();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isTheaterArchiveOpen, setIsTheaterArchiveOpen] = useState(false);
  const [isLetterbox, setIsLetterbox] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Pause heavy canvas rendering during modal inspection or document viewing
  const isCanvasPaused = Boolean(
    selectedProject ||
    isResumeOpen ||
    isTheaterArchiveOpen ||
    location.pathname === '/resume'
  );

  return (
    <WebGLFallback>
      <div className="app-shell relative min-h-screen bg-[#050608] text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
        {/* Scroll Position Reset On Route Change */}
        <ScrollToTop />

        {/* 35mm Celluloid Film Grain Texture */}
        <div className="film-grain" />

        {/* 3D WebGL Digital Film Environment Canvas (Auto-paused when modal/resume active) */}
        <CinematicCanvas activeSection={activeScene} isMobile={isMobile} isPaused={isCanvasPaused} />

        {/* Assassin's Creed Animus Point-Cloud Web (Auto-paused when modal/resume active) */}
        <AnimusPlexusVoid className="animus-plexus-void--fixed" opacity={0.48} isPaused={isCanvasPaused} />

        {/* Viewfinder Viewport HUD (REC status, SMPTE timecode, Aspect toggle) - Hidden on official resume */}
        {location.pathname !== '/resume' && !isResumeOpen && (
          <ViewportHUD
            activeSection={activeScene}
            isLetterbox={isLetterbox}
            onToggleLetterbox={() => setIsLetterbox(!isLetterbox)}
          />
        )}

        {/* Floating HUD Navbar */}
        <Navbar
          onOpenResume={() => setIsResumeOpen(true)}
          isBackgroundSoundOn={isBackgroundSoundOn}
          onToggleBackgroundSound={onToggleBackgroundSound}
        />

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

        {/* Universal Cinematic Production Footer */}
        <CinematicFooter onOpenResume={() => setIsResumeOpen(true)} />

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
  const [isLoading, setIsLoading] = useState(true);
  const [isBackgroundSoundOn, setIsBackgroundSoundOn] = useState(false);

  useEffect(() => {
    soundEngine.initContext();
    return () => {
      soundEngine.stopSoundtrack();
    };
  }, []);

  const startReckoningTrack = () => {
    soundEngine.playTrack('reckoning');
    setIsBackgroundSoundOn(true);
  };

  const handleComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleStartSiteTransition = useCallback(() => {
    soundEngine.stopTrack('reckoning');
    soundEngine.playTrack('melancholy');
    soundEngine.playTrack('horizon');
    setIsBackgroundSoundOn(true);
  }, []);

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
        />
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
