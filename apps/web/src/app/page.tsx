import { getUser } from "@/app/auth/actions";
import { getThreadTree } from "@/lib/db/server";
import LandingPage from "@/components/LandingPage";
import AppLayout from "@/components/AppLayout";

export default async function HomePage() {
  const { user } = await getUser();

  if (user) {
    const threadTree = await getThreadTree();
    
    return (
      <AppLayout threadTree={threadTree}>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-muted-foreground mb-2">
              Welcome to Fractalchat
            </h2>
            <p className="text-muted-foreground">
              Select a conversation from the sidebar to get started, or create a new thread.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return <LandingPage />;
}
