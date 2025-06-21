import Link from "next/link";
import Image from "next/image";
import { getUser, signout } from "@/app/auth/actions";
import { Button } from "@/components/Button";

export default async function Header() {
  const { user } = await getUser();

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="FractalChat Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900">FractalChat</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <form action={signout}>
                  <Button type="submit" variant="outline" size="sm">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button href="/auth/signin" variant="ghost" size="sm">
                  Sign in
                </Button>
                <Button href="/auth/signup" variant="solid" size="sm">
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
