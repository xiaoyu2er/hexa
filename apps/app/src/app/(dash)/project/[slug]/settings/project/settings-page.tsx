'use client';

import { DeleteProject } from '@/components/project/settings/delete-project';
import { EditProjectName } from '@/components/project/settings/edit-project-name';
import { EditProjectSlug } from '@/components/project/settings/edit-project-slug';
import { ProjectId } from '@/components/project/settings/project-id';
import UploadAvatar from '@/components/upload-avatar';
import { useProject } from '@/hooks/use-project';
import { getProjectAvatarFallbackUrl } from '@/lib/project';
import { $updateProjectAvatar } from '@hexa/server/api';

export default function ProjectSettingsPage() {
  const { project, invalidate } = useProject();

  return (
    <>
      <EditProjectName />
      <EditProjectSlug />
      <UploadAvatar
        title="Project avatar"
        description="This avatar is project's logo."
        onUpdate={(form) =>
          $updateProjectAvatar({
            form: { ...form, projectId: project.id },
          }).then(() => invalidate())
        }
        avatarUrl={project.avatarUrl ?? getProjectAvatarFallbackUrl(project)}
      />
      <ProjectId />
      <DeleteProject />
    </>
  );
}
