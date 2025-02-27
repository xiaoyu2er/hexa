import { Avatar } from '@heroui/react';
import { MAX_PROFILE_FILE_SIZE_MB } from '@hexa/const';
import { cn } from '@hexa/lib';
import { Loader2, UploadCloud } from '@hexa/ui/icons';
import { toast } from '@hexa/ui/sonner';
import { type VariantProps, cva } from 'class-variance-authority';
import type React from 'react';
import { type ReactNode, useState } from 'react';

const acceptFileTypes = {
  any: { types: [], errorMessage: '' },
  images: {
    types: ['image/png', 'image/jpeg'],
    errorMessage: 'File type not supported (.png or .jpg only)',
  },
} as const;

const imageUploadVariants = cva(
  'group relative isolate flex aspect-[1200/630] w-full flex-col items-center justify-center overflow-hidden bg-white transition-all hover:bg-gray-50',
  {
    variants: {
      variant: {
        default: 'rounded-md border border-gray-300 shadow-sm',
        plain: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type FileUploadReadFileProps =
  | {
      /**
       * Whether to automatically read the file and return the result as `src` to onChange
       */
      readFile?: false;
      onChange?(_data: { file: File }): void;
    }
  | {
      /**
       * Whether to automatically read the file and return the result as `src` to onChange
       */
      readFile: true;
      onChange?: (_data: { file: File; src: string }) => void;
    };

export type FileUploadProps = FileUploadReadFileProps & {
  accept: keyof typeof acceptFileTypes;

  className?: string;
  iconClassName?: string;

  /**
   * Image to display (generally for image uploads)
   */
  imageSrc?: string | null;

  /**
   * Whether to display a loading spinner
   */
  loading?: boolean;

  /**
   * Whether to allow clicking on the area to upload
   */
  clickToUpload?: boolean;

  /**
   * Whether to show instruction overlay when hovered
   */
  showHoverOverlay?: boolean;

  /**
   * Content to display below the upload icon (null to only display the icon)
   */
  content?: ReactNode | null;

  /**
   * Desired resolution to suggest and optionally resize to
   */
  targetResolution?: { width: number; height: number };

  /**
   * A maximum file size (in megabytes) to check upon file selection
   */
  maxFileSizeMB?: number;

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
} & VariantProps<typeof imageUploadVariants>;

export function FileUpload({
  readFile,
  onChange,
  variant,
  className,
  iconClassName,
  accept = 'any',
  imageSrc,
  loading = false,
  clickToUpload = true,
  showHoverOverlay = true,
  content,
  maxFileSizeMB = 0,
  accessibilityLabel = 'File upload',
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement> | DragEvent
  ) => {
    const file =
      'dataTransfer' in e
        ? // @ts-ignore - TODO - Fix this
          e.dataTransfer.files?.[0]
        : e.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);

    if (
      maxFileSizeMB > 0 &&
      file.size / 1024 / 1024 > MAX_PROFILE_FILE_SIZE_MB
    ) {
      toast.error(`File size too big (max ${maxFileSizeMB} MB)`);
      return;
    }

    const acceptedTypes = acceptFileTypes[accept].types;

    if (
      acceptedTypes.length &&
      !acceptedTypes.includes(file.type as (typeof acceptedTypes)[number])
    ) {
      toast.error(
        acceptFileTypes[accept].errorMessage ?? 'File type not supported'
      );
      return;
    }

    if (readFile) {
      const reader = new FileReader();
      reader.onload = (e) =>
        onChange?.({ src: e.target?.result as string, file });
      reader.readAsDataURL(file);

      return;
    }

    onChange?.({ file });
  };

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label
      className={cn(
        imageUploadVariants({ variant }),
        clickToUpload && 'cursor-pointer',
        className
      )}
    >
      {loading && (
        <div className="absolute inset-0 z-[5] flex items-center justify-center rounded-[inherit] bg-white">
          <Loader2 />
        </div>
      )}
      <div
        className="absolute inset-0 z-[5]"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          // @ts-ignore - TODO - Fix this
          onFileChange(e);
          setDragActive(false);
        }}
      />
      <div
        className={cn(
          'absolute inset-0 z-[3] flex flex-col items-center justify-center rounded-[inherit] bg-white transition-all',
          dragActive &&
            'cursor-copy border-2 border-black bg-gray-50 opacity-100',
          imageSrc
            ? cn('opacity-0', showHoverOverlay && 'group-hover:opacity-100')
            : 'group-hover:bg-gray-50'
        )}
      >
        <UploadCloud
          className={cn(
            'h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95',
            dragActive ? 'scale-110' : 'scale-100',
            iconClassName
          )}
        />
        {content !== null && (
          <div className="mt-2 text-center text-gray-500 text-sm">
            {content ?? (
              <p>Drag and drop {clickToUpload && 'or click'} to upload.</p>
            )}
          </div>
        )}
        <span className="sr-only">{accessibilityLabel}</span>
      </div>
      {imageSrc && (
        <Avatar
          className="h-full w-full rounded-[inherit] object-cover"
          src={imageSrc}
        />
      )}
      {clickToUpload && (
        <div className="sr-only mt-1 flex shadow-sm">
          <input
            key={fileName} // Gets us a fresh input every time a file is uploaded
            type="file"
            accept={acceptFileTypes[accept].types.join(',')}
            onChange={onFileChange}
          />
        </div>
      )}
    </label>
  );
}
