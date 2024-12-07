import { REGEX_FLAGS } from '@hexa/const/regex';
import { Button } from '@hexa/ui/button';
import {
  ChevronDown,
  ChevronUp,
  CircleHelpIcon,
  ExternalLinkIcon,
} from '@hexa/ui/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@hexa/ui/popover';
import { useState } from 'react';

export const RegexExpressionTips = () => {
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        >
          <CircleHelpIcon
            className="h-4 w-4 text-muted-foreground"
            aria-label="About regular expressions"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Regular Expression</h4>
            <p className="text-sm text-muted-foreground">
              Regular expressions are patterns used to match character
              combinations in strings.
            </p>
            <p className="text-sm text-muted-foreground">
              Note: This is a pattern string, not a regex literal. Do not
              include <code className="bg-muted px-1 rounded">//</code> at the
              beginning and end. Remember to escape backslashes. Example: use{' '}
              <code className="bg-muted px-1 rounded">\\d+</code> not{' '}
              <code className="bg-muted px-1 rounded">/\d+/</code>
            </p>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowCheatsheet(!showCheatsheet)}
              className="flex items-center justify-between w-full text-sm font-medium"
            >
              Cheatsheet
              {showCheatsheet ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {showCheatsheet && (
              <div className="text-sm animate-in slide-in-from-top-1 duration-100">
                <div className="flex gap-2 py-1">
                  <code className="bg-muted px-1 rounded">\d</code>
                  <span className="text-muted-foreground">any digit (0-9)</span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="bg-muted px-1 rounded">\w</code>
                  <span className="text-muted-foreground">
                    any word character (a-z, A-Z, 0-9, _)
                  </span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="bg-muted px-1 rounded">[abc]</code>
                  <span className="text-muted-foreground">
                    any character in brackets
                  </span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="bg-muted px-1 rounded">+</code>
                  <span className="text-muted-foreground">one or more</span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="bg-muted px-1 rounded">*</code>
                  <span className="text-muted-foreground">zero or more</span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="bg-muted px-1 rounded">?</code>
                  <span className="text-muted-foreground">zero or one</span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="bg-muted px-1 rounded">^</code>
                  <span className="text-muted-foreground">start of string</span>
                </div>
                <div className="flex gap-2 py-1">
                  <code className="bg-muted px-1 rounded">$</code>
                  <span className="text-muted-foreground">end of string</span>
                </div>
              </div>
            )}
            <div className="pt-2 border-t">
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center"
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

export const RegexFlagsTips = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        >
          <CircleHelpIcon
            className="h-4 w-4 text-muted-foreground"
            aria-label="About regex flags"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Regex Flags</h4>
            <p className="text-sm text-muted-foreground">
              Available flags to modify the regular expression behavior:
            </p>
          </div>
          <div className="space-y-2">
            <div className="whitespace-pre-line text-sm">
              {Object.entries(REGEX_FLAGS).map(([flag, desc]) => (
                <div key={flag} className="flex gap-2 py-1">
                  <code className="bg-muted px-1 rounded">{flag}</code>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t">
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
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
