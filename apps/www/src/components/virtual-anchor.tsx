import { Link } from '@nextui-org/react';
import type React from 'react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { HashLinearIcon } from '@/components/icons';

export interface Props {
  id?: string;
  children?: ReactNode;
}

export const virtualAnchorEncode = (text?: string) => {
  if (!text) {
    return undefined;
  }

  return text.toLowerCase().replace(/ /g, '-');
};

export const VirtualAnchor: React.FC<Props> = ({ children, id }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [anchorId, setAnchorId] = useState<string | undefined>();

  useEffect(() => {
    if (!ref.current || !id) {
      return;
    }
    setAnchorId(virtualAnchorEncode(ref.current.textContent || undefined));
  }, [ref.current, id]);

  return (
    <Link
      ref={ref}
      className="group relative flex w-fit items-center gap-1 text-inherit"
      href={`#${id || anchorId}`}
    >
      {children}
      <span className="opacity-0 transition-opacity group-hover:opacity-100">
        <HashLinearIcon size={20} />
      </span>
    </Link>
  );
};
