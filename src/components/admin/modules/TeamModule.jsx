import React, { useState, useEffect, useRef } from 'react';
import adminStore, { CAPABILITIES } from '../../../services/adminStore';
import { 
  Users, 
  Shield, 
  ShieldCheck,
  Plus, 
  Edit3, 
  Trash2, 
  Mail,
  Key,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  Film,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  Upload,
  Camera
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';
import { showAdminToast, showAdminConfirm } from '../common/AdminPopupMessage';

// Capability Icon Helper
const CAPABILITY_ICONS = {
  PROJECTS: Film,
  MEDIA: ImageIcon,
  LEADS: MessageSquare,
  ANALYTICS: BarChart3,
  CONTENT: FileText,
  SETTINGS: Settings,
  TEAM: Users,
};

// Resilient User Avatar with Initial Fallback
const UserAvatar = ({ src, name, className = "w-12 h-12 rounded-xl" }) => {
  const [hasError, setHasError] = useState(false);
  
  if (!src || hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-cyan-950/80 to-zinc-900 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-syne font-bold text-base select-none shrink-0 shadow-sm`}>
        {name ? name.charAt(0).toUpperCase() : 'C'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className={`${className} object-cover border border-white/10 shrink-0 shadow-sm`}
    />
  );
};

export default function TeamModule() {
  const [activeTab, setActiveTab] = useState('adminUsers'); // 'adminUsers' | 'crew'
  const [adminUsers, setAdminUsers] = useState(adminStore.getAdminUsers());
  const [team, setTeam] = useState(adminStore.getModule('team'));
  const [currentUser, setCurrentUser] = useState(adminStore.getCurrentUser());

  // PIN Privacy States
  const [showOwnerPin, setShowOwnerPin] = useState(false);
  const [revealedPins, setRevealedPins] = useState({});
  const [showModalPin, setShowModalPin] = useState(false);

  // Photo Upload Refs & State
  const userFileInputRef = useRef(null);
  const crewFileInputRef = useRef(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  // Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const [editingCrewMember, setEditingCrewMember] = useState(null);

  // Optimized Client-Side Image Processor (Resizes to crisp 400x400 JPEG Data URL)
  const processImageFile = (file, onSuccess) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showAdminToast({
        type: 'error',
        title: 'INVALID FILE FORMAT',
        message: 'Please choose an image file (PNG, JPG, WebP).',
        tag: 'FILE ERROR',
      });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showAdminToast({
        type: 'warning',
        title: 'IMAGE TOO LARGE',
        message: 'Selected image exceeds 15MB. Please choose a smaller picture.',
        tag: 'SIZE LIMIT',
      });
      return;
    }

    setIsProcessingPhoto(true);
    sound.playClick();

    const reader = new FileReader();
    reader.onerror = () => {
      setIsProcessingPhoto(false);
      showAdminToast({
        type: 'error',
        title: 'READ ERROR',
        message: 'Failed to read image file from device.',
        tag: 'UPLOAD FAILED',
      });
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        setIsProcessingPhoto(false);
        showAdminToast({
          type: 'error',
          title: 'DECODE ERROR',
          message: 'Unable to decode image file.',
          tag: 'CORRUPTED FILE',
        });
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 400; // 400x400 max gives retina crispness and keeps storage lightweight
          let w = img.width;
          let h = img.height;

          if (w > h) {
            if (w > MAX_DIM) {
              h = Math.round((h * MAX_DIM) / w);
              w = MAX_DIM;
            }
          } else {
            if (h > MAX_DIM) {
              w = Math.round((w * MAX_DIM) / h);
              h = MAX_DIM;
            }
          }

          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          onSuccess(optimizedDataUrl);
          setIsProcessingPhoto(false);

          showAdminToast({
            type: 'success',
            title: 'PHOTO UPLOADED',
            message: 'Profile picture attached successfully.',
            tag: 'PICTURE READY',
          });
        } catch (err) {
          setIsProcessingPhoto(false);
          onSuccess(event.target.result);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handleUpdate = () => {
      setAdminUsers(adminStore.getAdminUsers());
      setTeam(adminStore.getModule('team'));
      setCurrentUser(adminStore.getCurrentUser());
    };
    const handleUserChange = (e) => {
      setCurrentUser(e.detail || adminStore.getCurrentUser());
      setAdminUsers(adminStore.getAdminUsers());
    };

    window.addEventListener('control-room-updated', handleUpdate);
    window.addEventListener('control-room-user-changed', handleUserChange);
    return () => {
      window.removeEventListener('control-room-updated', handleUpdate);
      window.removeEventListener('control-room-user-changed', handleUserChange);
    };
  }, []);

  // --- Admin Users Handlers ---
  const handleOpenInviteUser = () => {
    sound.playClick();
    const randomPin = String(Math.floor(1000 + Math.random() * 9000));
    setEditingUser({
      id: '',
      name: '',
      email: '',
      title: 'Post-Production Collaborator',
      passcode: randomPin,
      role: 'collaborator',
      capabilities: ['PROJECTS', 'MEDIA'],
      avatar: '',
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user) => {
    sound.playClick();
    setEditingUser({ 
      ...user, 
      capabilities: user.role === 'owner' ? CAPABILITIES.map(c => c.key) : [...(user.capabilities || [])] 
    });
    setIsUserModalOpen(true);
  };

  const handleToggleCapability = (capKey) => {
    if (!editingUser || editingUser.role === 'owner') return;
    sound.playClick();
    const current = editingUser.capabilities || [];
    const exists = current.includes(capKey);
    const updated = exists 
      ? current.filter(k => k !== capKey) 
      : [...current, capKey];
    setEditingUser({ ...editingUser, capabilities: updated });
  };

  const handleSelectAllCapabilities = () => {
    sound.playClick();
    setEditingUser({ ...editingUser, capabilities: CAPABILITIES.map(c => c.key) });
  };

  const handleClearCapabilities = () => {
    sound.playClick();
    setEditingUser({ ...editingUser, capabilities: [] });
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    sound.playClick();
    if (editingUser.id) {
      adminStore.updateAdminUser(editingUser.id, editingUser);
    } else {
      adminStore.addAdminUser(editingUser);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id, name, role) => {
    sound.playClick();
    if (role === 'owner') {
      showAdminToast({
        type: 'warning',
        title: 'SECURITY POLICY RESTRICTION',
        message: 'Studio Owner Ritik Soni holds permanent master sovereignty and cannot be revoked.',
        tag: 'OWNER ROOT IMMUNITY',
      });
      return;
    }
    showAdminConfirm({
      title: 'Revoke Collaborator Access?',
      message: `Are you sure you want to revoke all capability permissions and remove collaborator "${name}" from the studio dashboard?`,
      confirmText: 'REVOKE ACCESS',
      cancelText: 'CANCEL (ESC)',
      type: 'danger',
      onConfirm: () => {
        adminStore.deleteAdminUser(id);
        showAdminToast({
          type: 'error',
          title: 'ACCESS REVOKED',
          message: `Collaborator "${name}" removed from access directory.`,
          tag: 'ACCESS TERMINATED',
        });
      },
    });
  };

  const handleSwitchSession = (user) => {
    sound.playLensClick();
    adminStore.switchUser(user.id);
  };

  // --- Production Crew Handlers ---
  const handleOpenAddCrew = () => {
    sound.playClick();
    setEditingCrewMember({
      id: '',
      name: '',
      role: 'Director of Photography / Camera Operator',
      type: 'Camera Department',
      email: '',
      status: 'Available On Call',
      avatar: '',
      assignedProjectsCount: 1,
      skills: ['Camera Lighting', 'Sony FX3/FX6', 'Cinematography'],
    });
    setIsCrewModalOpen(true);
  };

  const handleOpenEditCrew = (m) => {
    sound.playClick();
    setEditingCrewMember({ ...m });
    setIsCrewModalOpen(true);
  };

  const handleSaveCrew = (e) => {
    e.preventDefault();
    sound.playClick();
    if (editingCrewMember.id) {
      adminStore.updateTeamMember(editingCrewMember.id, editingCrewMember);
    } else {
      adminStore.addTeamMember(editingCrewMember);
    }
    setIsCrewModalOpen(false);
    setEditingCrewMember(null);
  };

  const handleDeleteCrew = (id, name) => {
    sound.playClick();
    showAdminConfirm({
      title: 'Delete Crew Member?',
      message: `Are you sure you want to remove "${name}" from the production crew directory?`,
      confirmText: 'DELETE CREW MEMBER',
      cancelText: 'CANCEL (ESC)',
      type: 'danger',
      onConfirm: () => {
        adminStore.deleteTeamMember(id);
        showAdminToast({
          type: 'error',
          title: 'CREW MEMBER REMOVED',
          message: `"${name}" removed from production roster.`,
          tag: 'ROSTER UPDATED',
        });
      },
    });
  };

  const ownerUser = adminUsers.find(u => u.role === 'owner') || adminUsers[0];
  const collaboratorUsers = adminUsers.filter(u => u.role !== 'owner');

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold tracking-widest uppercase">
              {'ACCESS & CREW REPOSITORIES'}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {adminUsers.length} ADMIN USERS // {team.length} PRODUCTION CREW
            </span>
          </div>
          <h2 className="font-syne text-2xl font-bold text-white mt-1">
            Access Control & Production Network
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5 max-w-2xl">
            Configure capability-based permissions for invited collaborators or manage the camera, sound, and VFX crew roster.
          </p>
        </div>

        {/* Tab Switcher & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="flex rounded-xl bg-zinc-900/90 p-1 border border-white/10">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('adminUsers');
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all flex items-center gap-1.5 ${
                activeTab === 'adminUsers'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Users ({adminUsers.length})</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('crew');
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all flex items-center gap-1.5 ${
                activeTab === 'crew'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Production Crew ({team.length})</span>
            </button>
          </div>

          {activeTab === 'adminUsers' ? (
            <button
              onClick={handleOpenInviteUser}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Collaborator</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddCrew}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Crew Member</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ADMIN USERS & CAPABILITY PERMISSIONS */}
      {/* ========================================================================= */}
      {activeTab === 'adminUsers' && (
        <div className="space-y-6">
          {/* Security Banner / Capability Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Granular Capability-Based Security Model
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-950/80 border border-emerald-500/40 font-mono text-[9px] text-emerald-400 font-bold uppercase">
                    ACTIVE
                  </span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed max-w-3xl">
                  Collaborators receive fine-grained permissions instead of blanket access. Studio Owner <strong>Ritik</strong> holds immutable unrestricted access across all 7 capabilities.
                </p>
              </div>
            </div>

            {/* Current Active Session Indicator */}
            {currentUser && (
              <div className="px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-white/10 flex items-center gap-2 shrink-0 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-400">ACTIVE SESSION:</span>
                <span className="text-white font-bold">{currentUser.name}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                  currentUser.role === 'owner' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>

          {/* Section: STUDIO OWNER */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Studio Owner // Superadmin</span>
            </div>

            {ownerUser && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-amber-950/20 border-2 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="relative">
                    <UserAvatar
                      src={ownerUser.avatar}
                      name={ownerUser.name}
                      className="w-16 h-16 rounded-2xl border-2 border-amber-400/60 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-mono text-[9px] font-extrabold uppercase shadow">
                      OWNER
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-syne text-xl font-bold text-white tracking-wide">
                        {ownerUser.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-[10px] font-bold uppercase">
                        {'★ UNRESTRICTED FULL ACCESS'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono flex-wrap">
                      <span className="text-zinc-300">{ownerUser.title}</span>
                      <span>•</span>
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-amber-400" />
                        {ownerUser.email}
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Key className="w-3 h-3 text-amber-400" />
                        <span>PIN:</span>
                        <span className="text-zinc-300 font-bold tracking-widest font-mono">
                          {showOwnerPin ? (ownerUser.passcode || '2026 (SHA-256 Verified)') : '••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setShowOwnerPin(!showOwnerPin);
                          }}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-amber-300 transition-colors focus:outline-none"
                          title={showOwnerPin ? "Hide PIN" : "Reveal PIN"}
                        >
                          {showOwnerPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capabilities matrix for Owner */}
                <div className="space-y-2 lg:max-w-md">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>CAPABILITIES (ALL 7 ACTIVE)</span>
                    <span className="text-amber-400 font-bold">100% UNRESTRICTED</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CAPABILITIES.map((cap) => {
                      const Icon = CAPABILITY_ICONS[cap.key] || Shield;
                      return (
                        <span
                          key={cap.key}
                          className="px-2 py-1 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-200 font-mono text-[10px] font-bold flex items-center gap-1 shadow-sm"
                          title={cap.description}
                        >
                          <Icon className="w-3 h-3 text-amber-400" />
                          <span>{cap.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Session switch button */}
                <div className="flex items-center gap-2 shrink-0">
                  {currentUser?.id !== ownerUser.id ? (
                    <button
                      onClick={() => handleSwitchSession(ownerUser)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Switch to Owner</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 font-mono text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Current Active Session</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section: INVITED COLLABORATORS */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase tracking-widest">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Invited Collaborators ({collaboratorUsers.length})</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                Capability-restricted access
              </span>
            </div>

            {collaboratorUsers.length === 0 ? (
              <div className="p-8 rounded-2xl bg-zinc-950/60 border border-white/5 text-center space-y-3">
                <Users className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="text-zinc-400 font-mono text-xs">
                  No collaborators invited yet. Click "Invite Collaborator" above to add team members with selective permissions.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collaboratorUsers.map((user) => {
                  const userCaps = user.capabilities || [];
                  const isCurrent = currentUser?.id === user.id;

                  return (
                    <div
                      key={user.id}
                      className={`p-5 rounded-2xl bg-zinc-950/70 border transition-all flex flex-col justify-between space-y-4 ${
                        isCurrent
                          ? 'border-cyan-500 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                          : 'border-white/10 hover:border-cyan-500/40'
                      }`}
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              src={user.avatar}
                              name={user.name}
                              className="w-12 h-12 rounded-xl"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-syne font-bold text-base text-white">
                                  {user.name}
                                </h4>
                                <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[9px] font-bold uppercase">
                                  COLLABORATOR
                                </span>
                              </div>
                              <p className="text-zinc-400 text-xs font-mono">{user.title}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditUser(user)}
                              className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-cyan-500/40 text-zinc-400 hover:text-white transition-colors"
                              title="Edit Capabilities & Info"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name, user.role)}
                              className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-red-500/40 text-zinc-400 hover:text-red-400 transition-colors"
                              title="Revoke Collaborator Access"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* User Metadata */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400 py-2 border-y border-white/5">
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Key className="w-3 h-3 text-zinc-500 shrink-0" />
                            <span>PIN:</span>
                            <span className="text-white font-mono tracking-widest font-bold">
                              {revealedPins[user.id] ? (user.passcode || '•••••••• (SHA-256)') : '••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                setRevealedPins(prev => ({ ...prev, [user.id]: !prev[user.id] }));
                              }}
                              className="p-1 rounded hover:bg-zinc-850 text-zinc-500 hover:text-cyan-300 transition-colors focus:outline-none"
                              title={revealedPins[user.id] ? "Hide PIN" : "Reveal PIN"}
                            >
                              {revealedPins[user.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Granted Capabilities Matrix */}
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                            <span>GRANTED CAPABILITIES</span>
                            <span className="text-cyan-400 font-bold">{userCaps.length} of 7</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                            {userCaps.length === 0 ? (
                              <span className="text-[10px] font-mono text-zinc-600 italic">
                                No capabilities granted (Restricted)
                              </span>
                            ) : (
                              userCaps.map((capKey) => {
                                const Icon = CAPABILITY_ICONS[capKey] || Shield;
                                return (
                                  <span
                                    key={capKey}
                                    className="px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] font-bold flex items-center gap-1"
                                  >
                                    <Icon className="w-2.5 h-2.5 text-cyan-400" />
                                    <span>{capKey}</span>
                                  </span>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Simulation / Active Session Switch */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Active: {user.lastActive || 'Recently'}</span>
                        </span>

                        {isCurrent ? (
                          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Logged In as {user.name.split(' ')[0]}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSwitchSession(user)}
                            className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 text-zinc-300 hover:text-white font-mono text-[10px] flex items-center gap-1.5 transition-all"
                            title="Simulate view to test permissions"
                          >
                            <Eye className="w-3 h-3 text-cyan-400" />
                            <span>Simulate Profile</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRODUCTION CREW & ASSIGNEES */}
      {/* ========================================================================= */}
      {activeTab === 'crew' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((member) => (
              <div
                key={member.id}
                className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 font-mono text-[9px] text-cyan-300 font-bold uppercase">
                      {member.type}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditCrew(member)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-cyan-500/40 text-zinc-400 hover:text-white transition-colors"
                        title="Edit Crew Member"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCrew(member.id, member.name)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-red-500/40 text-zinc-400 hover:text-red-400 transition-colors"
                        title="Delete Crew Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 mb-3">
                    <UserAvatar
                      src={member.avatar}
                      name={member.name}
                      className="w-12 h-12 rounded-xl"
                    />
                    <div>
                      <h4 className="font-syne font-bold text-base text-white">
                        {member.name}
                      </h4>
                      <p className="text-zinc-400 text-xs font-mono">{member.role}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-zinc-400 border-t border-white/5 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">ASSIGNED CUTS:</span>
                      <span className="text-white font-bold">{member.assignedProjectsCount} Projects</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">STATUS:</span>
                      <span className="text-cyan-400">{member.status}</span>
                    </div>
                    <div className="flex items-center justify-between truncate">
                      <span className="text-zinc-500">EMAIL:</span>
                      <span className="text-zinc-300 truncate max-w-[180px]">{member.email}</span>
                    </div>
                  </div>
                </div>

                {member.skills && member.skills.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <div className="text-[10px] font-mono text-zinc-500 mb-1.5 uppercase">
                      GEAR & SKILLS
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[9px] font-mono text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INVITE OR EDIT COLLABORATOR (WITH 7 CAPABILITY CHECKBOXES) */}
      {/* ========================================================================= */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-zinc-950 border border-cyan-500/40 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span>{editingUser.id ? 'Edit Collaborator Permissions' : 'Invite Collaborator to Control Room'}</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Select exact capabilities to grant access only to authorized modules.
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                editingUser.role === 'owner' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}>
                {editingUser.role}
              </span>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Collaborator Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Collaborator Name"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Title / Role in Studio
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.title}
                    onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. 3D VFX Lead"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="collab@agency.com"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Access Passcode / PIN (Private)
                  </label>
                  <div className="relative">
                    <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showModalPin ? "text" : "password"}
                      required
                      value={editingUser.passcode}
                      onChange={(e) => setEditingUser({ ...editingUser, passcode: e.target.value })}
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono font-bold tracking-widest"
                      placeholder="Enter private PIN..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setShowModalPin(!showModalPin);
                      }}
                      className="p-1 text-zinc-500 hover:text-cyan-400 absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus:outline-none"
                      title={showModalPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showModalPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Picture Upload & Customization */}
              <div className="space-y-2 p-3.5 rounded-xl bg-zinc-900/60 border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block text-zinc-300 font-mono text-[10px] uppercase tracking-wider font-bold">
                    Person's Profile Picture
                  </label>
                  {editingUser.avatar && (
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Photo Attached
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Avatar Preview with Camera overlay click */}
                  <div
                    onClick={() => userFileInputRef.current?.click()}
                    className="relative group cursor-pointer shrink-0"
                    title="Click to choose picture from files"
                  >
                    <UserAvatar
                      src={editingUser.avatar}
                      name={editingUser.name || 'User'}
                      className="w-16 h-16 rounded-xl border-2 border-white/15 group-hover:border-cyan-400 transition-all shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center text-cyan-300">
                      <Camera className="w-5 h-5" />
                      <span className="text-[8px] font-mono font-bold mt-0.5 uppercase">Choose</span>
                    </div>
                  </div>

                  {/* Upload Actions & Controls */}
                  <div className="flex-1 space-y-2">
                    <input
                      ref={userFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          processImageFile(file, (dataUrl) => {
                            setEditingUser((prev) => ({ ...prev, avatar: dataUrl }));
                          });
                        }
                        e.target.value = '';
                      }}
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => userFileInputRef.current?.click()}
                        disabled={isProcessingPhoto}
                        className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-mono text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isProcessingPhoto ? 'Optimizing...' : (editingUser.avatar ? 'Change Picture' : 'Upload Person Photo')}</span>
                      </button>

                      {editingUser.avatar && (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setEditingUser((prev) => ({ ...prev, avatar: '' }));
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-red-950/60 border border-white/10 hover:border-red-500/40 text-zinc-400 hover:text-red-400 font-mono text-xs flex items-center gap-1 transition-all"
                          title="Remove attached picture"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-zinc-500">
                      Auto-compressed (JPG/PNG/WebP, max 400×400) for zero lag.
                    </div>
                  </div>
                </div>

                {/* Optional direct URL fallback */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
                    <span>Or image URL:</span>
                  </div>
                  <input
                    type="text"
                    value={editingUser.avatar}
                    onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="https://images.unsplash.com/... or data:image/..."
                  />
                </div>
              </div>

              {/* Capability Matrix Selection */}
              <div className="pt-2 border-t border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                    Assigned Capabilities ({editingUser.capabilities?.length || 0} of 7)
                  </label>
                  {editingUser.role !== 'owner' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllCapabilities}
                        className="text-[10px] text-cyan-400 hover:underline font-mono"
                      >
                        Grant All
                      </button>
                      <span className="text-zinc-600">•</span>
                      <button
                        type="button"
                        onClick={handleClearCapabilities}
                        className="text-[10px] text-zinc-400 hover:underline font-mono"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>

                {editingUser.role === 'owner' ? (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs">
                    Studio Owner Ritik always possesses all 7 capabilities unrestricted.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {CAPABILITIES.map((cap) => {
                      const isChecked = editingUser.capabilities?.includes(cap.key);
                      const Icon = CAPABILITY_ICONS[cap.key] || Shield;

                      return (
                        <div
                          key={cap.key}
                          onClick={() => handleToggleCapability(cap.key)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isChecked
                              ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                              : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent div onClick
                            className="mt-0.5 rounded bg-zinc-900 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                          />

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-3.5 h-3.5 ${isChecked ? 'text-cyan-400' : 'text-zinc-500'}`} />
                              <span className="font-bold text-xs tracking-wider">
                                {cap.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-sans mt-0.5 leading-snug">
                              {cap.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                >
                  {editingUser.id ? 'Save Permissions' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRODUCTION CREW EDIT/ADD */}
      {/* ========================================================================= */}
      {isCrewModalOpen && editingCrewMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-zinc-950 border border-cyan-500/40 shadow-2xl space-y-5">
            <h3 className="font-syne text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>{editingCrewMember.id ? 'Edit Crew Member' : 'Add Production Crew Member'}</span>
            </h3>

            <form onSubmit={handleSaveCrew} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Crew Member Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCrewMember.name}
                    onChange={(e) => setEditingCrewMember({ ...editingCrewMember, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Production Specialist"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Department Type
                  </label>
                  <input
                    type="text"
                    value={editingCrewMember.type}
                    onChange={(e) => setEditingCrewMember({ ...editingCrewMember, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Camera Department"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Role Description
                </label>
                <input
                  type="text"
                  value={editingCrewMember.role}
                  onChange={(e) => setEditingCrewMember({ ...editingCrewMember, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Director of Photography"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingCrewMember.email}
                    onChange={(e) => setEditingCrewMember({ ...editingCrewMember, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="crew@studio.com"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Current Status
                  </label>
                  <input
                    type="text"
                    value={editingCrewMember.status}
                    onChange={(e) => setEditingCrewMember({ ...editingCrewMember, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Available On Call"
                  />
                </div>
              </div>

              {/* Profile Picture Upload & Customization */}
              <div className="space-y-2 p-3.5 rounded-xl bg-zinc-900/60 border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block text-zinc-300 font-mono text-[10px] uppercase tracking-wider font-bold">
                    Crew Member Photo
                  </label>
                  {editingCrewMember.avatar && (
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Photo Attached
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Avatar Preview with Camera overlay click */}
                  <div
                    onClick={() => crewFileInputRef.current?.click()}
                    className="relative group cursor-pointer shrink-0"
                    title="Click to choose picture from files"
                  >
                    <UserAvatar
                      src={editingCrewMember.avatar}
                      name={editingCrewMember.name || 'Crew'}
                      className="w-16 h-16 rounded-xl border-2 border-white/15 group-hover:border-cyan-400 transition-all shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center text-cyan-300">
                      <Camera className="w-5 h-5" />
                      <span className="text-[8px] font-mono font-bold mt-0.5 uppercase">Choose</span>
                    </div>
                  </div>

                  {/* Upload Actions & Controls */}
                  <div className="flex-1 space-y-2">
                    <input
                      ref={crewFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          processImageFile(file, (dataUrl) => {
                            setEditingCrewMember((prev) => ({ ...prev, avatar: dataUrl }));
                          });
                        }
                        e.target.value = '';
                      }}
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => crewFileInputRef.current?.click()}
                        disabled={isProcessingPhoto}
                        className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-mono text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isProcessingPhoto ? 'Optimizing...' : (editingCrewMember.avatar ? 'Change Picture' : 'Upload Person Photo')}</span>
                      </button>

                      {editingCrewMember.avatar && (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setEditingCrewMember((prev) => ({ ...prev, avatar: '' }));
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-red-950/60 border border-white/10 hover:border-red-500/40 text-zinc-400 hover:text-red-400 font-mono text-xs flex items-center gap-1 transition-all"
                          title="Remove attached picture"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-zinc-500">
                      Auto-compressed (JPG/PNG/WebP, max 400×400) for zero lag.
                    </div>
                  </div>
                </div>

                {/* Optional direct URL fallback */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
                    <span>Or image URL:</span>
                  </div>
                  <input
                    type="text"
                    value={editingCrewMember.avatar}
                    onChange={(e) => setEditingCrewMember({ ...editingCrewMember, avatar: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="https://images.unsplash.com/... or data:image/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Skills & Gear Specializations (comma separated)
                </label>
                <input
                  type="text"
                  value={editingCrewMember.skills ? editingCrewMember.skills.join(', ') : ''}
                  onChange={(e) => setEditingCrewMember({ ...editingCrewMember, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="RED V-Raptor, Sony FX6, Lighting"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCrewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-mono font-bold"
                >
                  Save Crew Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
