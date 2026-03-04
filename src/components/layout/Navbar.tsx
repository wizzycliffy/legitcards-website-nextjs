'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Gift,
  User,
  LogOut,
  Home,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  BookText,
  MessageCircleQuestion,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { name: "Homepage", path: "/", icon: Home },
  { name: "Contact Support", path: "/contact", icon: MessageCircleQuestion },
  { name: "Blog", path: "/blog", icon: BookText },
  { name: "FAQ", path: "/faq", icon: HelpCircle },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const isDashboard =
    pathname.includes("dashboard") ||
    pathname.includes("profile");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-[1vw] border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Gift className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold gradient-text">
                Legitcard
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {mounted && isAuthenticated && (
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === "/dashboard"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              {mounted && (
                isAuthenticated ? (
                  <>
                    <Link href="/profile">
                      <Button variant="ghost" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" className="text-sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="gradient" className="text-sm h-[40px]">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              {!isDashboard && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  {isOpen ? <X /> : <Menu />}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isOpen && !isDashboard && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <aside
          className={cn(
            "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l shadow-xl z-50 transition-transform md:hidden",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <span className="text-lg font-bold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 -mt-2 rounded-sm px-4 py-4 h-fit space-y-2 bg-background">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted"
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}

              {mounted && isAuthenticated && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
              )}
            </div>

            {/* Account Actions */}
            <div className="p-4 border-t space-y-3 bg-background">
              {mounted && (
                isAuthenticated ? (
                  <>
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full mb-4">
                        <p className="text-base">Sign In</p>
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button variant="gradient" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </aside>
      </nav>
    </>
  );
}
