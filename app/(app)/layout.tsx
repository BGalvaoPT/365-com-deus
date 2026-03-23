import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-parchment-100 dark:bg-neutral-950">
      <TopBar />
      <main className="pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
