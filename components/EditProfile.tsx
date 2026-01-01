
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { geminiService } from '../services/geminiService';

interface Props {
  user: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  t: (k: string) => string;
}

const EditProfile: React.FC<Props> = ({ user, onUpdate, t }) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerateAvatar = async () => {
    setIsGenerating(true);
    try {
      const prompt = `A professional, academic-style minimal profile avatar for a learner named ${displayName}. Soft stone colors.`;
      const response = await geminiService.generateBookCover(displayName, prompt);
      if (response) setPhotoURL(response);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onUpdate({
      ...user,
      displayName,
      bio,
      photoURL
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-10 py-16">
      <header className="mb-16">
        <h1 className="serif text-5xl font-bold text-stone-900 mb-4">{t('profile_edit_title')}</h1>
        <p className="text-xl text-stone-500 italic max-w-2xl">Refining your educational identity across the library.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-[40px] p-12 book-shadow space-y-12">
          <div className="space-y-8">
            <div className="flex items-center gap-10">
               <div className="relative w-32 h-32 rounded-full border-2 border-stone-100 overflow-hidden shadow-xl bg-stone-50">
                  {photoURL ? (
                    <img src={photoURL} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                  )}
                  {isGenerating && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><div className="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" /></div>}
               </div>
               <div className="space-y-4">
                  <button 
                    onClick={handleGenerateAvatar}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {t('profile_btn_ai_avatar')}
                  </button>
                  <p className="text-xs text-stone-400 italic">Recommended: Clear, calm academic style.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-8 border-t border-stone-50">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t('profile_label_display')}</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-stone-100 transition-all font-bold"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">About You (Bio)</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-3xl outline-none focus:ring-4 focus:ring-stone-100 transition-all font-medium h-32 resize-none"
                    placeholder="Briefly describe your learning journey..."
                  />
               </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <button 
                onClick={handleSave}
                className="flex-grow py-5 bg-stone-900 text-white rounded-3xl font-bold text-lg hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
             >
               {isSaved ? 'Identity Updated' : 'Save Changes'}
             </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="bg-stone-50 border border-stone-100 rounded-[40px] p-10 flex flex-col items-center text-center">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-10">Public Preview</h3>
              <div className="w-full bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6">
                 <div className="w-20 h-20 rounded-full border-2 border-stone-100 mx-auto overflow-hidden bg-stone-50">
                   {photoURL && <img src={photoURL} className="w-full h-full object-cover" alt="" />}
                 </div>
                 <div>
                    <h4 className="serif text-2xl font-bold text-stone-900">{displayName}</h4>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">@{user.username}</p>
                 </div>
                 <p className="text-sm text-stone-500 leading-relaxed italic">{bio || 'Learning is a lifelong process.'}</p>
                 <div className="flex justify-center gap-6 pt-4 border-t border-stone-50">
                    <div className="text-center">
                       <p className="text-lg font-bold text-stone-900">12</p>
                       <p className="text-[9px] font-bold text-stone-400 uppercase">Books</p>
                    </div>
                    <div className="text-center">
                       <p className="text-lg font-bold text-stone-900">1.2k</p>
                       <p className="text-[9px] font-bold text-stone-400 uppercase">Likes</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
