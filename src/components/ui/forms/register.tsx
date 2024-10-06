"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { InputWithLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RegisterForm } from "@/types/forms/auth";

import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { attemptCreateUser } from "@/lib/auth";

export default function RegisterForm(): JSX.Element {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  const searchParams = useSearchParams();
  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const res = await attemptCreateUser(data);

      if (!res) {
        toast.error("Invalid email or password");
      } else {
        let callbackUrl = searchParams.get("callbackUrl");
        const next = searchParams.get("next") || "/";
        callbackUrl = callbackUrl || next;

        signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: true,
          callbackUrl: callbackUrl,
        });
      }
    } catch (error) {
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
          minLength: {
            value: 5,
            message: "Password must be at least 5 characters",
          },
        })}
      />

      <InputWithLabel
        error={errors.passwordConfirmation}
        label="Confirm Password"
        type="password"
        placeholder="Confirm Password"
        {...register("passwordConfirmation", {
          required: {
            value: true,
            message: "Password confirmation is required",
          },
          validate: (value, data) =>
            value === data.password || "Passwords do not match",
        })}
      />

      <Button className={"w-full"} type="submit">
        Create Account
      </Button>
    </form>
  );
}
