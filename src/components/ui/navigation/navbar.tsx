"use client";

import Link from "next/link";
import { Button } from "../button";
import { H3, H4 } from "../typography";
import { useSession } from "next-auth/react";
import authOptions from "@/lib/auth/options";
import { LogoutButton } from "../auth/buttons";
import { Suspense } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Kanit } from "next/font/google";
import { cn } from "@/lib/utils";

const kanit = Kanit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

type NavOption = {
  name: string;
  href: string;
};
const navOptions: NavOption[] = [
    {
        name: "Interactive Map",
        href: "/map",
      },
  {
    name: "Sign in",
    href: "/auth/login",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/map") {
    return null;
  }
  const { data: session, status } = useSession();

  return (
    <div
      className={cn(
        "w-full h-16 flex justify-around border-b border-border",
        "bg-transparent",
        pathname === "/auth/login" || pathname === "/auth/register"
          ? "fixed justify-start pl-8 border-0"
          : "relative",
      )}
    >
      <Link href={"/"} className={"flex items-center gap-2"}>
        <Image
          src={"/logos/bettermaps.svg"}
          alt={"BetterMaps"}
          width={28}
          height={28}
        />
        <H3 className={`font-medium text-2xl ${kanit.className}`}>
          BetterMaps
        </H3>
      </Link>

      <Suspense fallback={<></>}>
        {pathname !== "/auth/login" && pathname !== "/auth/register" && (
          <div className={"flex gap-8 items-center"}>
            {navOptions.map((navOption, index) => {
              if (navOption.name === "Sign in" && status === "authenticated") {
                return null;
              }

              if (
                navOption.name === "Dashboard" &&
                status !== "authenticated"
              ) {
                return null;
              }

              return (
                <Link
                  href={navOption.href}
                  className={
                    "text-neutral-500 text-sm hover font-semibold underline-offset-[8px] decoration-neutral-300 hover:underline hover:decoration-2 hover:text-black transition-all "
                  }
                  key={index}
                >
                  {navOption.name}
                </Link>
              );
            })}

            {(status === "authenticated" && (
              <LogoutButton className={"h-10 font-semibold"} />
            )) || (
              <Link href={"/auth/login"}>
                <Button className={"h-10 font-semibold"}>Get Started</Button>
              </Link>
            )}
          </div>
        )}
      </Suspense>
    </div>
  );
}
