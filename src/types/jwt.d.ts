import { UUID } from "crypto";

export type JwtPayload = {
  exp: number;
  token_type: string;
  exp: number;
  iat: number;
  jti: string;

  user_id: number;
  user_implicit_id: UUID;
  email: string;
  first_name: string;
  last_name: string;
};
