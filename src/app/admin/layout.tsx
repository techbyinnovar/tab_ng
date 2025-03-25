'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated or not an admin
  // This is a client-side fallback in case middleware fails
  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && session.user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Don't render the layout until we know the user is authenticated and is an admin
  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated" || (session?.user && session.user.role !== "ADMIN")) {
    return null; // Don't render anything, will be redirected by the useEffect
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: ShoppingBag,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">Tab.ng</span>
            <span className="ml-2 text-xs bg-black text-white px-2 py-0.5">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href
                      ? "bg-neutral-100 text-black"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-neutral-200">
          <button 
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            onClick={() => {
              void signOut({ callbackUrl: '/login' });
            }}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-neutral-200 bg-white">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">Tab.ng</span>
            <span className="ml-2 text-xs bg-black text-white px-2 py-0.5">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Mobile menu button would go here */}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
