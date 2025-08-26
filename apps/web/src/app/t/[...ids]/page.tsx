import { getThreadBundle, getThreadTree } from "@/lib/db/server";
import { getUser } from "@/app/auth/actions";
import Thread from "../../../components/Thread";
import AppLayout from "@/components/AppLayout";

interface PageProps {
  params: Promise<{
    ids: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const ids: string[] = resolvedParams.ids ?? [];
  const threadId = ids.at(-1);

  const { user } = await getUser();
  const userEmail = user?.email || "";

  if (!threadId) {
    const threadTree = await getThreadTree();
    return (
      <AppLayout threadTree={threadTree} userEmail={userEmail}>
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Thread not found.</p>
        </div>
      </AppLayout>
    );
  }

  const [bundle, threadTree] = await Promise.all([
    getThreadBundle(threadId),
    getThreadTree()
  ]);
  
  return (
    <AppLayout threadTree={threadTree} threadId={threadId} userEmail={userEmail}>
      <Thread bundle={bundle} />
    </AppLayout>
  );
}
