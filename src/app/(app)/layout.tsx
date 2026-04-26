import { Shell } from "@/components/Shell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Shell userName="Visitante" userImage={null}>
      {children}
    </Shell>
  );
}
