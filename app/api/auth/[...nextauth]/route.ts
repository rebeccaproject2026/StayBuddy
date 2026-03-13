import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectToDatabase();

        // Check if user exists
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Update Google ID if not set
          if (!existingUser.googleId && account?.provider === 'google') {
            existingUser.googleId = account.providerAccountId;
            existingUser.profileImage = user.image || existingUser.profileImage;
            await existingUser.save();
          }
          return true;
        }

        // For new users, get the role from the state (passed during signIn)
        const role = (account as any)?.state || 'renter'; // Default to renter if no state

        // Create new user
        const newUser = new User({
          fullName: user.name,
          email: user.email,
          role: role,
          country: 'in', // Default country, you might want to detect this
          isVerified: true, // Google accounts are pre-verified
          provider: 'google',
          googleId: account?.providerAccountId,
          profileImage: user.image,
        });

        await newUser.save();
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ email: user.email });

          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.profileImage = dbUser.profileImage;
          }
        } catch (error) {
          console.error('Error in jwt callback:', error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.profileImage = token.profileImage as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to homepage after login
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };