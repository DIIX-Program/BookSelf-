
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, KnowledgePage } from '../types';

interface Props {
  books: Book[];
  allPages: Record<string, KnowledgePage>;
  t: (k: string) => string;
  onCreateBook: () => string;
}

const Dashboard: React.FC<Props> = ({ books, allPages, t, onCreateBook }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-10 py-16">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-20">
        <div>
          <h1 className="serif text-6xl font-bold text-stone-900 mb-4">{t('nav_dash')}</h1>
          <p className="text-stone-500 font-medium text-lg italic">{t('lib_collections')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-full sm:w-96">
            <input 
              type="text" 
              placeholder={t('dash_search_placeholder')}
              className="w-full pl-12 pr-6 py-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-stone-100 transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-4 top-4 w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button 
            onClick={() => {
              const id = onCreateBook();
              navigate(`/book/${id}`);
            }}
            className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 text-sm whitespace-nowrap"
          >
            {t('btn_create_book')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {filteredBooks.map(book => (
          <div 
            key={book.id}
            onClick={() => navigate(`/book/${book.id}`)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] bg-stone-800 rounded-3xl overflow-hidden book-shadow transition-all duration-500 group-hover:-translate-y-3 mb-6">
              {book.coverImage ? (
                <img src={book.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 opacity-90" />
              )}
              <div className="absolute inset-x-0 bottom-0 p-8 z-10">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">{book.owner}</p>
                <h3 className="serif text-2xl font-bold text-white leading-tight group-hover:text-stone-100 transition-colors">{book.title}</h3>
              </div>
              <div className="absolute top-4 right-4 z-10">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </div>
            <div className="px-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                  {book.chapters.length} {t('label_chapters')}
                </span>
                <span>{book.likes} Likes</span>
              </div>
            </div>
          </div>
        ))}
        
        <div 
          onClick={() => {
            const id = onCreateBook();
            navigate(`/book/${id}`);
          }}
          className="aspect-[3/4] border-2 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center gap-4 text-stone-300 hover:text-stone-500 hover:border-stone-400 hover:bg-white transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{t('btn_create_book')}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
