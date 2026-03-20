import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      country: string;
      profileImage?: string;
    };
  }

  interface JWT {
    id: string;
    role: string;
    country: string;
    profileImage?: string;
  }
}