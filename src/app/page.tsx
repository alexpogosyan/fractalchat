import { getUser } from "@/app/auth/actions";
import LandingPage from "@/components/LandingPage";
import AppHome from "@/components/AppHome";

export default async function HomePage() {
  const { user } = await getUser();

  if (user) {
    return <AppHome />;
  }

  return <LandingPage />;
}
