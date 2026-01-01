
import React, { useState } from 'react';
import { Book } from '../types';

interface Props {
  t: (k: string) => string;
  onClone: (book: Book) => void;
}

const PUBLIC_BOOKS: Book[] = [
  { id: 'p1', owner: 'Sarah Chen', title: 'Molecular Gastronomy', description: 'The science behind high-end cooking techniques.', chapters: [], isPublic: true, allowCloning: true, likes: 245 },
  { id: 'p2', owner: 'Marc Andreessen', title: 'Venture Capital 101', description: 'Personal notes on identifying market shifts.', chapters: [], isPublic: true, allowCloning: false, likes: 1890 },
  { id: 'p3', owner: 'Elena Vu', title: 'Linguistics of SE Asia', description: 'A deep dive into tonal language evolution.', chapters: [], isPublic: true, allowCloning: true, likes: 56 }
];

const CommunityLibrary: React.FC<Props> = ({ t, onClone }) => {
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <header className="mb-16">
        <h1 className="serif text-6xl font-bold text-stone-900 mb-6">{t('nav_community')}</h1>
        <div className="flex items-center gap-6">
          <div className="relative flex-grow max-w-2xl">
            <input 
              type="text" 
              className="w-full pl-12 pr-6 py-4 bg-white border border-stone-200 rounded-3xl outline-none focus:ring-4 focus:ring-stone-100 transition-all font-medium"
              placeholder="Search shared wisdom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-4 top-4 w-6 h-6 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {PUBLIC_BOOKS.map(book => (
          <div key={book.id} className="group bg-white border border-stone-200 rounded-[40px] p-10 book-shadow hover:-translate-y-2 transition-all duration-500">
             <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 font-bold text-xs uppercase">{book.owner.charAt(0)}</div>
                   <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{book.owner}</span>
                </div>
                <div className="flex items-center gap-1 text-rose-500">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                   <span className="text-[10px] font-bold">{book.likes}</span>
                </div>
             </div>
             <h2 className="serif text-3xl font-bold text-stone-900 mb-4 group-hover:text-stone-700 transition-colors">{book.title}</h2>
             <p className="text-stone-500 text-sm leading-relaxed mb-10 italic">"{book.description}"</p>
             <div className="flex items-center justify-between pt-8 border-t border-stone-50">
                <button className="text-[10px] font-bold text-stone-900 uppercase tracking-[0.2em] underline underline-offset-8 decoration-stone-200 hover:decoration-stone-900 transition-all">Preview Book</button>
                {book.allowCloning && (
                  <button 
                    onClick={() => {
                      onClone(book);
                      alert('Book cloned to your library!');
                    }}
                    className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
                  >
                    {t('btn_clone')}
                  </button>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityLibrary;
