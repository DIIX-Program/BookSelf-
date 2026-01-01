
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Book, KnowledgePage, UnderstandingLevel, UserProfile } from './types';
import { translations } from './translations';
import { INITIAL_BOOK_PAGES, DEMO_USER } from './constants';
import Dashboard from './components/Dashboard';
import BookView from './components/BookView';
import KnowledgePageEditor from './components/KnowledgePageEditor';
import RoadmapView from './components/RoadmapView';
import CommunityLibrary from './components/CommunityLibrary';
import LandingPage from './components/LandingPage';
import ProfileSetup from './components/ProfileSetup';
import EditProfile from './components/EditProfile';

const App: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'vi'>('vi');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  const [books, setBooks] = useState<Book[]>([{
    id: 'b1',
    owner: DEMO_USER.name,
    title: DEMO_USER.bookTitle,
    description: DEMO_USER.description,
    chapters: [
      { id: 'c1', title: 'Biology Basics', bookId: 'b1', lessonIds: ['1', '2'] },
      { id: 'c2', title: 'Ecology', bookId: 'b1', lessonIds: ['3'] }
    ],
    isPublic: true,
    allowCloning: true,
    likes: 12
  }]);

  const [allPages, setAllPages] = useState<Record<string, KnowledgePage>>(() => {
    const initial: Record<string, KnowledgePage> = {};
    INITIAL_BOOK_PAGES.forEach(p => {
      initial[p.id] = { ...p, retention: 100 };
    });
    return initial;
  });

  // Memory decay simulation
  useEffect(() => {
    if (!currentUser || !currentUser.isSetupComplete) return;
    const interval = setInterval(() => {
      setAllPages(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          const page = next[id];
          const lastUpdate = new Date(page.lastUpdated).getTime();
          const hoursSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60);
          const decay = Math.floor(hoursSinceUpdate * 0.166);
          next[id] = { ...page, retention: Math.max(1, 100 - decay) };
        });
        return next;
      });
    }, 10000); 
    return () => clearInterval(interval);
  }, [currentUser]);

  const t = (key: string) => (translations[language] as any)[key] || key;

  const updatePage = (page: KnowledgePage) => {
    setAllPages(prev => ({ ...prev, [page.id]: page }));
  };

  const createBook = () => {
    const id = `b_${Math.random().toString(36).substr(2, 9)}`;
    const newBook: Book = {
      id,
      owner: currentUser?.username || 'anonymous',
      ownerDisplayName: currentUser?.displayName,
      title: language === 'vi' ? 'Sách chưa đặt tên' : 'Untitled Book',
      description: '...',
      chapters: [],
      isPublic: false,
      allowCloning: false,
      likes: 0
    };
    setBooks([...books, newBook]);
    return id;
  };

  const handleAuth = () => {
    // Simulated Google Auth - triggers user state but not setup completion
    const mockUser: UserProfile = {
      uid: 'u123',
      email: 'learner@example.com',
      username: '',
      displayName: 'Alex Rivera',
      photoURL: '',
      isSetupComplete: false
    };
    setCurrentUser(mockUser);
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setCurrentUser(profile);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#fafaf9] selection:bg-stone-200">
        <Navigation 
          language={language} 
          onLanguageChange={setLanguage} 
          t={t} 
          user={currentUser} 
          onLogout={() => setCurrentUser(null)}
          onLogin={handleAuth}
        />
        
        <main className="flex-grow">
          {/* 
            STRICT ROUTING LOGIC:
            1. If no user: Only Landing Page is accessible.
            2. If user exists but setup not complete: Only Profile Setup is shown.
            3. If user exists and setup complete: Internal pages are accessible.
          */}
          {!currentUser ? (
            <Routes>
              <Route path="/" element={<LandingPage t={t} language={language} onStart={handleAuth} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          ) : !currentUser.isSetupComplete ? (
            <div className="min-h-[80vh] flex items-center justify-center">
              <ProfileSetup 
                user={currentUser} 
                onComplete={handleProfileComplete} 
                t={t} 
              />
            </div>
          ) : (
            <Routes>
              <Route path="/dashboard" element={<Dashboard books={books} allPages={allPages} t={t} onCreateBook={createBook} />} />
              <Route path="/book/:bookId" element={<BookView books={books} allPages={allPages} setBooks={setBooks} t={t} />} />
              <Route path="/page/:id" element={<KnowledgePageEditor allPages={allPages} onUpdate={updatePage} t={t} books={books} />} />
              <Route path="/roadmaps" element={<RoadmapView t={t} allPages={allPages} />} />
              <Route path="/community" element={<CommunityLibrary t={t} onClone={(b) => setBooks([...books, { ...b, id: `cloned_${b.id}`, owner: currentUser.username }])} />} />
              <Route path="/profile" element={<EditProfile user={currentUser} onUpdate={setCurrentUser} t={t} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </main>

        <footer className="py-12 border-t border-stone-200 bg-white text-stone-400 text-[10px] text-center uppercase tracking-[0.2em] font-medium">
          {language === 'vi' ? 'BOOKSELF+ — Mỗi người học là một cuốn sách sống' : 'BOOKSELF+ — Every learner is a living book'}
        </footer>
      </div>
    </HashRouter>
  );
};

// Fixed Navigation component to accept onLogin prop and fix reference error
const Navigation: React.FC<{ 
  language: string, 
  onLanguageChange: (l: 'en' | 'vi') => void, 
  t: (k: string) => string,
  user: UserProfile | null,
  onLogout: () => void,
  onLogin: () => void
}> = ({ language, onLanguageChange, t, user, onLogout, onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-10 py-5 flex items-center justify-between">
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center shadow-lg shadow-stone-200 group-hover:rotate-6 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span className="serif font-bold text-2xl tracking-tighter text-stone-900 uppercase">BOOKSELF+</span>
      </div>

      {user && user.isSetupComplete && (
        <div className="hidden md:flex gap-12 text-sm font-semibold text-stone-400">
          <Link to="/dashboard" className={`hover:text-stone-900 transition-colors ${location.pathname === '/dashboard' ? 'text-stone-900' : ''}`}>{t('nav_dash')}</Link>
          <Link to="/roadmaps" className={`hover:text-stone-900 transition-colors ${location.pathname === '/roadmaps' ? 'text-stone-900' : ''}`}>{t('nav_road')}</Link>
          <Link to="/community" className={`hover:text-stone-900 transition-colors ${location.pathname === '/community' ? 'text-stone-900' : ''}`}>{t('nav_community')}</Link>
        </div>
      )}

      <div className="flex items-center gap-6">
        <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
          <button 
            onClick={() => onLanguageChange('en')} 
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${language === 'en' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}
          >EN</button>
          <button 
            onClick={() => onLanguageChange('vi')} 
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${language === 'vi' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}
          >VI</button>
        </div>
        
        {user && user.isSetupComplete ? (
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 border border-stone-100 hover:border-stone-400 transition-all overflow-hidden"
            >
              {user.photoURL ? <img src={user.photoURL} alt="User" /> : <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-stone-100 rounded-[24px] shadow-2xl py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="px-6 py-4 border-b border-stone-50">
                   <p className="font-bold text-stone-900 text-sm truncate">{user.displayName}</p>
                   <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">@{user.username}</p>
                </div>
                <div className="py-2">
                   <button 
                    onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                    className="w-full text-left px-6 py-3 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                   >
                     {t('profile_menu_edit')}
                   </button>
                   <button 
                    onClick={() => { onLogout(); setIsMenuOpen(false); navigate('/'); }}
                    className="w-full text-left px-6 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                   >
                     {t('profile_menu_logout')}
                   </button>
                </div>
              </div>
            )}
          </div>
        ) : user ? (
          /* User is logged in but doing setup */
          <button 
            onClick={() => { onLogout(); navigate('/'); }}
            className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-700"
          >
            {language === 'vi' ? 'Hủy thiết lập' : 'Cancel Setup'}
          </button>
        ) : (
          /* Not logged in */
          <button 
            onClick={() => onLogin()}
            className="text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-stone-900"
          >
            {t('landing_cta_signin')}
          </button>
        )}
      </div>
    </nav>
  );
};

export default App;
