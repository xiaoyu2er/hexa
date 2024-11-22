import { CreateProject } from '@/components/project/create-project';
import { ProjectList } from '@/components/project/project-list';
import { MaxWidth } from '@hexa/ui/max-width';

export const dynamic = 'force-dynamic';

export default function () {
  return (
    <main className="min-h-[calc(100vh-16px)]">
      <div className="flex h-36 items-center border-b">
        <MaxWidth>
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-3xl">Projects</h1>
            <CreateProject />
          </div>
        </MaxWidth>
      </div>

      <MaxWidth>
        <div className="max-w-6xl py-6 lg:py-10">
          <ProjectList />
        </div>
      </MaxWidth>
    </main>
  );
}
