
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  t: (key: string) => string;
  onStart: () => void;
  // Added language to Props to fix the reference errors
  language: 'en' | 'vi';
}

const LandingPage: React.FC<Props> = ({ t, onStart, language }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    onStart();
    navigate('/dashboard');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-40 border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-stone-100 text-stone-500 text-[10px] font-bold rounded-full uppercase tracking-widest mb-10 animate-fade-in">
            {t('landing_benefits_1')}
          </span>
          <h1 className="serif text-7xl md:text-8xl font-medium text-stone-900 leading-tight mb-10 max-w-4xl mx-auto uppercase">
            BOOKSELF+
          </h1>
          <p className="text-xl text-stone-500 leading-relaxed mb-16 max-w-2xl mx-auto italic">
            "{t('landing_hero_subtitle')}"
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={handleStart}
              className="px-10 py-5 bg-stone-900 text-white rounded-2xl text-lg font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 flex items-center justify-center gap-3"
            >
              {t('landing_cta_start')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button className="px-10 py-5 bg-white border border-stone-200 text-stone-700 rounded-2xl text-lg font-bold hover:bg-stone-50 transition-all">
              {t('landing_cta_signin')}
            </button>
          </div>
        </div>
        
        {/* Visual Background Elements */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-stone-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-stone-100 rounded-full blur-[140px] opacity-40"></div>
      </section>

      {/* How it Works */}
      <section className="py-32 bg-[#fafaf9]">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-24">
            <h2 className="serif text-5xl font-bold text-stone-900 mb-6 uppercase">BOOKSELF+ PROCESS</h2>
            <div className="h-1 w-20 bg-stone-900 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(num => (
              <div key={num} className="group text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-bold serif text-stone-900 border border-stone-100 shadow-sm mx-auto mb-8 group-hover:-translate-y-2 transition-transform duration-500">
                  {num}
                </div>
                <h3 className="font-bold text-stone-900 mb-4 uppercase text-xs tracking-widest">{t(`landing_how_step${num}`)}</h3>
                <div className="w-8 h-0.5 bg-stone-200 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="py-40 bg-white">
        <div className="max-w-6xl mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative aspect-[4/5] bg-stone-900 rounded-[40px] shadow-2xl p-16 flex flex-col justify-end text-white overflow-hidden">
               <img 
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover opacity-30" 
                alt="Books"
               />
               <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4 inline-block">BOOKSELF+ PHILOSOPHY</span>
                  <h3 className="serif text-5xl font-bold leading-tight mb-8">{t('landing_benefits_title')}</h3>
                  <p className="text-white/70 text-lg leading-relaxed">{t('landing_hero_subtitle')}</p>
               </div>
            </div>
            
            <div className="space-y-16">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex gap-10">
                    <div className="flex-shrink-0 w-12 h-12 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-center text-stone-400">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                       </svg>
                    </div>
                    <div>
                       <h4 className="serif text-2xl font-bold text-stone-900 mb-3 uppercase tracking-tight">{t(`landing_benefits_${i}`)}</h4>
                       <p className="text-stone-500 leading-relaxed">
                         {i === 1 && "Master foundational concepts before moving forward."}
                         {i === 2 && "Feel prepared for complex subjects by tracking prerequisites."}
                         {i === 3 && "Let AI build a path customized to your unique goals."}
                       </p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sharing / Community CTA */}
      <section className="py-40 bg-stone-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-10">
          <h2 className="serif text-5xl font-bold mb-10 leading-tight uppercase">
            {language === 'vi' ? 'Chia sẻ kiến thức, nhân đôi trí tuệ.' : 'Shared wisdom is doubled wisdom.'}
          </h2>
          <p className="text-white/60 text-xl leading-relaxed mb-16 italic">
            {language === 'vi' 
              ? 'Tạo sách công khai, cho phép cộng đồng học hỏi và sao chép để phát triển thêm những trang kiến thức mới với BOOKSELF+.' 
              : 'Create public books, allow the community to learn and clone to develop new pages of knowledge with BOOKSELF+.'}
          </p>
          <button 
            onClick={handleStart}
            className="px-12 py-5 bg-white text-stone-900 rounded-2xl text-lg font-bold hover:bg-stone-50 transition-all shadow-2xl shadow-stone-800"
          >
            {t('landing_cta_start')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
