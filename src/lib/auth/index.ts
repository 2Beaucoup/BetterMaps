"use server";

import { RegisterForm } from "@/types/forms/auth";

const attemptCreateUser = async (
  credentials: RegisterForm,
): Promise<boolean> => {
  /*
    This function is responsible for creating a new user account. It should send a POST request to the backend API with the provided credentials and return true if the account was created successfully, or false if there was an error.
    */

  const res = await fetch(`${process.env.BACKEND_API_URL}/auth/registration/`, {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email,
      password1: credentials.password,
      password2: credentials.passwordConfirmation,
    }),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  console.log(res);

  const data = await res.json();

  console.log(data);

  if (!res.ok) {
    return false;
  }

  return true;
};

export { attemptCreateUser };
