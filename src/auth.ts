import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmails = (process.env.AUTH_ALLOWED_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      // Se a allowlist está vazia, libera qualquer conta Google (modo prototipo).
      if (allowedEmails.length === 0) return true;
      const email = user.email?.toLowerCase();
      return !!email && allowedEmails.includes(email);
    },
    async session({ session }) {
      return session;
    },
  },
  trustHost: true,
});
