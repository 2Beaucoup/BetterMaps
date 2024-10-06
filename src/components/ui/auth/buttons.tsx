"use client";

import React from "react";
import { SocialButton, type ButtonProps } from "@/components/ui/button";
import Image from "next/image";

import { signIn, signOut } from "next-auth/react";

type SocialButtonType = typeof SocialButton;

const GoogleButton: SocialButtonType = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ ...props }, ref) => {
  const handleSignIn = async () => {
    await signIn("google", {
      redirect: false,
    });
  };
  return (
    <SocialButton ref={ref} onClick={handleSignIn} {...props}>
      <Image src="/logos/google.svg" alt="Google" width={24} height={24} />
      Sign in with Google
    </SocialButton>
  );
});
GoogleButton.displayName = "GoogleButton";

const LogoutButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    const handleSignOut = async () => {
      await signOut();
    };
    return (
      <SocialButton ref={ref} onClick={handleSignOut} {...props}>
        Sign out
      </SocialButton>
    );
  },
);

LogoutButton.displayName = "LogoutButton";

export { GoogleButton, LogoutButton };
