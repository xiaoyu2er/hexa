'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import {} from '@hexa/ui/form';

import { ReadOnly } from '@/components/form/read-only';
import { EditProjectSlugModal } from '@/components/project/settings/edit-project-slug-modal';
import { useProject } from '@/components/providers/project-provicer';
import type { SelectProjectType } from '@/server/schema/project';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { useRouter } from 'next/navigation';
import {} from 'react';

export function EditProjectSlug() {
  const { project } = useProject();
  const modal = useModal(EditProjectSlugModal);
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project slug</CardTitle>
        <CardDescription>
          Project slug is shown in the URL, we don't redirect the old slug to
          the new slug.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <ReadOnly text={project.slug} />
      </CardContent>
      <CardFooter className="flex-row-reverse items-center justify-between border-t px-6 py-4">
        <Button
          variant="secondary"
          className="shrink-0"
          onClick={() => {
            modal.show({ project }).then((newProject) => {
              router.replace(
                `/project/${(newProject as SelectProjectType).slug}/settings`
              );
            });
          }}
        >
          Update
        </Button>
      </CardFooter>
    </Card>
  );
}
