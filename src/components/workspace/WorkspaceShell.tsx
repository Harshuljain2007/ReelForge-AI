import {
  AlertCircle,
  Download,
  FileText,
  Film,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  PlusSquare,
  Sliders,
  Users,
  X,
} from 'lucide-react';
import React, {useState} from 'react';
import {CREATOR_AVATAR_IMAGE} from '../../data/demoStudioData';
import {
  CapabilitiesResponse,
  CharacterAsset,
  DemoSessionUser,
  ReelProject,
  StudioRoute,
} from '../../types/reelforge';
import {ResilientImage} from '../common/ResilientImage';
import {DashboardView} from './DashboardView';
import {ReelGeneratorView} from './ReelGeneratorView';
import {
  CharacterStudioView,
  ExportCenterView,
  ProductionStudioView,
  ScriptEditorView,
  TimelineEditorView,
} from './StudioSubViews';

interface WorkspaceShellProps {
  user: DemoSessionUser;
  activeRoute: StudioRoute;
  projects: ReelProject[];
  activeProjectId: string;
  characters: CharacterAsset[];
  capabilities: CapabilitiesResponse;
  syncError: string | null;
  onDismissSyncError: () => void;
  onNavigate: (route: StudioRoute) => void;
  onSelectProject: (projectId: string, targetRoute?: StudioRoute) => void;
  onCreateProjectDraft: (project: ReelProject) => Promise<void>;
  onUpdateProject: (updated: ReelProject) => void;
  onSaveProjectToCloud: (project: ReelProject) => Promise<boolean>;
  onDeleteProject: (projectId: string) => Promise<void>;
  onAddCharacter: (char: CharacterAsset) => Promise<void>;
  onDeleteCharacter: (characterId: string) => Promise<void>;
  onBackToLanding: () => void;
  onOpenAuth: () => void;
  onSignOut: () => Promise<void>;
}

const NAV_ITEMS: Array<{
  id: StudioRoute;
  label: string;
  icon: React.FC<{className?: string}>;
}> = [
  {id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard},
  {id: 'generator', label: 'AI Reel Generator', icon: PlusSquare},
  {id: 'script', label: 'Script Editor', icon: FileText},
  {id: 'characters', label: 'Character Studio', icon: Users},
  {id: 'production', label: 'Production Studio', icon: Film},
  {id: 'timeline', label: 'Timeline Editor', icon: Sliders},
  {id: 'export', label: 'Export Center', icon: Download},
];

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  user,
  activeRoute,
  projects,
  activeProjectId,
  characters,
  capabilities,
  syncError,
  onDismissSyncError,
  onNavigate,
  onSelectProject,
  onCreateProjectDraft,
  onUpdateProject,
  onSaveProjectToCloud,
  onDeleteProject,
  onAddCharacter,
  onDeleteCharacter,
  onBackToLanding,
  onOpenAuth,
  onSignOut,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];

  const activeNavLabel =
    NAV_ITEMS.find((item) => item.id === activeRoute)?.label || 'Dashboard';

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            type="button"
            onClick={onBackToLanding}
            className="font-display text-lg font-bold tracking-tight text-[#F4F5F7] hover:text-[#B8FF2E] transition-colors cursor-pointer"
          >
            ReelForge AI
          </button>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded text-[#A1A7B3] hover:text-[#F4F5F7]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav aria-label="Studio workspace navigation" className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileNavOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1E25] text-[#B8FF2E]'
                    : 'text-[#A1A7B3] hover:text-[#F4F5F7] hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Project Quick Switcher */}
        <div className="pt-4 border-t border-white/[0.08] px-1">
          <label
            htmlFor="workspace-project-select"
            className="block text-[11px] font-medium text-[#6B7280] mb-1.5"
          >
            Active Project
          </label>
          <select
            id="workspace-project-select"
            value={activeProject.id}
            onChange={(e) => onSelectProject(e.target.value)}
            className="w-full px-2.5 py-2 rounded-lg bg-[#0B0C0E] border border-white/[0.08] text-xs text-[#F4F5F7] truncate focus:outline-none focus:border-[#B8FF2E]"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.isDemo ? `[Demo] ${p.title}` : p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Account Footer */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1A1E25] shrink-0">
            <ResilientImage
              src={user.photoUrl || CREATOR_AVATAR_IMAGE}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#F4F5F7] truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-[#A1A7B3] truncate">
              {user.isDemoSession ? 'Demo Mode' : `${user.plan} · Synced`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-[#14171C] hover:bg-[#1C2026] border border-white/[0.08] text-[11px] text-[#A1A7B3] hover:text-[#F4F5F7] cursor-pointer"
          >
            <Home className="w-3 h-3" />
            <span>Landing</span>
          </button>
          {user.isDemoSession ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-[#14171C] hover:bg-[#1C2026] border border-white/[0.08] text-[11px] text-[#B8FF2E] cursor-pointer"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-[#14171C] hover:bg-[#1C2026] border border-white/[0.08] text-[11px] text-[#A1A7B3] hover:text-[#F4F5F7] cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F4F5F7] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-[#0F1115] border-r border-white/[0.08] sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative w-64 max-w-[80vw] bg-[#0F1115] border-r border-white/[0.08] h-full z-10">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Contextual Workspace Top Header */}
        <header className="sticky top-0 z-30 h-16 px-6 bg-[#0B0C0E]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open studio navigation"
              className="lg:hidden p-2 rounded-lg text-[#A1A7B3] hover:text-[#F4F5F7] hover:bg-white/[0.06] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs sm:text-sm text-[#A1A7B3] truncate">
              <span>Workspace</span>
              <span className="mx-2 text-[#6B7280]">/</span>
              <span className="font-medium text-[#F4F5F7]">{activeNavLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-xs text-[#A1A7B3]">
              {user.isDemoSession ? 'Local Demo' : 'Firestore Synced'}
            </span>
            <button
              type="button"
              onClick={() => onNavigate('generator')}
              className="px-4 py-2 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-xs font-semibold hover:bg-[#c8ff59] whitespace-nowrap shrink-0 cursor-pointer"
            >
              New Reel
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {syncError && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 p-4 flex items-start justify-between gap-3 text-xs text-rose-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{syncError}</p>
              </div>
              <button
                type="button"
                onClick={onDismissSyncError}
                className="text-rose-300 hover:text-white shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeRoute === 'dashboard' && (
            <DashboardView
              user={user}
              projects={projects}
              capabilities={capabilities}
              onNavigate={onNavigate}
              onSelectProject={onSelectProject}
              onDeleteProject={onDeleteProject}
              onOpenAuth={onOpenAuth}
            />
          )}

          {activeRoute === 'generator' && (
            <ReelGeneratorView
              characters={characters}
              onCreateProjectDraft={onCreateProjectDraft}
            />
          )}

          {activeRoute === 'script' && (
            <ScriptEditorView
              project={activeProject}
              isAuthenticated={!user.isDemoSession}
              onUpdateProject={onUpdateProject}
              onSaveProjectToCloud={onSaveProjectToCloud}
              onNavigate={onNavigate}
            />
          )}

          {activeRoute === 'characters' && (
            <CharacterStudioView
              characters={characters}
              isAuthenticated={!user.isDemoSession}
              onAddCharacter={onAddCharacter}
              onDeleteCharacter={onDeleteCharacter}
            />
          )}

          {activeRoute === 'production' && (
            <ProductionStudioView
              project={activeProject}
              onNavigate={onNavigate}
            />
          )}

          {activeRoute === 'timeline' && (
            <TimelineEditorView
              project={activeProject}
              onUpdateProject={onUpdateProject}
              onSaveProjectToCloud={onSaveProjectToCloud}
              onNavigate={onNavigate}
            />
          )}

          {activeRoute === 'export' && (
            <ExportCenterView project={activeProject} />
          )}
        </main>
      </div>
    </div>
  );
};
