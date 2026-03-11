export interface ResearchTheme {
  title: string;
  description: string;
  keyContributions: string[];
  relatedPublications: string[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  institution: string;
  description: string;
  type: 'education' | 'experience' | 'award';
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  impact: string;
  doi?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'paper' | 'concept' | 'institution' | 'author' | 'presentation';
  details?: {
    abstract?: string;
    tldr?: string;
  };
}

export interface GraphLink {
  source: string;
  target: string;
  relationship: string;
}

export interface CVAnalysis {
  name: string;
  title: string;
  summary: string;
  themes: ResearchTheme[];
  timeline: TimelineEvent[];
  publications: Publication[];
  skills: string[];
  graph: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
}
