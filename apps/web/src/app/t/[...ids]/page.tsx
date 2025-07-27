import { getThreadBundle } from "@/lib/db/server";
import Thread from "../../../components/Thread";

interface PageProps {
  params: Promise<{
    ids: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const ids: string[] = resolvedParams.ids ?? [];
  const threadId = ids.at(-1);

  if (!threadId) {
    return <p className="p-6 text-gray-500">Select a thread.</p>;
  }

  const bundle = await getThreadBundle(threadId);
  return <Thread bundle={bundle} />;
}
