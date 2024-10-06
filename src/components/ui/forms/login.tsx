"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { InputWithLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LoginForm } from "@/types/forms/auth";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res?.ok) {
        toast.error("Invalid email or password");
      }

      if (res?.ok) {
        // get the callbackUrl from the searchParams or the next param
        let callbackUrl = searchParams.get("callbackUrl");
        const next = searchParams.get("next") || "/";
        callbackUrl = callbackUrl || next;

        router.push(res.url || callbackUrl);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"flex flex-col gap-6 w-full"}
    >
      <InputWithLabel
        error={errors.email}
        label="Email"
        type="email"
        placeholder="Email"
        {...register("email", {
          required: { value: true, message: "Email is required" },
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
        })}
      />

      <InputWithLabel
        error={errors.password}
        label="Password"
        type="password"
        placeholder="Password"
        {...register("password", {
          required: { value: true, message: "Password is required" },
        })}
      />

      <Button className={"w-full"} type="submit">
        Log in
      </Button>
    </form>
  );
}
