import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}
