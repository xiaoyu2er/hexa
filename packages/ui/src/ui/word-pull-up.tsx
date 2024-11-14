'use client';

import { type Variants, motion } from 'framer-motion';

import { cn } from '@hexa/utils';

interface WordPullUpProps {
  words: string;
  delayMultiple?: number;
  wrapperFramerProps?: Variants;
  framerProps?: Variants;
  className?: string;
}

export default function WordPullUp({
  words,
  wrapperFramerProps = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
  framerProps = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  },
  className,
}: WordPullUpProps) {
  return (
    <motion.h1
      variants={wrapperFramerProps}
      initial="hidden"
      animate="show"
      className={cn(
        'text-center font-bold font-display text-4xl leading-[5rem] tracking-[-0.02em] drop-shadow-sm',
        className
      )}
    >
      {words.split(' ').map((word, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={i}
          variants={framerProps}
          style={{ display: 'inline-block', paddingRight: '8px' }}
        >
          {word === '' ? <span>&nbsp;</span> : word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
