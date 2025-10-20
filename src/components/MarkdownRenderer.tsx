'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Filter out "Image Sources" sections and similar content
  const cleanContent = content
    .replace(/#{1,6}\s*Image Sources?:?\s*[\s\S]*?(?=\n#{1,6}|\n\n---|\n\n\*\*|$)/gi, '')
    .replace(/\*\*Image Sources?:?\*\*[\s\S]*?(?=\n#{1,6}|\n\n---|\n\n\*\*|$)/gi, '')
    .replace(/Image Sources?:?\s*\n[\s\S]*?(?=\n#{1,6}|\n\n---|\n\n\*\*|$)/gi, '');

  return (
    <div className={`markdown-content prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize heading styles - clean and simple
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 leading-tight border-b-2 border-blue-600 pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 leading-tight border-l-4 border-blue-600 pl-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 mt-5 first:mt-0 leading-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 mt-4 first:mt-0 leading-tight">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 mt-3 first:mt-0 leading-tight">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-semibold text-gray-900 mb-2 mt-2 first:mt-0 leading-tight">
              {children}
            </h6>
          ),
          
          // Enhanced paragraph styles - clean and simple
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4 last:mb-0 text-base">
              {children}
            </p>
          ),
          
          // Enhanced list styles - clean and simple
          ul: ({ children }) => (
            <ul className="list-none mb-4 space-y-2 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-none mb-4 space-y-2 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start text-gray-700 text-base leading-relaxed pl-1">
              <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          
          // Enhanced link styles
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Enhanced text formatting
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 bg-yellow-100 px-1 py-0.5 rounded">
              {children}
            </strong>
          ),
          
          em: ({ children }) => (
            <em className="italic text-gray-800 bg-blue-50 px-1 py-0.5 rounded">
              {children}
            </em>
          ),
          
          // Enhanced blockquote styles - clean and simple
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-600 pl-6 py-3 my-4 bg-blue-50/50 text-gray-800 italic text-base">
              {children}
            </blockquote>
          ),
          
          // Enhanced code styles
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-mono text-gray-800 border border-gray-200">
                  {children}
                </code>
              );
            }
            return (
              <div className="my-4 sm:my-6 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gray-800 text-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium flex items-center">
                  <div className="flex space-x-1.5 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="ml-2 sm:ml-4">Code</span>
                </div>
                <code className={`${className} block bg-gray-900 p-3 sm:p-4 text-xs sm:text-sm font-mono text-gray-100 overflow-x-auto`}>
                  {children}
                </code>
              </div>
            );
          },
          
          // Enhanced table styles
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 sm:my-6 lg:my-8 rounded-lg shadow-lg border border-gray-200">
              <table className="min-w-full bg-white">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-blue-50 transition-colors duration-200">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-gray-700">
              {children}
            </td>
          ),
          
          // Enhanced horizontal rule
          hr: () => (
            <div className="my-4 sm:my-6 lg:my-8 flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <div className="mx-2 sm:mx-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
          ),
          
          // Hide inline images (we show them in gallery preview instead)
          img: () => null,
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}
