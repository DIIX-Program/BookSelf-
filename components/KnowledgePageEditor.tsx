
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { KnowledgePage, Book, QuizQuestion, UnderstandingLevel } from '../types';
import { geminiService } from '../services/geminiService';

interface Props {
  allPages: Record<string, KnowledgePage>;
  onUpdate: (p: KnowledgePage) => void;
  t: (k: string) => string;
  books: Book[];
}

const KnowledgePageEditor: React.FC<Props> = ({ allPages, onUpdate, t, books }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[] | null>(null);
  const [quizProgress, setQuizProgress] = useState(-1);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (id && allPages[id]) {
      const page = allPages[id];
      setTitle(page.title);
      setContent(page.content);
    }
  }, [id, allPages]);

  const handleSave = () => {
    if (!id || !title.trim()) return;
    const page: KnowledgePage = {
      id,
      title,
      content,
      lastUpdated: new Date().toISOString().split('T')[0],
      retention: 100, // Reset retention on save/review
      understanding: UnderstandingLevel.WELL_UNDERSTOOD,
      prerequisites: [],
      chapterId: searchParams.get('chapterId') || undefined
    };
    onUpdate(page);
    // Logic to add to chapter would go here in state
    navigate(-1);
  };

  const handleOptimize = async () => {
    if (!content.trim()) return;
    setIsBusy(true);
    try {
      const { structuredContent } = await geminiService.optimizeContent(content);
      setContent(structuredContent);
    } finally {
      setIsBusy(false);
    }
  };

  const startQuiz = async () => {
    if (!content.trim()) return;
    setIsBusy(true);
    try {
      const q = await geminiService.generateQuiz(title, content);
      setActiveQuiz(q);
      setQuizProgress(0);
      setQuizScore(0);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="text-stone-400 hover:text-stone-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="flex gap-4">
               <button onClick={handleOptimize} disabled={isBusy} className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-all flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {isBusy ? '...' : t('btn_optimize')}
               </button>
               <button onClick={handleSave} className="px-6 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all">Save</button>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-10 book-shadow space-y-8">
            <input 
              type="text" 
              placeholder={t('editor_topic_placeholder')}
              className="w-full serif text-5xl font-bold text-stone-900 placeholder-stone-100 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea 
              placeholder={t('editor_content_placeholder')}
              className="w-full h-[500px] text-lg text-stone-600 leading-relaxed outline-none resize-none placeholder-stone-100"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">{t('editor_panel_title')}</h2>
           
           {activeQuiz && quizProgress >= 0 && quizProgress < activeQuiz.length ? (
              <div className="bg-stone-900 rounded-3xl p-8 text-white shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Question {quizProgress + 1}/10</span>
                  <button onClick={() => setActiveQuiz(null)} className="text-stone-600 hover:text-white">&times;</button>
                </div>
                <h3 className="serif text-xl font-bold mb-8 leading-tight">{activeQuiz[quizProgress].question}</h3>
                <div className="space-y-3">
                  {activeQuiz[quizProgress].options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        if (i === activeQuiz[quizProgress].correctIndex) setQuizScore(s => s + 1);
                        if (quizProgress < 9) setQuizProgress(p => p + 1);
                        else {
                          alert(`Memory Restored! Score: ${quizScore + (i === activeQuiz[quizProgress].correctIndex ? 1 : 0)}/10`);
                          setActiveQuiz(null);
                          setQuizProgress(-1);
                        }
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-stone-800 hover:bg-stone-800 transition-all text-sm font-medium"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
           ) : (
             <div className="bg-white border border-stone-200 rounded-3xl p-8 book-shadow">
               <div className="mb-8">
                 <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">{t('label_retention')}</h3>
                 <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-stone-900">{id && allPages[id] ? allPages[id].retention : 100}%</span>
                    <div className="flex-grow h-2 bg-stone-100 rounded-full overflow-hidden">
                       <div className="h-full bg-stone-900" style={{ width: `${id && allPages[id] ? allPages[id].retention : 100}%` }} />
                    </div>
                 </div>
               </div>
               <button onClick={startQuiz} className="w-full py-4 bg-stone-50 border border-stone-100 text-stone-900 rounded-2xl font-bold text-sm hover:bg-stone-100 transition-all flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  {t('btn_quiz')}
               </button>
             </div>
           )}

           <div className="bg-stone-50 border border-stone-100 rounded-3xl p-8">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Linked Sources</h3>
              <div className="space-y-4">
                 <button className="w-full p-4 bg-white border border-stone-100 rounded-2xl text-xs font-bold text-stone-400 border-dashed hover:text-stone-600 transition-all">+ PDF / Document</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePageEditor;
