'use client';
import type { TableRef } from '@/components/table/base-table';
import { CreateTagModal } from '@/components/tag/create-tag-modal';
import { TagTable } from '@/components/tag/tag-table';
import { useProject } from '@/hooks/use-project';
import { invalidateProjectTags } from '@/lib/queries/project';
import { useModal } from '@ebay/nice-modal-react';
import type { SelectTagType } from '@hexa/server/schema/tag';
import { Button } from '@nextui-org/react';
import { useRef } from 'react';

export function TagsPage() {
  const { project } = useProject();
  const modal = useModal(CreateTagModal);
  const tagTableRef = useRef<TableRef<SelectTagType>>(null);

  return (
    <>
      <div>
        <h2 className="font-bold text-2xl tracking-tight">Tags</h2>
        <p className="text-muted-foreground">Manage your tags here.</p>
      </div>

      <div className="relative">
        <TagTable ref={tagTableRef} />
        <Button
          color="primary"
          size="sm"
          className="absolute top-0 right-0"
          onPress={() =>
            modal.show(project).then(() => {
              tagTableRef.current?.table.setPageIndex(0);
              invalidateProjectTags(project.id);
            })
          }
        >
          Add
        </Button>
      </div>
    </>
  );
}
