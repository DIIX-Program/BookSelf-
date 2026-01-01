
import React, { useState } from 'react';
import { LearnerBook } from '../types';
import { geminiService } from '../services/geminiService';

interface Props {
  book: LearnerBook;
  onUpdate: (updates: Partial<LearnerBook>) => void;
  t: (key: string) => string;
}

const BookSettings: React.FC<Props> = ({ book, onUpdate, t }) => {
  const [title, setTitle] = useState(book.title);
  const [desc, setDesc] = useState(book.description);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCover = async () => {
    setIsGenerating(true);
    try {
      const cover = await geminiService.generateBookCover(title, desc);
      onUpdate({ coverImage: cover });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="serif text-4xl font-bold text-stone-900 mb-10">{t('settings_title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('settings_field_title')}</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => { setTitle(e.target.value); onUpdate({ title: e.target.value }); }}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900/5"
              />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('settings_field_desc')}</label>
              <textarea 
                value={desc}
                onChange={(e) => { setDesc(e.target.value); onUpdate({ description: e.target.value }); }}
                className="w-full h-32 px-4 py-3 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-900/5 resize-none"
              />
           </div>
           <div className="pt-4">
              <button 
                onClick={handleGenerateCover}
                disabled={isGenerating}
                className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 disabled:bg-stone-300 transition-all flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                   <span className="animate-pulse">...</span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {t('settings_btn_cover')}
                  </>
                )}
              </button>
           </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-stone-100 rounded-3xl p-10 border border-stone-200">
           <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-6">{t('settings_preview')}</div>
           <div className="w-44 h-64 bg-stone-800 rounded shadow-2xl flex flex-col items-center justify-center text-white p-6 text-center overflow-hidden relative">
               {book.coverImage ? (
                 <img src={book.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60" />
               ) : null}
               <div className="relative z-10">
                 <div className="serif text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-80">{book.owner}</div>
                 <h2 className="serif text-lg font-bold leading-tight">{title}</h2>
               </div>
               <div className="absolute bottom-6 z-10 text-[8px] font-bold opacity-40 tracking-widest uppercase">Self-Learner Edition</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookSettings;
