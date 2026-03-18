'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils';
import ReactMarkdown from 'react-markdown';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  agentAvatar?: string;
  agentName?: string;
  agentTheme?: string;
}

export function MessageBubble({
  message,
  agentAvatar = '🤖',
  agentName = 'Assistant',
  agentTheme = 'bg-gray-500',
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isLoader = message.id === 'loading';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'w-full py-6 px-4 md:px-0 flex justify-center border-b border-[var(--border)]/30',
        isUser ? 'bg-[var(--bg)]' : 'bg-[var(--card)]/30'
      )}
    >
      <div className="w-full max-w-3xl flex gap-4 md:gap-6">
        {/* Avatar Area */}
        <div className="shrink-0 flex flex-col items-center">
          <div
            className={cn(
              'w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base border border-[var(--border)]/50',
              isUser
                ? 'bg-[var(--bg-2)] text-[var(--accent)]'
                : `${agentTheme} bg-opacity-20 text-white shadow-sm ring-1 ring-inset ring-white/10`
            )}
            style={{
              backgroundColor: isUser
                ? undefined
                : `color-mix(in srgb, var(--bg) 80%, currentColor)`,
            }}
          >
            {isUser ? '👤' : <span>{agentAvatar}</span>}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col pt-1">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide">
            <span
              className={
                isUser
                  ? 'text-[var(--text)] text-opacity-80'
                  : 'text-[var(--text)]'
              }
            >
              {isUser ? 'You' : agentName}
            </span>
          </div>

          <div
            className={cn(
              'prose prose-sm md:prose-base dark:prose-invert max-w-none text-[var(--text)] leading-relaxed',
              'prose-p:mt-0 prose-p:mb-4 last:prose-p:mb-0',
              'prose-pre:bg-[var(--bg-2)] prose-pre:border prose-pre:border-[var(--border)]',
              'prose-code:text-[var(--accent-2)] prose-code:bg-[var(--bg-2)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md',
              isLoader && 'animate-pulse mt-1'
            )}
          >
            {isLoader ? (
              <div className="flex gap-1.5 items-center h-5">
                <span
                  className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
