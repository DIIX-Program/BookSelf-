
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, KnowledgePage, UnderstandingLevel } from '../types';

interface Props {
  books: Book[];
  allPages: Record<string, KnowledgePage>;
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  t: (k: string) => string;
}

const BookView: React.FC<Props> = ({ books, allPages, setBooks, t }) => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const book = books.find(b => b.id === bookId);

  if (!book) return <div className="p-20 text-center text-stone-400">Book not found.</div>;

  const handleAddChapter = () => {
    const newChapter = {
      id: `c_${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Chapter',
      bookId: book.id,
      lessonIds: []
    };
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, chapters: [...b.chapters, newChapter] } : b));
  };

  const handleAddLesson = (chapterId: string) => {
    const lessonId = `l_${Math.random().toString(36).substr(2, 9)}`;
    // In a real app we'd add it to allPages first, then to the chapter
    navigate(`/page/${lessonId}?bookId=${book.id}&chapterId=${chapterId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <div className="flex items-start gap-12 mb-20">
        <div className="w-48 h-64 bg-stone-900 rounded-2xl shadow-2xl relative overflow-hidden flex-shrink-0">
          {book.coverImage && <img src={book.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-60" />}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <h1 className="serif text-2xl font-bold text-white leading-tight">{book.title}</h1>
          </div>
        </div>
        <div className="flex-grow pt-4">
          <div className="flex items-center justify-between mb-4">
             <h1 className="serif text-5xl font-bold text-stone-900">{book.title}</h1>
             <div className="flex gap-2">
                <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
             </div>
          </div>
          <p className="text-xl text-stone-500 italic mb-8 max-w-2xl">"{book.description}"</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('label_memory_debt')}:</span>
              <div className="w-32 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-900" style={{ width: '45%' }} />
              </div>
            </div>
            <button onClick={handleAddChapter} className="text-xs font-bold text-stone-800 underline uppercase tracking-widest">+ {t('label_chapters')}</button>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {book.chapters.map((chapter, cIdx) => (
          <section key={chapter.id} className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold serif">{cIdx + 1}</div>
              <h2 className="serif text-3xl font-bold text-stone-900">{chapter.title}</h2>
              <div className="h-px bg-stone-100 flex-grow" />
              <button onClick={() => handleAddLesson(chapter.id)} className="text-[10px] font-bold text-stone-400 hover:text-stone-900 transition-all uppercase tracking-widest">+ {t('label_lessons')}</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-14">
              {chapter.lessonIds.map(lessonId => {
                const page = allPages[lessonId];
                if (!page) return null;
                return (
                  <div 
                    key={lessonId} 
                    onClick={() => navigate(`/page/${lessonId}`)}
                    className="bg-white p-6 rounded-2xl border border-stone-200 book-shadow hover:scale-[1.02] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                       <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${page.retention < 60 ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                         {t('label_retention')}: {page.retention}%
                       </span>
                       <span className="text-stone-400 text-[9px] font-bold uppercase">{page.lastUpdated}</span>
                    </div>
                    <h3 className="serif text-xl font-bold text-stone-900 group-hover:text-stone-700 transition-colors">{page.title}</h3>
                    <p className="mt-2 text-sm text-stone-500 line-clamp-2 leading-relaxed">{page.content}</p>
                  </div>
                );
              })}
              {chapter.lessonIds.length === 0 && (
                <div className="col-span-full py-8 text-center text-stone-300 italic text-sm border-2 border-dashed border-stone-100 rounded-2xl">
                   No lessons in this chapter yet.
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default BookView;
