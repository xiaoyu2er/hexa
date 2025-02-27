'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

import { ReadOnly } from '@/components/form';
import { EditProjectSlugModal } from '@/components/project/settings/edit-project-slug-modal';
import { useProject } from '@/hooks/use-project';
import { getProjectSlug } from '@/lib/project';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@heroui/react';
import type { SelectProjectType } from '@hexa/server/schema/project';
import { useRouter } from 'next/navigation';

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
      <CardContent>
        <ReadOnly text={project.slug} className="max-w-md" />
      </CardContent>
      <CardFooter>
        <Button
          variant="flat"
          onPress={() => {
            modal.show({ project }).then((newProject) => {
              router.replace(
                `/${getProjectSlug(newProject as SelectProjectType)}/settings/project`
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
