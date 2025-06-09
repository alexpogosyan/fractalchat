import { getThreadBundle } from "@/lib/db/server";
import ThreadClient from "../../../components/ThreadClient";

interface PageProps {
  params: {
    ids: string[];
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const ids: string[] = resolvedParams.ids ?? [];
  const threadId = ids.at(-1);

  if (!threadId) {
    return <p className="p-6 text-gray-500">Select a thread.</p>;
  }

  const bundle = await getThreadBundle(threadId);
  return <ThreadClient bundle={bundle} />;
}
