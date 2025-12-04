import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sprout, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { GroundingSources } from './GroundingSources';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'} mb-6 group`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm
          ${isModel ? 'bg-gradient-to-br from-green-600 to-emerald-400 text-white' : 'bg-slate-200 text-slate-600'}
        `}>
          {isModel ? <Sprout size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div className={`
          flex flex-col p-4 rounded-2xl shadow-sm text-sm leading-relaxed
          ${isModel 
            ? 'bg-white border border-green-50 text-slate-800 rounded-tl-none' 
            : 'bg-green-600 text-white rounded-tr-none'
          }
          ${message.isError ? 'border-red-300 bg-red-50 text-red-800' : ''}
        `}>
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                a: ({node, ...props}) => {
                  let href = props.href || '';
                  // Fix missing protocol to ensure links open
                  if (href && !href.startsWith('http') && !href.startsWith('mailto')) {
                     href = `https://${href}`;
                  }
                  return (
                    <a 
                      className="text-green-600 font-bold underline decoration-green-300 underline-offset-2 hover:text-green-800 transition-colors cursor-pointer" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      {...props} 
                      href={href} 
                    />
                  );
                },
                table: ({node, ...props}) => <div className="overflow-x-auto my-2"><table className="min-w-full divide-y divide-slate-200 border border-slate-200" {...props} /></div>,
                th: ({node, ...props}) => <th className="px-3 py-2 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-r-0" {...props} />,
                td: ({node, ...props}) => <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 last:border-r-0 border-t" {...props} />
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>

          {/* Grounding Sources (Only for Model) */}
          {isModel && message.groundingChunks && (
            <GroundingSources chunks={message.groundingChunks} />
          )}
        </div>
      </div>
    </div>
  );
};