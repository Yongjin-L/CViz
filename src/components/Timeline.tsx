import { TimelineEvent } from '../types';
import { GraduationCap, Briefcase, Award } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'education': return <GraduationCap className="w-4 h-4" />;
      case 'experience': return <Briefcase className="w-4 h-4" />;
      case 'award': return <Award className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="relative pl-8 border-l border-line space-y-12">
      {events.map((event, idx) => (
        <div key={idx} className="relative">
          {/* Dot */}
          <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-white border border-line flex items-center justify-center z-10 text-slate-400">
            {getIcon(event.type)}
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="data-value text-xs text-slate-400">{event.year}</span>
            <h4 className="text-lg font-bold leading-tight text-slate-900">{event.title}</h4>
            <p className="text-sm text-slate-500 italic">{event.institution}</p>
            {event.description && (
              <p className="text-sm mt-2 text-slate-600 leading-relaxed max-w-xl">
                {event.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
