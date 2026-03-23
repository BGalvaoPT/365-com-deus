"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, BookIcon, CalendarIcon, EditIcon } from "./Icons";

const navItems = [
  { href: "/dashboard", icon: HomeIcon, label: "Início" },
  { href: "/devotional/today", icon: BookIcon, label: "Devocional" },
  { href: "/calendar", icon: CalendarIcon, label: "Calendário" },
  { href: "/notes", icon: EditIcon, label: "Notas" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-parchment-200 dark:border-neutral-800">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/devotional/today" &&
              pathname.startsWith("/devotional"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
                isActive
                  ? "text-gold-600 dark:text-gold-500"
                  : "text-parchment-400 dark:text-neutral-500"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
