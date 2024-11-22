import { DeleteProject } from '@/components/project/settings/delete-project';
import { EditProjectName } from '@/components/project/settings/edit-project-name';
import { EditProjectSlug } from '@/components/project/settings/edit-project-slug';
import { ProjectId } from '@/components/project/settings/project-id';
import { UploadProjectAvatar } from '@/components/project/settings/upload-project-avatar';

export default function () {
  return (
    <>
      <EditProjectName />
      <EditProjectSlug />
      <UploadProjectAvatar />
      <ProjectId />
      <DeleteProject />
    </>
  );
}
