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
import { EditOrgSlugModal } from '@/components/org/settings/edit-org-slug-modal';
import { useProject } from '@/hooks/use-project';

import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@heroui/react';
import type { SelectOrgType } from '@hexa/server/schema/org';
import { useRouter } from 'next/navigation';

export function EditOrgSlug() {
  const { project } = useProject();
  const { org } = project;
  const modal = useModal(EditOrgSlugModal);
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization slug</CardTitle>
        <CardDescription>
          Organization slug is shown in the URL, we don't redirect the old slug
          to the new slug.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReadOnly text={org.slug} className="max-w-md" />
      </CardContent>
      <CardFooter>
        <Button
          variant="flat"
          onPress={() => {
            modal.show({ org }).then((newOrg) => {
              router.replace(
                `/${(newOrg as SelectOrgType).slug}/${project.slug}/settings/org`
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
