import {
  AlertCircle,
  CheckCircle2,
  Database,
  FolderPlus,
  Play,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import React, {useMemo, useState} from 'react';
import {
  CapabilitiesResponse,
  DemoSessionUser,
  ProjectStatus,
  ReelProject,
  StudioRoute,
} from '../../types/reelforge';
import {ResilientImage} from '../common/ResilientImage';

interface DashboardViewProps {
  user: DemoSessionUser;
  projects: ReelProject[];
  capabilities: CapabilitiesResponse;
  onNavigate: (route: StudioRoute) => void;
  onSelectProject: (projectId: string, targetRoute?: StudioRoute) => void;
  onDeleteProject: (projectId: string) => Promise<void>;
  onOpenAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  projects,
  capabilities,
  onNavigate,
  onSelectProject,
  onDeleteProject,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === 'All' || project.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.topic.toLowerCase().includes(q) ||
        project.language.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [projects, searchQuery, statusFilter]);

  const configuredCount = capabilities.providers.filter((p) => p.configured).length;
  const cloudCount = projects.filter((p) => !p.isDemo).length;

  const handleConfirmDelete = async (projectId: string) => {
    setDeletingId(projectId);
    try {
      await onDeleteProject(projectId);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F5F7]">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-[#A1A7B3]">
            {user.isDemoSession
              ? 'Demo Workspace · Sign in with Google to save projects to Cloud Firestore'
              : `${user.plan} workspace · Synced with Cloud Firestore`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {user.isDemoSession && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A1E25] hover:bg-[#232832] border border-white/[0.1] text-xs font-medium text-[#F4F5F7] whitespace-nowrap cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Connect Account</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('generator')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-sm font-semibold hover:bg-[#c8ff59] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create New Reel</span>
          </button>
        </div>
      </div>

      {/* Usage & Credits Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-5">
          <p className="text-xs text-[#A1A7B3]">Export Credits Remaining</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-[#F4F5F7] tabular-nums">
            {user.creditsRemaining}
            <span className="text-sm font-normal text-[#6B7280]">
              {' '}
              / {user.creditsTotal} min
            </span>
          </p>
        </div>

        <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-5">
          <p className="text-xs text-[#A1A7B3]">Cloud Projects</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-[#F4F5F7] tabular-nums">
            {cloudCount}
            <span className="text-sm font-normal text-[#6B7280]">
              {' '}
              saved · {projects.filter((p) => p.isDemo).length} demo
            </span>
          </p>
        </div>

        <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-5">
          <p className="text-xs text-[#A1A7B3]">Connected Providers</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-[#F4F5F7] tabular-nums">
            {configuredCount}
            <span className="text-sm font-normal text-[#6B7280]">
              {' '}
              / {capabilities.providers.length} configured
            </span>
          </p>
        </div>
      </div>

      {/* Recent Projects Section */}
      <section aria-labelledby="recent-projects-heading" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2
            id="recent-projects-heading"
            className="font-display text-lg font-semibold text-[#F4F5F7]"
          >
            Projects
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                aria-label="Search projects"
                className="w-full sm:w-56 pl-9 pr-3 py-2 rounded-lg bg-[#121418] border border-white/[0.08] text-xs text-[#F4F5F7] placeholder:text-[#6B7280] focus:outline-none focus:border-[#B8FF2E]"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#121418] border border-white/[0.08] overflow-x-auto">
              {(['All', 'Demo Ready', 'Draft'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#20242C] text-[#F4F5F7]'
                      : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-10 text-center">
            <p className="text-sm font-medium text-[#F4F5F7]">
              No matching projects found
            </p>
            <p className="text-xs text-[#A1A7B3] mt-1">
              Clear your search filter or create a new vertical reel brief.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#1D2128] text-xs font-medium text-[#F4F5F7] hover:bg-[#262B34] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="rounded-xl bg-[#121418] border border-white/[0.08] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-[#0B0C0E] relative overflow-hidden">
                    <ResilientImage
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-4">
                      <span className="text-xs font-mono tabular-nums text-[#F4F5F7]">
                        {project.aspectRatio} · {project.resolution} · {project.durationSeconds}s
                      </span>
                      <span className="text-xs font-medium text-[#B8FF2E]">
                        {project.isDemo ? 'Demo Sample' : `${project.status} · Cloud`}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base font-semibold text-[#F4F5F7] line-clamp-2">
                        {project.title}
                      </h3>
                      {!project.isDemo && (
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmDeleteId(
                              confirmDeleteId === project.id ? null : project.id
                            )
                          }
                          aria-label={`Delete ${project.title}`}
                          className="p-1.5 rounded text-[#6B7280] hover:text-rose-400 hover:bg-rose-500/10 shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-[#A1A7B3]">
                      <span>{project.language}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.visualStyle}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.mode === 'auto' ? 'Auto Mode' : 'Studio Mode'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.updatedAt}</span>
                    </div>

                    {confirmDeleteId === project.id && (
                      <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-rose-300">
                          Delete from Firestore?
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 rounded text-[11px] text-[#A1A7B3] hover:text-[#F4F5F7] cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === project.id}
                            onClick={() => handleConfirmDelete(project.id)}
                            className="px-2.5 py-1 rounded bg-rose-500 text-white text-[11px] font-medium hover:bg-rose-600 cursor-pointer"
                          >
                            {deletingId === project.id ? 'Deleting...' : 'Confirm'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectProject(project.id, 'script')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1A1E25] hover:bg-[#232832] text-xs font-medium text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Edit Script</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectProject(project.id, 'timeline')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1A1E25] hover:bg-[#232832] text-xs font-medium text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-[#B8FF2E]" />
                    <span>Open Timeline</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Honest Provider Readiness Checklist */}
      <section
        aria-labelledby="provider-readiness-heading"
        className="rounded-xl bg-[#121418] border border-white/[0.08] p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
          <div>
            <h2
              id="provider-readiness-heading"
              className="font-display text-base font-semibold text-[#F4F5F7]"
            >
              Backend Provider & Phase Readiness
            </h2>
            <p className="text-xs text-[#A1A7B3] mt-0.5">
              Live server environment inspection. Firebase Auth and Firestore are connected in Phase 2.
            </p>
          </div>
          <span className="font-mono text-xs text-[#34D399] tabular-nums whitespace-nowrap shrink-0">
            Phase 2 Active
          </span>
        </div>

        <div className="divide-y divide-white/[0.06] mt-2">
          {capabilities.providers.map((provider) => (
            <div
              key={provider.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5">
                {provider.configured ? (
                  <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="font-medium text-[#F4F5F7]">
                  {provider.label}
                </span>
                <span className="text-[#6B7280] font-mono">{provider.phase}</span>
              </div>
              <span className="text-[#A1A7B3] sm:text-right">
                {provider.requirement}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
