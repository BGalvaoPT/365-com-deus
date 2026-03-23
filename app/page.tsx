import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-parchment-100 dark:bg-neutral-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md animate-fade-in">
        {/* Cruz */}
        <div className="mb-8 text-gold-600 dark:text-gold-500 flex justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="7" y1="7" x2="17" y2="7" />
          </svg>
        </div>

        <h1 className="text-4xl font-light text-parchment-900 dark:text-neutral-100 mb-3 tracking-tight">
          365 com Deus
        </h1>

        <p className="text-parchment-600 dark:text-neutral-400 text-base leading-relaxed mb-10">
          Um ano de fidelidade na Palavra.
          <br />
          Um devocional diário, centrado em Cristo.
        </p>

        <Link
          href="/auth/login"
          className="inline-block bg-gold-600 text-white font-semibold py-4 px-12 rounded-xl hover:bg-gold-700 transition-colors text-base tracking-wide"
        >
          Começar
        </Link>

        <p className="text-parchment-400 dark:text-neutral-600 text-xs mt-12 leading-relaxed italic">
          «Lâmpada para os meus pés é a tua palavra,
          <br />e luz para o meu caminho.»
          <br />
          <span className="not-italic">— Salmo 119:105</span>
        </p>
      </div>
    </main>
  );
}
