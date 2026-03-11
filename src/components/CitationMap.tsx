import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info } from 'lucide-react';

interface CitationMapProps {
  data: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
}

export default function CitationMap({ data }: CitationMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom behavior
    svg.call(d3.zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      }));

    const simulation = d3.forceSimulation<any>(data.nodes)
      .force('link', d3.forceLink<any, any>(data.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));

    // Drag behavior
    const drag = d3.drag<any, any>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const link = g.append('g')
      .attr('stroke', '#64748b') // slate-500
      .attr('stroke-opacity', 0.1)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', 1);

    const node = g.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('cursor', 'grab')
      .call(drag)
      .on('mouseenter', (event, d) => setHoveredNode(d))
      .on('mouseleave', () => setHoveredNode(null))
      .on('click', (event, d) => {
        event.stopPropagation(); // Prevent background click
        setSelectedNode(d);
        highlightPath(d);
      });

    // Background click to reset
    svg.on('click', () => {
      setSelectedNode(null);
      resetHighlight();
    });

    // Node circles
    node.append('circle')
      .attr('r', d => (d.type === 'paper' || d.type === 'presentation') ? 8 : 5)
      .attr('fill', d => {
        switch (d.type) {
          case 'paper': return '#0F172A'; // slate-900
          case 'presentation': return '#10B981'; // emerald-500
          case 'concept': return '#6366F1'; // indigo-500
          case 'institution': return '#F59E0B'; // amber-500
          case 'author': return '#64748B'; // slate-500
          default: return '#94A3B8'; // slate-400
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Node labels
    node.append('text')
      .attr('x', 12)
      .attr('y', 4)
      .text(d => d.label)
      .attr('font-size', '10px')
      .attr('font-family', 'var(--font-mono)')
      .attr('fill', '#475569') // slate-600
      .attr('opacity', 0.8)
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function resetHighlight() {
      node.transition().duration(300).attr('opacity', 1);
      link.transition().duration(300)
        .attr('stroke-opacity', 0.1)
        .attr('stroke-width', 1);
    }

    function highlightPath(d: GraphNode) {
      const connectedNodeIds = new Set<string>();
      connectedNodeIds.add(d.id);
      
      data.links.forEach(l => {
        const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
        
        if (sourceId === d.id) connectedNodeIds.add(targetId);
        if (targetId === d.id) connectedNodeIds.add(sourceId);
      });

      node.transition().duration(300)
        .attr('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.1);
      
      link.transition().duration(300)
        .attr('stroke-opacity', l => {
          const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
          const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
          return (sourceId === d.id || targetId === d.id) ? 0.8 : 0.05;
        })
        .attr('stroke-width', l => {
          const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).id;
          const targetId = typeof l.target === 'string' ? l.target : (l.target as any).id;
          return (sourceId === d.id || targetId === d.id) ? 2 : 1;
        });
    }

    return () => { simulation.stop(); };
  }, [data]);

  return (
    <div ref={containerRef} className="relative w-full bg-slate-50 border border-line rounded-2xl overflow-hidden h-[600px]">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#0F172A]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Paper</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Presentation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Concept</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Institution</span>
        </div>
      </div>

      {/* Hover Info Tooltip */}
      <AnimatePresence>
        {hoveredNode && !selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 lg:right-auto lg:w-80 bg-slate-900 text-white p-6 rounded-xl shadow-2xl z-20 pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{hoveredNode.type}</span>
            </div>
            <h4 className="text-xl font-serif font-bold mb-3">{hoveredNode.label}</h4>
            {hoveredNode.details?.tldr && (
              <p className="text-xs leading-relaxed text-slate-300 italic">
                "{hoveredNode.details.tldr}"
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Node Detail Overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute top-0 right-0 w-full md:w-96 h-full bg-white border-l border-line shadow-2xl z-30 p-8 overflow-y-auto"
          >
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <div className="mt-8 space-y-8">
              <div>
                <span className="col-header mb-2 block">{selectedNode.type}</span>
                <h3 className="text-3xl font-serif font-bold leading-tight text-slate-900">{selectedNode.label}</h3>
              </div>

              {selectedNode.details?.tldr && (
                <div className="bg-slate-50 p-6 rounded-xl border border-line">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">AI Summary (TL;DR)</h4>
                  <p className="text-sm italic leading-relaxed text-slate-600">"{selectedNode.details.tldr}"</p>
                </div>
              )}

              {selectedNode.details?.abstract && (
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">Context & Impact</h4>
                  <p className="text-sm leading-relaxed text-slate-600">{selectedNode.details.abstract}</p>
                </div>
              )}

              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4">Related Connections</h4>
                <div className="space-y-3">
                  {data.links
                    .filter(l => {
                      const sId = typeof l.source === 'string' ? l.source : (l.source as any).id;
                      const tId = typeof l.target === 'string' ? l.target : (l.target as any).id;
                      return sId === selectedNode.id || tId === selectedNode.id;
                    })
                    .map((link, i) => {
                      const sId = typeof link.source === 'string' ? link.source : (link.source as any).id;
                      const otherNodeId = sId === selectedNode.id 
                        ? (typeof link.target === 'string' ? link.target : (link.target as any).id)
                        : sId;
                      const otherNode = data.nodes.find(n => n.id === otherNodeId);
                      
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-line hover:border-accent/20 transition-all">
                          <Info className="w-4 h-4 text-slate-300" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono uppercase text-slate-400">{link.relationship}</span>
                            <span className="text-xs font-semibold text-slate-700">{otherNode?.label}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
