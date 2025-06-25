import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/app/auth/actions";
import { Button } from "@/components/Button";
import AvatarMenu from "@/components/AvatarMenu";

export default async function Header() {
  const { user } = await getUser();

  return (
    <header className="fixed top-0 left-0 z-10 w-full bg-white border-b border-gray-200">
      <div className="px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="FractalChat Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-medium text-gray-900">
              FractalChat
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <AvatarMenu email={user.email ?? ""} />
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
