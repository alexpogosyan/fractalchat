import { getUser } from "@/app/auth/actions";
import LandingPage from "@/components/LandingPage";

export default async function HomePage() {
  const { user } = await getUser();

  if (user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a thread from the sidebar.
      </div>
    );
  }

  return <LandingPage />;
}
