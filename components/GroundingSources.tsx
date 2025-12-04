import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { GroundingChunk } from '../types';

interface GroundingSourcesProps {
  chunks: GroundingChunk[];
}

export const GroundingSources: React.FC<GroundingSourcesProps> = ({ chunks }) => {
  // Filter out chunks that don't have web data
  const webSources = chunks.filter((chunk) => chunk.web?.uri && chunk.web?.title);

  if (webSources.length === 0) return null;

  // Deduplicate sources by URI
  const uniqueSources: GroundingChunk[] = Array.from(new Map(webSources.map(item => [item.web!.uri, item])).values());

  return (
    <div className="mt-3 pt-3 border-t border-green-100 text-xs">
      <div className="flex items-center gap-1.5 text-green-700 mb-2 font-medium">
        <Globe size={12} />
        <span>Sources & Product Links</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {uniqueSources.map((source, index) => (
          <a
            key={index}
            href={source.web?.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-white hover:bg-green-50 text-slate-600 hover:text-green-700 px-2 py-1 rounded-md border border-slate-200 transition-colors shadow-sm"
          >
            <span className="truncate max-w-[150px]">{source.web?.title}</span>
            <ExternalLink size={10} />
          </a>
        ))}
      </div>
    </div>
  );
};