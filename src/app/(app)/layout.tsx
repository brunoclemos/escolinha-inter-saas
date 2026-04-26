import { auth } from "@/auth";
import { Shell } from "@/components/Shell";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <Shell userName={session.user.name} userImage={session.user.image}>
      {children}
    </Shell>
  );
}
