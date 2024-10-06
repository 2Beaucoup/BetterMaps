interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export type { LoginForm, RegisterForm };
