import { REGEX_FLAGS } from '@hexa/const/regex';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

import { TipButton } from '@/components/tips/tip-button';
import { ChevronDown, ChevronUp, ExternalLinkIcon } from '@hexa/ui/icons';
import { useState } from 'react';

export const RegexExpressionTips = ({ className }: { className?: string }) => {
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  return (
    <Popover placement="right" showArrow>
      <PopoverTrigger>
        <TipButton className={className} aria-label="About regex" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Regular Expression</h4>
            <p className="text-muted-foreground text-sm">
              Regular expressions are patterns used to match character
              combinations in strings.
            </p>
            <p className="text-muted-foreground text-sm">
              Note:
              <ul className="list-inside list-disc">
                <li>This is a pattern string, not a regex literal.</li>
                <li>
                  Do not include{' '}
                  <code className="rounded bg-muted px-1">{'//'}</code> at the
                  beginning and end.
                </li>
                <li>
                  Remember to escape backslashes. Example: use{' '}
                  <code className="rounded bg-muted px-1">\\d+</code> not{' '}
                  <code className="rounded bg-muted px-1">/\d+/</code>
                </li>
              </ul>
            </p>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowCheatsheet(!showCheatsheet)}
              className="flex w-full items-center justify-between font-medium text-sm"
            >
              Cheatsheet
              {showCheatsheet ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {showCheatsheet && (
              <div className="slide-in-from-top-1 animate-in text-sm duration-100">
                <div className="flex gap-2 py-1">
                  <code className="rounded bg-muted px-1">\d</code>
                  <span className="text-muted-foreground">any digit (0-9)</span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="rounded bg-muted px-1">\w</code>
                  <span className="text-muted-foreground">
                    any word character (a-z, A-Z, 0-9, _)
                  </span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="rounded bg-muted px-1">[abc]</code>
                  <span className="text-muted-foreground">
                    any character in brackets
                  </span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="rounded bg-muted px-1">+</code>
                  <span className="text-muted-foreground">one or more</span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="rounded bg-muted px-1">*</code>
                  <span className="text-muted-foreground">zero or more</span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="rounded bg-muted px-1">?</code>
                  <span className="text-muted-foreground">zero or one</span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="rounded bg-muted px-1">^</code>
                  <span className="text-muted-foreground">start of string</span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="rounded bg-muted px-1">$</code>
                  <span className="text-muted-foreground">end of string</span>
                </div>
              </div>
            )}
            <div className="border-t pt-2">
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-muted-foreground text-xs hover:text-foreground"
              >
                Learn more about Regular Expressions
                <ExternalLinkIcon
                  className="ml-1 h-3 w-3"
                  aria-label="External link"
                />
              </a>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const RegexFlagsTips = ({ className }: { className?: string }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <TipButton className={className} aria-label="About regex flags" />
      </PopoverTrigger>
      <PopoverContent className="w-[380px]">
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Regex Flags</h4>
            <p className="text-muted-foreground text-sm">
              Available flags to modify the regular expression behavior:
            </p>
          </div>
          <div className="space-y-2">
            <div className="whitespace-pre-line text-sm">
              {Object.entries(REGEX_FLAGS).map(([flag, desc]) => (
                <div key={flag} className="flex gap-2 py-1">
                  <code className="rounded bg-muted px-1">{flag}</code>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
            {/* <div className="pt-2 border-t">
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp#flags"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center"
              >
                Learn more about RegExp flags
                <ExternalLinkIcon
                  className="ml-1 h-3 w-3"
                  aria-label="External link"
                />
              </a>
            </div> */}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
