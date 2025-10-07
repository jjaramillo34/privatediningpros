'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize heading styles with better hierarchy
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 mt-6 sm:mt-8 first:mt-0 leading-tight border-b-2 border-blue-200 pb-2 sm:pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-5 mt-5 sm:mt-7 first:mt-0 leading-tight flex items-center">
              <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-2 sm:mr-4 flex-shrink-0"></div>
              <span className="flex-1">{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 mt-4 sm:mt-6 first:mt-0 leading-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 mt-3 sm:mt-5 first:mt-0 leading-tight">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 mt-3 sm:mt-4 first:mt-0 leading-tight">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 mt-2 sm:mt-3 first:mt-0 leading-tight">
              {children}
            </h6>
          ),
          
          // Enhanced paragraph styles
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 last:mb-0 text-base sm:text-lg">
              {children}
            </p>
          ),
          
          // Enhanced list styles
          ul: ({ children }) => (
            <ul className="list-none mb-4 sm:mb-6 space-y-2 sm:space-y-3 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-none mb-4 sm:mb-6 space-y-2 sm:space-y-3 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start text-gray-700 text-base sm:text-lg leading-relaxed">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3 mt-2 sm:mt-3 flex-shrink-0"></div>
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
          
          // Enhanced blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gradient-to-b from-blue-500 to-indigo-600 pl-3 sm:pl-6 py-3 sm:py-4 my-4 sm:my-6 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 italic rounded-r-lg shadow-sm">
              <div className="flex items-start">
                <div className="text-lg sm:text-2xl text-blue-600 mr-2 sm:mr-3 mt-1 flex-shrink-0">"</div>
                <div className="flex-1 text-sm sm:text-base lg:text-lg leading-relaxed">{children}</div>
                <div className="text-lg sm:text-2xl text-blue-600 ml-2 sm:ml-3 mt-1 flex-shrink-0">"</div>
              </div>
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
          
          // Enhanced image styles with mobile horizontal gallery
          img: ({ src, alt, key }) => (
            <div className="my-3 sm:my-4 lg:my-6">
              {/* Mobile: Horizontal scrollable gallery */}
              <div className="block sm:hidden">
                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white">
                    <div className="relative group">
                      <img 
                        src={String(src || '')} 
                        alt={String(alt || '')} 
                        key={String(key || '')} 
                        className="w-full h-48 object-cover transition-all duration-300 group-active:scale-105 group-active:brightness-110" 
                        loading="lazy"
                      />
                      {/* Mobile tap indicator */}
                      <div className="absolute inset-0 bg-black/0 group-active:bg-black/10 transition-all duration-200 flex items-center justify-center opacity-0 group-active:opacity-100">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {alt && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 text-xs text-gray-600 italic border-t border-gray-200">
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="leading-relaxed truncate">{alt}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Desktop: Full-width image */}
              <div className="hidden sm:block rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg lg:shadow-xl border border-gray-200 bg-white">
                <div className="relative group">
                  <img 
                    src={String(src || '')} 
                    alt={String(alt || '')} 
                    key={String(key || '')} 
                    className="w-full h-auto object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110" 
                    loading="lazy"
                    style={{
                      maxHeight: '60vh',
                      minHeight: '200px'
                    }}
                  />
                  {/* Desktop hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
                {alt && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 italic border-t border-gray-200">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="leading-relaxed">{alt}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
