
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KnowledgePage, UnderstandingLevel } from '../types';

interface Props {
  pages: KnowledgePage[];
}

const Roadmap: React.FC<Props> = ({ pages }) => {
  const navigate = useNavigate();
  const debtPages = pages.filter(p => p.understanding !== UnderstandingLevel.WELL_UNDERSTOOD);
  const masteredPages = pages.filter(p => p.understanding === UnderstandingLevel.WELL_UNDERSTOOD);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <h1 className="serif text-5xl font-bold text-stone-900 mb-4">Your Learning Roadmap</h1>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto">
          Before exploring new chapters, solidify the ink on these existing pages. 
          Focus on addressing the "blurred" concepts identified by AI.
        </p>
      </header>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="serif text-2xl font-bold text-rose-800">Review Required</h2>
            <div className="h-px bg-rose-200 flex-grow"></div>
          </div>
          
          <div className="space-y-6">
            {debtPages.length === 0 ? (
              <div className="bg-stone-100 p-8 rounded-xl text-center text-stone-500">
                No major learning debt identified. You are ready for new concepts.
              </div>
            ) : (
              debtPages.map((page, idx) => (
                <div 
                  key={page.id}
                  onClick={() => navigate(`/page/${page.id}`)}
                  className="relative flex items-start gap-8 group cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold serif text-xl ${page.understanding === UnderstandingLevel.NEEDS_REVIEW ? 'bg-rose-100 text-rose-800 border-2 border-rose-300' : 'bg-amber-100 text-amber-800 border-2 border-amber-300'}`}>
                      {idx + 1}
                    </div>
                    {idx < debtPages.length - 1 && <div className="w-0.5 h-24 bg-stone-200 my-2"></div>}
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 book-shadow flex-grow group-hover:border-stone-400 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="serif text-2xl font-bold text-stone-900">{page.title}</h3>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${page.understanding === UnderstandingLevel.NEEDS_REVIEW ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                        {page.understanding.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-stone-500 text-sm mb-4 line-clamp-2">{page.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {page.feedback?.gaps.map((gap, i) => (
                        <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded-full border border-stone-200">
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="pt-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="serif text-2xl font-bold text-emerald-800">Mastered Foundations</h2>
            <div className="h-px bg-emerald-200 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {masteredPages.map(page => (
              <div 
                key={page.id}
                onClick={() => navigate(`/page/${page.id}`)}
                className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center cursor-pointer hover:bg-emerald-50 transition-colors"
              >
                <div>
                  <h4 className="serif font-bold text-emerald-900">{page.title}</h4>
                  <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">Solid Ink</p>
                </div>
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Roadmap;
