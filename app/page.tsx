import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { serverSupabase } from "@/lib/supabase-server";
import type { Photo } from "@/lib/types";

async function getPhotos(): Promise<Photo[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await serverSupabase();
  const { data } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
  return (data || []) as Photo[];
}

export default async function Home() {
  const photos = await getPhotos();

  return (
    <main>
      <nav className="glass-header fixed inset-x-0 top-0 z-20 border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="font-display text-2xl tracking-tight">Lumen<span className="text-rust">.</span></Link>
          <div className="flex items-center gap-6 text-xs uppercase tracking-[.16em] text-mist sm:gap-8">
            <a href="#work" className="hidden hover:text-white sm:block">Trabalhos</a>
            <a href="#about" className="hidden hover:text-white sm:block">Sobre</a>
            <Link href="/admin/login" className="border-b border-rust pb-1 text-white hover:text-rust">Área do Estúdio</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-28 pt-40 md:px-10 md:pb-36 md:pt-52">
        <p className="mb-8 text-xs uppercase tracking-[.28em] text-rust animate-rise">Fotografia / Direção de arte</p>
        <h1 className="max-w-5xl font-display text-5xl leading-[.98] tracking-tight sm:text-7xl md:text-8xl animate-rise">
          Momentos discretos,<br /><i className="text-rust">marcados</i> pela intensidade.
        </h1>
        <div className="mt-16 flex items-end justify-between gap-8">
          <p className="max-w-sm text-sm leading-7 text-mist">Um estúdio visual independente que encontra poesia no cotidiano, da luz urbana às paisagens abertas.</p>
          <a href="#work" aria-label="Ir para projetos em destaque" className="rounded-full border border-white/25 p-4 text-white hover:border-rust hover:bg-rust"><ArrowDown size={18} /></a>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-32 md:px-10">
        <div className="mb-8 flex items-center justify-between border-b border-white/15 pb-4">
          <h2 className="font-display text-3xl">Projetos em Destaque</h2>
          <span className="text-xs uppercase tracking-widest text-mist">{photos.length.toString().padStart(2, "0")} imagens</span>
        </div>
        {photos.length ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {photos.map((photo) => (
              <figure key={photo.id} className="group mb-5 break-inside-avoid animate-rise">
                <div className="relative overflow-hidden rounded-xl bg-graphite shadow-2xl shadow-black/40">
                  <Image src={photo.image_url} alt={photo.title} width={1200} height={1600} loading="lazy" className="h-auto w-full transition duration-700 group-hover:scale-105" />
                </div>
                <figcaption className="flex justify-between gap-4 pt-3 text-sm"><span>{photo.title}</span><span className="text-mist">{photo.category}</span></figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/20 py-24 text-center text-mist">O acervo está sendo curado. Volte em breve.</div>
        )}
      </section>

      <section id="about" className="scroll-mt-24 border-t border-white/10 bg-graphite px-6 py-28 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          <h2 className="font-display text-5xl leading-none md:text-7xl">Imagens que<br /><i className="text-rust">parecem</i> memória.</h2>
          <div className="flex flex-col justify-between gap-10">
            <p className="max-w-md text-lg leading-8 text-white/65">Lumen é um estúdio de fotografia independente focado em ensaios editoriais, retratos e projetos de marcas.</p>
            <Link href="mailto:hello@lumen.studio" className="flex w-fit items-center gap-2 border-b border-rust pb-2 text-sm hover:text-rust">Iniciar uma conversa <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
      <footer className="flex justify-between px-6 py-7 text-xs text-mist md:px-10"><span>© {new Date().getFullYear()} Lumen Studio</span><span>Feito com intenção</span></footer>
    </main>
  );
}
