import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H3 } from "@/components/ui/typography";

import RegisterForm from "@/components/ui/forms/register";

import { GoogleButton } from "@/components/ui/auth/buttons";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage(): JSX.Element {
  return (
    <main className="bg-background flex flex-col items-center justify-center min-h-screen">
      <div className={"w-full p-8 sm:p-0 flex h-screen"}>
        <div className={"flex-1 flex items-center"}>
          <div className={"max-w-sm mx-auto w-full"}>
            <div className={"mb-4 space-y-4"}>
              <H3>Create an account</H3>
            </div>

            <div className={"flex flex-col gap-4 w-full"}>
              <RegisterForm />

              <div className={"text-sm text-muted-foreground text-center"}>
                Already have an account?{" "}
                <Button
                  variant={"link"}
                  className={"text-primary w-fit h-fit p-0"}
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
              </div>

              <div className="w-full flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <Separator />
                <span>or</span>
                <Separator />
              </div>

              <GoogleButton />
            </div>
          </div>
        </div>

        <div
          className={
            "hidden lg:block relative flex-1 max-w-3xl w-full bg-yellow-300 h-full"
          }
        >
          <Image
            src={"/images/isometric-map.svg"}
            alt={"Isometric chess board"}
            fill
            priority
            sizes={"100vw"}
            draggable={false}
            className={
              "select-none w-full object-contain max-w-md xl:max-w-lg mx-auto"
            }
          />
        </div>
      </div>
    </main>
  );
}
