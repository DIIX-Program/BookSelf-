
import React, { useState } from 'react';
import { LearnerBook, Roadmap, UnderstandingLevel } from '../types';

interface Props {
  book: LearnerBook;
  onUpdate: (r: Roadmap) => void;
  t: (key: string) => string;
}

const RoadmapManager: React.FC<Props> = ({ book, onUpdate, t }) => {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(book.roadmaps[0]?.id || '');
  const roadmap = book.roadmaps.find(r => r.id === selectedRoadmapId) || book.roadmaps[0];

  const getProgress = (r: Roadmap) => {
    const pagesInRoadmap = book.pages.filter(p => r.pageIds.includes(p.id));
    if (pagesInRoadmap.length === 0) return 0;
    const mastered = pagesInRoadmap.filter(p => p.understanding === UnderstandingLevel.WELL_UNDERSTOOD).length;
    return Math.round((mastered / pagesInRoadmap.length) * 100);
  };

  const colors: Record<string, string> = {
    stone: 'bg-stone-900 border-stone-900',
    blue: 'bg-blue-600 border-blue-600',
    emerald: 'bg-emerald-600 border-emerald-600',
    rose: 'bg-rose-600 border-rose-600'
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="md:w-64 space-y-6">
          <h2 className="serif text-3xl font-bold text-stone-900">{t('road_title')}</h2>
          <div className="space-y-2">
            {book.roadmaps.map(r => (
              <button 
                key={r.id}
                onClick={() => setSelectedRoadmapId(r.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${selectedRoadmapId === r.id ? 'bg-white border-stone-200 shadow-sm font-bold text-stone-900' : 'bg-transparent border-transparent text-stone-500 hover:text-stone-900'}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors[r.colorTheme].split(' ')[0]}`}></div>
                  {r.name}
                </div>
              </button>
            ))}
            <button className="w-full text-left px-4 py-3 text-stone-400 hover:text-stone-600 text-sm italic font-medium">
              {t('road_new')}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow bg-white border border-stone-200 rounded-3xl p-10 book-shadow min-h-[500px]">
           {roadmap ? (
             <div className="space-y-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="serif text-4xl font-bold text-stone-900 mb-2">{roadmap.name}</h1>
                    <p className="text-stone-500 max-w-lg">{roadmap.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{t('road_completion')}</div>
                    <div className="text-4xl font-bold text-stone-900">{getProgress(roadmap)}%</div>
                  </div>
                </div>

                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                   <div 
                     className={`h-full transition-all duration-1000 ${colors[roadmap.colorTheme].split(' ')[0]}`} 
                     style={{ width: `${getProgress(roadmap)}%` }}
                   ></div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('road_sequence')}</h3>
                   <div className="space-y-4">
                      {roadmap.pageIds.map((pid, idx) => {
                        const page = book.pages.find(p => p.id === pid);
                        if (!page) return null;
                        return (
                          <div key={pid} className="flex items-center gap-6 group">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${page.understanding === UnderstandingLevel.WELL_UNDERSTOOD ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                                {idx + 1}
                             </div>
                             <div className="flex-grow p-4 bg-stone-50 rounded-2xl border border-transparent hover:border-stone-200 transition-all flex justify-between items-center">
                                <div>
                                  <h4 className="font-bold text-stone-900">{page.title}</h4>
                                  <p className="text-xs text-stone-400">{page.understanding.replace('_', ' ')}</p>
                                </div>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
           ) : null}
        </div>
      </div>
    </div>
  );
};

export default RoadmapManager;
