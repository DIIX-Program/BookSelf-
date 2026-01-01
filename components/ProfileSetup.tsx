
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { geminiService } from '../services/geminiService';

interface Props {
  user: UserProfile;
  onComplete: (profile: UserProfile) => void;
  t: (k: string) => string;
}

// Simulated list of taken usernames
const TAKEN_USERNAMES = ['admin', 'learner', 'alex', 'sophia', 'bookself', 'cognito'];

const ProfileSetup: React.FC<Props> = ({ user, onComplete, t }) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    if (!username) {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    const timer = setTimeout(() => {
      if (TAKEN_USERNAMES.includes(username.toLowerCase())) {
        setUsernameStatus('taken');
      } else {
        setUsernameStatus('available');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleGenerateAvatar = async () => {
    setIsGenerating(true);
    try {
      // Use prompt-based image generation for avatar
      const prompt = `A professional, academic-style minimal profile avatar for a learner named ${displayName || 'User'}. Soft stone colors.`;
      const response = await geminiService.generateBookCover(displayName || "Learner", prompt);
      if (response) setPhotoURL(response);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinish = () => {
    if (usernameStatus !== 'available') return;
    onComplete({
      ...user,
      username,
      displayName: displayName || username,
      photoURL,
      isSetupComplete: true
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto p-12 bg-white rounded-[40px] border border-stone-200 book-shadow space-y-10 animate-in fade-in zoom-in-95 duration-500">
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-stone-900 rounded-2xl mx-auto flex items-center justify-center">
           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <h1 className="serif text-4xl font-bold text-stone-900 uppercase tracking-tighter">BOOKSELF+ SETUP</h1>
        <p className="text-stone-500 italic">"{t('profile_setup_desc')}"</p>
      </header>

      <div className="space-y-8">
        <div className="flex flex-col items-center gap-6">
           <div className="relative w-24 h-24 rounded-full bg-stone-100 border-2 border-stone-200 overflow-hidden shadow-inner">
              {photoURL ? (
                <img src={photoURL} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
              )}
              {isGenerating && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" /></div>}
           </div>
           <button 
            onClick={handleGenerateAvatar}
            disabled={isGenerating}
            className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-4"
           >
             {t('profile_btn_ai_avatar')}
           </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('profile_label_username')}</label>
            <div className="relative">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                className={`w-full px-6 py-4 bg-stone-50 border rounded-2xl outline-none transition-all font-bold ${usernameStatus === 'available' ? 'border-emerald-200 focus:ring-emerald-50' : usernameStatus === 'taken' ? 'border-rose-200 focus:ring-rose-50' : 'border-stone-100 focus:ring-stone-100'}`}
                placeholder="e.g. alex_learner"
              />
              <div className="absolute right-4 top-4">
                {usernameStatus === 'checking' && <div className="w-4 h-4 border-2 border-stone-300 border-t-transparent rounded-full animate-spin" />}
                {usernameStatus === 'available' && <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                {usernameStatus === 'taken' && <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
              </div>
            </div>
            {usernameStatus === 'taken' && <p className="text-[10px] text-rose-500 font-bold uppercase ml-2">{t('profile_username_taken')}</p>}
            {usernameStatus === 'available' && <p className="text-[10px] text-emerald-500 font-bold uppercase ml-2">{t('profile_username_avail')}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('profile_label_display')}</label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-stone-100 transition-all font-medium"
              placeholder="How should people call you?"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleFinish}
        disabled={usernameStatus !== 'available'}
        className="w-full py-5 bg-stone-900 text-white rounded-3xl font-bold text-lg hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 disabled:bg-stone-100 disabled:text-stone-300"
      >
        {t('profile_btn_finish')}
      </button>
    </div>
  );
};

export default ProfileSetup;
