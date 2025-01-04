import { CreateProject } from '@/components/project/create-project';
import { ProjectList } from '@/components/project/project-list';

export const dynamic = 'force-dynamic';

export default function () {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-3xl">Projects</h1>
        <CreateProject />
      </div>

      <div className="max-w-6xl py-6 lg:py-10">
        <ProjectList />
      </div>
    </>
  );
}
