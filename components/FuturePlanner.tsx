
import React, { useState } from 'react';
import { LearnerBook } from '../types';
import { geminiService } from '../services/geminiService';

const FuturePlanner: React.FC<{ book: LearnerBook, t: (key: string) => string }> = ({ book, t }) => {
  const [goal, setGoal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [advice, setAdvice] = useState<{ advice: string; suggestedPrerequisites: string[] } | null>(null);

  const handleGetAdvice = async () => {
    if (!goal.trim()) return;
    setIsThinking(true);
    try {
      const currentPages = book.pages.map(p => p.title);
      const res = await geminiService.getLearningAdvice(currentPages, goal);
      setAdvice(res);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <h1 className="serif text-5xl font-bold text-stone-900 mb-4">{t('plan_title')}</h1>
        <p className="text-xl text-stone-500">{t('plan_desc')}</p>
      </header>

      <div className="bg-white border border-stone-200 rounded-3xl p-10 book-shadow space-y-10">
        <div className="space-y-4">
           <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('plan_label')}</label>
           <div className="flex gap-4">
              <input 
                type="text" 
                placeholder={t('plan_placeholder')}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="flex-grow px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-stone-900/5"
              />
              <button 
                onClick={handleGetAdvice}
                disabled={isThinking || !goal.trim()}
                className="px-8 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 disabled:bg-stone-300 transition-all"
              >
                {isThinking ? '...' : t('plan_btn')}
              </button>
           </div>
        </div>

        {advice && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                   </div>
                   <h3 className="serif text-2xl font-bold">{t('plan_mentor_title')}</h3>
                </div>
                <p className="text-stone-700 leading-relaxed italic">"{advice.advice}"</p>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('plan_pre_req')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {advice.suggestedPrerequisites.map((pre, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-xl">
                         <div className="w-2 h-2 rounded-full bg-stone-300"></div>
                         <span className="text-stone-800 font-medium">{pre}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuturePlanner;
