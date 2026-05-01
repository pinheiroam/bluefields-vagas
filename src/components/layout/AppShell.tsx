import { Navbar } from "@/components/layout/Navbar";

interface AppShellProps {
  userName: string;
  children: React.ReactNode;
}

export function AppShell({ userName, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName={userName} />
      <main className="flex-1">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}
