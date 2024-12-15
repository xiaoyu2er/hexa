'use client';

import { ReadOnly } from '@/components/form';
import { useProject } from '@/hooks/use-project';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

export function ProjectId() {
  const { project } = useProject();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project ID</CardTitle>
        <CardDescription>
          This is the unique project identifier on {NEXT_PUBLIC_APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReadOnly text={project.id} className="max-w-md" />
      </CardContent>
      <CardFooter className="flex-row-reverse items-center justify-between border-t px-6 py-4" />
    </Card>
  );
}
