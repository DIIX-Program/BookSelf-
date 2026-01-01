
import React, { useState, useEffect } from 'react';
import { RoadmapItem, KnowledgePage } from '../types';
import { geminiService } from '../services/geminiService';

interface Props {
  t: (k: string) => string;
  allPages: Record<string, KnowledgePage>;
}

type ViewState = 'setup' | 'preview' | 'editing' | 'saved';

const RoadmapView: React.FC<Props> = ({ t, allPages }) => {
  const [goal, setGoal] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('setup');
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  
  // Interactive feedback states
  const [hints, setHints] = useState<string[]>([]);
  const [isAnalyzingHint, setIsAnalyzingHint] = useState(false);

  useEffect(() => {
    const fetchHint = async () => {
      if (subject.length > 3 && level && viewState === 'setup') {
        setIsAnalyzingHint(true);
        try {
          const res = await geminiService.getLearningAdvice(
            (Object.values(allPages) as KnowledgePage[]).map(p => p.title),
            `Briefly list 3 key prerequisites for ${subject} at ${level} level.`
          );
          setHints(res.suggestedPrerequisites.slice(0, 3));
        } catch (e) {
          console.error(e);
        } finally {
          setIsAnalyzingHint(false);
        }
      }
    };
    const timer = setTimeout(fetchHint, 1000);
    return () => clearTimeout(timer);
  }, [subject, level, allPages, viewState]);

  const handleGenerate = async () => {
    if (!subject || !goal || !level) return;
    setIsGenerating(true);
    try {
      const current = (Object.values(allPages) as KnowledgePage[]).map(p => p.title);
      const items = await geminiService.generateRoadmap(subject, level, current);
      setRoadmapItems(items);
      setViewState('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const effortEstimates = {
    beginner: { weeks: '4-6', daily: '30-45m' },
    intermediate: { weeks: '8-12', daily: '1-1.5h' },
    advanced: { weeks: '16-24', daily: '2h+' }
  };

  const handleUpdateItem = (index: number, updates: Partial<RoadmapItem>) => {
    const next = [...roadmapItems];
    next[index] = { ...next[index], ...updates };
    setRoadmapItems(next);
  };

  const handleRemoveItem = (index: number) => {
    setRoadmapItems(roadmapItems.filter((_, i) => i !== index));
  };

  const handleAddPhase = () => {
    const newItem: RoadmapItem = {
      id: `custom_${Date.now()}`,
      title: 'New Learning Phase',
      description: 'Define your learning goals for this step.',
      isPrerequisiteMissing: false
    };
    setRoadmapItems([...roadmapItems, newItem]);
  };

  if (viewState === 'saved') {
    return (
      <div className="max-w-4xl mx-auto px-8 py-32 text-center animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-stone-900 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-stone-200">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="serif text-6xl font-bold text-stone-900 mb-6">{t('roadmap_success_title')}</h1>
        <p className="text-xl text-stone-500 italic max-w-xl mx-auto mb-16 leading-relaxed">
          {t('roadmap_success_desc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="px-12 py-5 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all shadow-xl shadow-stone-200">
            {t('roadmap_btn_start')}
          </button>
          <button 
            onClick={() => setViewState('editing')}
            className="px-12 py-5 bg-white border border-stone-200 text-stone-700 rounded-2xl font-bold text-lg hover:bg-stone-50 transition-all"
          >
            {t('roadmap_btn_refine')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      {viewState === 'setup' ? (
        <div className="space-y-16 animate-in fade-in duration-700">
          <header className="text-center space-y-6">
            <h1 className="serif text-6xl md:text-7xl font-bold text-stone-900 tracking-tight">
              {t('nav_road')}
            </h1>
            <p className="text-xl text-stone-500 italic max-w-2xl mx-auto">
              {t('roadmap_ask')}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-12">
              <div className="bg-white p-10 rounded-[40px] border border-stone-200 book-shadow space-y-10 transition-all">
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                    {t('roadmap_subject')}
                  </label>
                  <input 
                    type="text" 
                    className="w-full serif text-3xl font-bold text-stone-900 placeholder-stone-200 border-b-2 border-stone-100 focus:border-stone-900 outline-none transition-all py-2 bg-transparent"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t('roadmap_prompt')}
                  />
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                    {t('roadmap_level')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['beginner', 'intermediate', 'advanced'] as const).map(l => (
                      <button 
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`text-left p-6 rounded-3xl border-2 transition-all group ${level === l ? 'bg-stone-900 border-stone-900 text-white shadow-xl scale-[1.02]' : 'bg-white border-stone-100 text-stone-900 hover:border-stone-300'}`}
                      >
                        <div className={`w-8 h-8 rounded-full mb-4 flex items-center justify-center font-bold text-[10px] ${level === l ? 'bg-white/20 text-white' : 'bg-stone-50 text-stone-400'}`}>
                          {l.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="font-bold text-sm mb-2">{t(`roadmap_level_${l.slice(0,3)}`)}</h4>
                        <p className={`text-[11px] leading-relaxed transition-colors ${level === l ? 'text-white/60' : 'text-stone-400'}`}>
                          {t(`roadmap_level_${l.slice(0,3)}_desc`)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                    Specific Outcome
                  </label>
                  <textarea 
                    className="w-full px-6 py-5 bg-stone-50 border border-stone-100 rounded-3xl outline-none focus:ring-4 focus:ring-stone-100 transition-all font-medium text-stone-800 h-32 resize-none"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., I want to build a real-time chat app using WebSockets..."
                  />
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !subject || !level || !goal}
                  className="w-full py-6 bg-stone-900 text-white rounded-[32px] font-bold text-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-stone-200 disabled:bg-stone-200 active:scale-95"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      <span>Architecting Journey...</span>
                    </div>
                  ) : (
                    <span>{t('roadmap_generate')}</span>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8 sticky top-24">
              <div className={`bg-stone-50 border border-stone-100 rounded-[40px] p-10 transition-all duration-500 ${level ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                 <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-8">{t('roadmap_effort_title')}</h3>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <p className="text-[11px] font-bold text-stone-400 uppercase mb-2">{t('roadmap_effort_time')}</p>
                       <p className="serif text-4xl font-bold text-stone-900">{level ? effortEstimates[level].weeks : '--'} <span className="text-sm font-medium">wks</span></p>
                    </div>
                    <div>
                       <p className="text-[11px] font-bold text-stone-400 uppercase mb-2">{t('roadmap_effort_daily')}</p>
                       <p className="serif text-4xl font-bold text-stone-900">{level ? effortEstimates[level].daily : '--'}</p>
                    </div>
                 </div>
              </div>

              <div className={`bg-white border border-stone-100 rounded-[40px] p-10 book-shadow transition-all duration-500 delay-100 ${subject.length > 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">{t('roadmap_hint_title')}</h3>
                    {isAnalyzingHint && <div className="w-2 h-2 bg-stone-900 rounded-full animate-ping" />}
                 </div>
                 <p className="text-sm text-stone-600 mb-6 font-medium">{t('roadmap_hint_pre')}</p>
                 <div className="space-y-3">
                    {hints.length > 0 ? hints.map((h, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs font-bold text-stone-900 animate-in fade-in slide-in-from-left duration-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                        {h}
                      </div>
                    )) : (
                      <div className="h-24 flex items-center justify-center border-2 border-dashed border-stone-100 rounded-2xl text-stone-200 italic text-xs">
                        {isAnalyzingHint ? 'Listening to goals...' : 'Type more to see hints'}
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Preview & Edit States */
        <div className="space-y-16 animate-in fade-in duration-1000">
           <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-stone-100 pb-16">
              <div className="max-w-2xl">
                 <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setViewState('setup')} className="p-2 text-stone-400 hover:text-stone-900">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                      {viewState === 'editing' ? 'Modifying Plan' : 'Roadmap Generated'}
                    </span>
                 </div>
                 <h1 className="serif text-7xl font-bold text-stone-900 leading-tight mb-4">{subject}</h1>
                 <p className="text-xl text-stone-500 italic">"{goal}"</p>
              </div>
              <div className="flex gap-4">
                 <div className="px-6 py-4 bg-white border border-stone-100 rounded-3xl text-center book-shadow">
                    <p className="text-[9px] font-bold text-stone-400 uppercase mb-1">Target Level</p>
                    <p className="font-bold text-stone-900 text-sm uppercase tracking-widest">{t(`roadmap_level_${level!.slice(0,3)}`)}</p>
                 </div>
              </div>
           </header>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8">
                 <div className="space-y-8">
                    {roadmapItems.map((item, i) => (
                      <div key={item.id} className="relative group flex gap-10 p-10 bg-white border border-stone-100 rounded-[40px] book-shadow transition-all duration-500">
                        <div className="flex-shrink-0 flex flex-col items-center">
                           <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold serif text-2xl transition-all ${item.isPrerequisiteMissing ? 'bg-rose-50 text-rose-500 border-2 border-rose-100' : 'bg-stone-900 text-white'}`}>
                              {i + 1}
                           </div>
                           {i < roadmapItems.length - 1 && <div className="w-0.5 h-full bg-stone-100 mt-6 group-hover:bg-stone-900 transition-colors" />}
                        </div>
                        <div className="pt-2 flex-grow">
                           {viewState === 'editing' ? (
                             <div className="space-y-4">
                               <input 
                                 type="text"
                                 className="w-full serif text-3xl font-bold text-stone-900 outline-none border-b border-stone-100 focus:border-stone-900 py-1 transition-all"
                                 value={item.title}
                                 onChange={(e) => handleUpdateItem(i, { title: e.target.value })}
                               />
                               <textarea 
                                 className="w-full text-stone-500 text-lg italic outline-none border-none bg-stone-50 p-4 rounded-2xl resize-none"
                                 value={item.description}
                                 onChange={(e) => handleUpdateItem(i, { description: e.target.value })}
                               />
                               <button 
                                onClick={() => handleRemoveItem(i)}
                                className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:text-rose-700"
                               >
                                 Remove phase
                               </button>
                             </div>
                           ) : (
                             <>
                               <div className="flex items-center gap-4 mb-3">
                                  <h3 className="serif text-3xl font-bold text-stone-900">{item.title}</h3>
                                  {item.isPrerequisiteMissing && (
                                    <span className="text-[9px] font-bold bg-rose-50 text-rose-600 px-3 py-1 rounded-full border border-rose-100 uppercase tracking-widest">Action Needed</span>
                                  )}
                               </div>
                               <p className="text-stone-500 text-lg leading-relaxed mb-6 italic">"{item.description}"</p>
                               {item.isPrerequisiteMissing && (
                                 <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-100">
                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-2">Knowledge Gap Detected</p>
                                    <p className="text-sm text-stone-700">This foundation is missing from your book. Reviewing similar pages in the community is recommended.</p>
                                 </div>
                               )}
                             </>
                           )}
                        </div>
                      </div>
                    ))}
                    {viewState === 'editing' && (
                      <button 
                        onClick={handleAddPhase}
                        className="w-full py-8 border-2 border-dashed border-stone-200 rounded-[40px] text-stone-400 font-bold uppercase tracking-widest hover:border-stone-400 hover:text-stone-600 transition-all flex items-center justify-center gap-4"
                      >
                        {t('roadmap_btn_add_phase')}
                      </button>
                    )}
                 </div>
              </div>
              
              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-stone-50 border border-stone-100 rounded-[40px] p-10 space-y-10">
                    <div className="space-y-4">
                       <h3 className="serif text-2xl font-bold text-stone-900">{t('roadmap_confirm_title')}</h3>
                       <p className="text-sm text-stone-500 leading-relaxed italic">{t('roadmap_edit_tip')}</p>
                    </div>
                    
                    <div className="space-y-4">
                       <button 
                         onClick={() => setViewState('saved')}
                         className="w-full py-5 bg-stone-900 text-white rounded-[24px] font-bold text-lg shadow-xl shadow-stone-200 hover:bg-stone-800 transition-all"
                       >
                         {t('roadmap_btn_save')}
                       </button>
                       <button 
                         onClick={() => setViewState(viewState === 'editing' ? 'preview' : 'editing')}
                         className="w-full py-5 bg-white border border-stone-200 text-stone-700 rounded-[24px] font-bold text-lg hover:bg-stone-50 transition-all"
                       >
                         {viewState === 'editing' ? '✅ Finish Editing' : t('roadmap_btn_edit')}
                       </button>
                    </div>
                 </div>

                 <div className="bg-stone-900 text-white rounded-[40px] p-10 shadow-2xl">
                    <h3 className="serif text-2xl font-bold mb-6">Learning Philosophy</h3>
                    <p className="text-white/60 text-sm leading-relaxed italic mb-8">"Forgetting is not a failure; it is a signal to revisit the roots. This roadmap ensures your ink stays bold."</p>
                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-stone-500" />
                          <p className="text-xs font-bold uppercase tracking-widest">Iterative Review</p>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-stone-500" />
                          <p className="text-xs font-bold uppercase tracking-widest">Reflective Writing</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapView;
