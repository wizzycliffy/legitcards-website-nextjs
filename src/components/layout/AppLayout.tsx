import { Navbar } from "./Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for authenticated / app-side pages.
 * Includes the shared Navbar but intentionally omits the public Footer.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-display">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
    </div>
  );
}
