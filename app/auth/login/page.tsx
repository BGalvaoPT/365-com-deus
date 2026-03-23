"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CrossIcon } from "@/components/Icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage(
          "Verifica o teu email para confirmar a conta. Depois volta aqui e faz login."
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Email ou palavra-passe incorretos."
            : error.message
        );
      } else {
        router.push("/dashboard");
      }
    }

    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-parchment-100 dark:bg-neutral-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4 text-gold-600 dark:text-gold-500">
            <CrossIcon size={32} />
          </div>
          <h1 className="text-2xl font-light text-parchment-900 dark:text-neutral-100">
            365 com Deus
          </h1>
          <p className="text-sm text-parchment-500 dark:text-neutral-500 mt-1">
            {isSignUp ? "Cria a tua conta" : "Entra na tua conta"}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-parchment-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-parchment-700 dark:text-neutral-300 font-medium hover:bg-parchment-50 dark:hover:bg-neutral-800 transition-colors mb-6"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuar com Google
        </button>

        {/* Separador */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-parchment-200 dark:bg-neutral-800" />
          <span className="text-xs text-parchment-400 dark:text-neutral-600 uppercase tracking-wider">
            ou
          </span>
          <div className="flex-1 h-px bg-parchment-200 dark:bg-neutral-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="O teu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isSignUp}
              className="input-field"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Palavra-passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="input-field"
          />

          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
          )}
          {message && (
            <p className="text-emerald-600 dark:text-emerald-400 text-sm">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading
              ? "A processar..."
              : isSignUp
              ? "Criar conta"
              : "Entrar"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-parchment-500 dark:text-neutral-500 mt-6">
          {isSignUp ? "Já tens conta?" : "Ainda não tens conta?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setMessage("");
            }}
            className="text-gold-600 dark:text-gold-500 font-semibold hover:underline"
          >
            {isSignUp ? "Entrar" : "Criar conta"}
          </button>
        </p>
      </div>
    </main>
  );
}
