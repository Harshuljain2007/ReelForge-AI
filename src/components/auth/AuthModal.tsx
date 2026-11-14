import {signInWithPopup} from 'firebase/auth';
import {ArrowRight, Lock, X} from 'lucide-react';
import React, {useState} from 'react';
import {auth, googleProvider} from '../../lib/firebase';
import {ensureUserDocuments} from '../../services/firestoreService';
import {DemoSessionUser} from '../../types/reelforge';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  preselectedPlan?: DemoSessionUser['plan'];
  onClose: () => void;
  onAuthenticated: (plan: DemoSessionUser['plan']) => void;
  onContinueDemo: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  preselectedPlan = 'Studio Pro',
  onClose,
  onAuthenticated,
  onContinueDemo,
}) => {
  const [selectedPlan, setSelectedPlan] =
    useState<DemoSessionUser['plan']>(preselectedPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureUserDocuments(cred.user, selectedPlan);
      onAuthenticated(selectedPlan);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to complete Google sign-in.';
      if (msg.includes('popup-closed-by-user')) {
        setError('Sign-in popup was closed before completing.');
      } else if (msg.includes('popup-blocked')) {
        setError('Your browser blocked the sign-in popup. Allow popups for this site and retry.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md rounded-xl bg-[#121418] border border-white/[0.1] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2
              id="auth-modal-title"
              className="text-xl font-semibold text-[#F4F5F7]"
            >
              {initialMode === 'signup'
                ? 'Create your ReelForge AI workspace'
                : 'Sign in to ReelForge AI'}
            </h2>
            <p className="text-sm text-[#A1A7B3] mt-1">
              Connect your Google account to persist projects, scenes, and characters in Cloud Firestore.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="p-2 rounded-lg text-[#A1A7B3] hover:text-[#F4F5F7] hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Plan Tier Selection */}
        <div className="mb-5">
          <span className="block text-xs font-medium text-[#A1A7B3] mb-2">
            Workspace Tier
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-[#0B0C0E] border border-white/[0.08]">
            {(['Creator', 'Studio Pro', 'Production Team'] as const).map(
              (tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedPlan(tier)}
                  className={`py-2 px-2 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap truncate cursor-pointer ${
                    selectedPlan === tier
                      ? 'bg-[#20242C] text-[#F4F5F7]'
                      : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
                  }`}
                >
                  {tier}
                </button>
              )
            )}
          </div>
        </div>

        {error && (
          <p className="mb-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-sm font-semibold hover:bg-[#c8ff59] disabled:opacity-60 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>
              {loading ? 'Connecting with Google...' : 'Continue with Google'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onContinueDemo}
            className="w-full py-2.5 px-4 rounded-lg bg-[#1A1E25] hover:bg-[#232832] border border-white/[0.08] text-xs font-medium text-[#F4F5F7] transition-colors cursor-pointer"
          >
            Explore Demo Workspace (No Sign-In)
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-start gap-2.5 text-xs text-[#A1A7B3]">
          <Lock className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Authenticated sessions sync directly to Cloud Firestore with owner-only security rules. Demo Workspace stays local and read-only for database writes.
          </p>
        </div>
      </div>
    </div>
  );
};
