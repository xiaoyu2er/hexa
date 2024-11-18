import { Suspense } from 'react';
import { OrgPage } from './orgs-page';

export default function () {
  return (
    <Suspense>
      <OrgPage />
    </Suspense>
  );
}
