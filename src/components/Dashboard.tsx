import { motion } from 'motion/react';
import { CVAnalysis } from '../types';
import { BookOpen, Award, GraduationCap, Briefcase, ChevronRight, Network, ArrowLeft } from 'lucide-react';
import ThemeCard from './ThemeCard';
import Timeline from './Timeline';
import CitationMap from './CitationMap';

interface DashboardProps {
  data: CVAnalysis;
  cvText: string;
  onReset: () => void;
}

export default function Dashboard({ data, cvText, onReset }: DashboardProps) {
  return (
    <div className="min-h-screen bg-bg">
      <main className="p-8 lg:p-12 max-w-5xl mx-auto w-full">
        {/* Navigation */}
        <nav className="mb-12">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-ink transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            Back to start
          </button>
        </nav>

        {/* Header */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <span className="col-header">Scholar Profile</span>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold tracking-tight leading-none">
              {data.name}
            </h1>
            <p className="text-xl font-mono text-slate-500">{data.title}</p>
            <div className="h-px bg-line w-full my-8" />
            <p className="text-lg max-w-3xl leading-relaxed text-slate-600">
              {data.summary}
            </p>
          </motion.div>
        </header>

        {/* Interactive Map */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="col-header">Interactive Map</h2>
            <span className="text-xs font-mono opacity-40">01 — NETWORK ANALYSIS</span>
          </div>
          <CitationMap data={data.graph} />
          <p className="mt-4 text-xs font-mono opacity-40 italic">
            * This graph represents the conceptual and collaborative network extracted from your research output.
          </p>
        </section>

        {/* Research Themes Bento Grid */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="col-header">Research Pillars</h2>
            <span className="text-xs font-mono opacity-40">02 — CORE THEMES</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.themes.map((theme, idx) => (
              <ThemeCard key={idx} theme={theme} index={idx} />
            ))}
          </div>
        </section>

        {/* Timeline */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-16 mb-20">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="col-header">Career Path</h2>
              <span className="text-xs font-mono opacity-40">03 — TIMELINE</span>
            </div>
            <Timeline events={data.timeline} />
          </section>
        </div>

        {/* Publications */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="col-header">Selected Publications</h2>
            <span className="text-xs font-mono opacity-40">04 — OUTPUT</span>
          </div>
          <div className="border-t border-line">
            {data.publications.map((pub, idx) => (
              <div key={idx} className="data-row py-6 px-4 group">
                <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_120px] gap-4 items-start">
                  <span className="data-value text-slate-400">{pub.year}</span>
                  <div className="flex flex-col gap-1">
                    {pub.doi ? (
                      <a 
                        href={pub.doi} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lg font-semibold group-hover:text-accent transition-colors hover:underline decoration-accent/30 underline-offset-4"
                      >
                        {pub.title}
                      </a>
                    ) : (
                      <h4 className="text-lg font-semibold group-hover:text-accent transition-colors">{pub.title}</h4>
                    )}
                    <p className="text-sm text-slate-500 italic">{pub.authors}</p>
                    <p className="text-xs font-mono mt-2 text-slate-400 uppercase tracking-wider">{pub.venue}</p>
                    {pub.impact && (
                      <p className="text-sm mt-3 border-l-2 border-line pl-4 text-slate-600">
                        {pub.impact}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
