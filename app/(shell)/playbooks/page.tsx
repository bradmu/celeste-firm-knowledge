import { PlaybooksEmpty } from '@/components/celeste/playbooks-empty';
import { PlaybooksOngoing } from '@/components/celeste/playbooks-page';

type SearchParams = Promise<{ view?: string }>;

export default async function PlaybooksRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { view } = await searchParams;
  const ongoing = view === 'ongoing';
  return (
    <main className="flex flex-1 justify-center px-8 pt-10 pb-16">
      {ongoing ? <PlaybooksOngoing /> : <PlaybooksEmpty />}
    </main>
  );
}
