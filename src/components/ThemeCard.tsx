import { motion } from 'motion/react';
import { ResearchTheme } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ThemeCardProps {
  theme: ResearchTheme;
  index: number;
}

export default function ThemeCard({ theme, index }: ThemeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white border border-line p-8 rounded-2xl hover:border-accent/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <span className="data-value text-xs text-slate-400">
          THEME_{String(index + 1).padStart(2, '0')}
        </span>
        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-accent transition-colors" />
      </div>
      
      <h3 className="text-2xl font-serif font-bold mb-4 leading-tight text-slate-900">
        {theme.title}
      </h3>
      
      <p className="text-sm leading-relaxed text-slate-500 mb-8 flex-grow">
        {theme.description}
      </p>

      <div className="space-y-4">
        <div>
          <h4 className="col-header text-[9px] mb-2">Key Contributions</h4>
          <ul className="space-y-1">
            {theme.keyContributions.slice(0, 3).map((item, i) => (
              <li key={i} className="text-xs font-mono text-slate-600 flex gap-2 items-start">
                <span className="text-accent/40">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
