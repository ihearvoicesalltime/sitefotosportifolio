"use client";
import { FormEvent, useState } from "react";
import { browserSupabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
export default function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await browserSupabase().auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setBusy(false);
    setMessage(error ? error.message : "Verifique sua caixa de entrada para acessar com segurança.");
  }

  return <main className="flex min-h-screen items-center justify-center px-6"><div className="w-full max-w-md"><a href="/" className="font-display text-2xl">Lumen<span className="text-rust">.</span></a><h1 className="mt-16 font-display text-5xl">Bem-vindo de volta.</h1><p className="mt-4 text-sm text-mist">Digite seu e-mail do estúdio para receber um link seguro de acesso.</p><form onSubmit={submit} className="mt-10 space-y-4"><label className="block text-xs uppercase tracking-widest text-mist">E-mail do estúdio<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full border-b border-white/30 bg-transparent py-3 text-white outline-none focus:border-rust" /></label><button disabled={busy} className="w-full rounded-lg bg-rust py-4 text-sm text-white transition hover:opacity-85 disabled:opacity-50">{busy ? "Enviando…" : "Enviar link de acesso"}</button></form>{message && <p role="status" className="mt-5 text-sm text-rust">{message}</p>}<button onClick={() => router.push("/")} className="mt-12 text-sm text-mist underline hover:text-white">Voltar ao portfólio</button></div></main>;
}
