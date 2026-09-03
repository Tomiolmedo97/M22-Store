import { useMemo, useState } from "react";
import { MessageCircle, Shirt, Sparkles, Truck, X } from "lucide-react";
import {
  FRANCHISES,
  PRODUCTS,
  PRODUCT_DESCRIPTION,
  formatPrice,
  type Product,
} from "@/data/products";
import { WHATSAPP_DISPLAY, orderMessage, whatsappUrl } from "@/lib/whatsapp";

export function StorePage() {
  const [franchise, setFranchise] = useState("Todas");
  const [query, setQuery] = useState("");
  const [onlySale, setOnlySale] = useState(false);
  const [active, setActive] = useState<Product | null>(null);
  const [size, setSize] = useState("L");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (franchise !== "Todas" && p.franchise !== franchise) return false;
      if (onlySale && !p.discount) return false;
      if (!q) return true;
      return (
        p.design.toLowerCase().includes(q) ||
        p.franchise.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
      );
    });
  }, [franchise, query, onlySale]);

  const featured = PRODUCTS.filter((p) => p.featured);

  function openProduct(product: Product) {
    setActive(product);
    setSize("L");
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-ok/10 blur-3xl" />
      </div>

      <Header />

      <main className="relative">
        <Hero onShop={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })} />

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-sm tracking-[0.28em] text-primary">DESTACADOS</p>
              <h2 className="font-display text-4xl tracking-wide text-fg md:text-5xl">Skins de portada</h2>
            </div>
            <a href="#catalogo" className="hidden text-sm text-muted underline-offset-4 hover:text-fg hover:underline md:inline">
              Ver catálogo completo
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} compact onOpen={() => openProduct(p)} />
            ))}
          </div>
        </section>

        <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-display text-sm tracking-[0.28em] text-primary">INVENTARIO</p>
              <h2 className="font-display text-4xl tracking-wide text-fg md:text-5xl">Todas las remeras</h2>
              <p className="mt-1 text-sm text-muted">{filtered.length} diseños únicos · 100% algodón · DTF</p>
            </div>
            <label className="relative w-full md:max-w-xs">
              <span className="sr-only">Buscar</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar diseño o juego…"
                suppressHydrationWarning
                className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg outline-none placeholder:text-muted focus:border-primary"
              />
            </label>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOnlySale((v) => !v)}
              className={`h-10 rounded-full border px-3 text-xs font-semibold tracking-wide ${
                onlySale
                  ? "border-primary bg-primary text-primary-fg"
                  : "border-border bg-surface text-muted hover:text-fg"
              }`}
            >
              14% OFF
            </button>
            {FRANCHISES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setFranchise(name)}
                className={`h-10 rounded-full border px-3 text-xs font-semibold tracking-wide ${
                  franchise === name
                    ? "border-fg bg-fg text-bg"
                    : "border-border bg-surface text-muted hover:text-fg"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-lg border border-border bg-surface p-8 text-center text-muted">
              No hay remeras con ese filtro.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={() => openProduct(p)} />
              ))}
            </div>
          )}
        </section>

        <About />
        <Footer />
      </main>

      <a
        href={whatsappUrl("Hola M22shop! Quiero consultar por una remera.")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-ok px-5 font-semibold text-bg shadow-lg hover:brightness-110"
      >
        <MessageCircle className="size-5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      {active ? (
        <ProductModal
          product={active}
          size={size}
          onSize={setSize}
          onClose={() => setActive(null)}
        />
      ) : null}
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="M22 Shop"
            className="size-10 rounded-full object-cover"
          />
          <span className="font-display text-2xl tracking-wide text-fg">M22SHOP</span>
        </a>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#catalogo" className="hidden text-muted hover:text-fg sm:inline">
            Catálogo
          </a>
          <a href="#nosotros" className="hidden text-muted hover:text-fg sm:inline">
            La marca
          </a>
          <a
            href={whatsappUrl("Hola M22shop! Quiero hacer un pedido.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center rounded-full bg-primary px-4 font-semibold text-primary-fg"
          >
            Contacto
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onShop }: { onShop: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-[1.15fr_0.85fr] md:py-20">
        <div>
          <p className="font-display text-sm tracking-[0.32em] text-primary">PARA AQUELLOS QUE CRECIERON JUGANDO</p>
          <h1 className="mt-3 font-display text-6xl leading-[0.9] tracking-wide text-fg md:text-8xl">
            Tu fandom,
            <br />
            en algodón
            <br />
            negro.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
            Remeras de diseño único inspiradas en Half-Life, Expedition 33, Resident Evil y los clásicos que te formaron.
            Estampado DTF, 100% algodón, talles S a 5XL.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onShop}
              className="inline-flex h-12 items-center rounded-full bg-primary px-6 font-semibold text-primary-fg"
            >
              Ver remeras
            </button>
            <a
              href={whatsappUrl("Hola M22shop! Quiero consultar stock y talles.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-full border border-border bg-surface px-6 font-semibold text-fg"
            >
              Pedir por WhatsApp
            </a>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-3 text-center md:text-left">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Diseños</dt>
              <dd className="font-display text-3xl text-fg">{PRODUCTS.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Talles</dt>
              <dd className="font-display text-3xl text-fg">S–5XL</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Desde</dt>
              <dd className="font-display text-3xl text-fg">$30.000</dd>
            </div>
          </dl>
        </div>
        <div className="hud-frame relative aspect-square overflow-hidden rounded-lg bg-surface">
          <img
            src={PRODUCTS.find((p) => p.id.includes("half-life-waiting"))?.image}
            alt="Remera Half-Life"
            className="h-full w-full object-cover"
          />
          <div className="scanlines absolute inset-0" />
          <div className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-fg">
            14% OFF en Half-Life
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onOpen,
  compact = false,
}: {
  product: Product;
  onOpen: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group overflow-hidden rounded-lg border border-border bg-surface text-left transition hover:border-primary/60"
    >
      <div className={`relative overflow-hidden bg-raised ${compact ? "aspect-[4/5]" : "aspect-[4/5]"}`}>
        <img
          src={product.image}
          alt={product.design}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {product.discount ? (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-fg">
            {product.discount}% OFF
          </span>
        ) : null}
      </div>
      <div className="space-y-1 p-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted">{product.franchise}</p>
        <h3 className={`font-semibold leading-tight text-fg ${compact ? "text-sm" : "text-base"}`}>{product.design}</h3>
        <p className="text-sm tabular-nums">
          <span className="font-bold text-fg">{formatPrice(product.price)}</span>
          {product.compareAt ? (
            <span className="ml-2 text-muted line-through">{formatPrice(product.compareAt)}</span>
          ) : null}
        </p>
      </div>
    </button>
  );
}

function ProductModal({
  product,
  size,
  onSize,
  onClose,
}: {
  product: Product;
  size: string;
  onSize: (s: string) => void;
  onClose: () => void;
}) {
  const href = whatsappUrl(orderMessage(product.design, size));
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-0 sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0" aria-label="Cerrar" onClick={onClose} />
      <div className="relative grid max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-lg border border-border bg-surface sm:rounded-lg md:grid-cols-2">
        <div className="relative bg-raised">
          <img src={product.image} alt={product.design} className="h-full max-h-[46vh] w-full object-cover md:max-h-none" />
          {product.discount ? (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-fg">
              {product.discount}% OFF
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">{product.franchise}</p>
              <h2 className="font-display text-4xl tracking-wide text-fg">{product.design}</h2>
              <p className="text-sm text-muted">Remera {product.color} · Diseño único</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-border p-2 text-muted hover:text-fg">
              <X className="size-4" />
            </button>
          </div>
          <p className="text-xl font-bold tabular-nums text-fg">
            {formatPrice(product.price)}
            {product.compareAt ? (
              <span className="ml-2 text-sm font-medium text-muted line-through">{formatPrice(product.compareAt)}</span>
            ) : null}
          </p>
          <p className="text-sm leading-relaxed text-muted">{PRODUCT_DESCRIPTION}</p>
          <ul className="grid grid-cols-2 gap-2 text-xs text-muted">
            <li className="rounded-md border border-border bg-bg px-3 py-2">{product.material}</li>
            <li className="rounded-md border border-border bg-bg px-3 py-2">{product.print}</li>
          </ul>
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted">Talle</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSize(s)}
                  className={`h-10 min-w-10 rounded-md border px-3 text-sm font-semibold ${
                    size === s ? "border-fg bg-fg text-bg" : "border-border bg-bg text-fg hover:border-muted"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ok font-semibold text-bg"
          >
            <MessageCircle className="size-4" />
            Pedir talle {size} por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="nosotros" className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
        <div className="md:col-span-3">
          <p className="font-display text-sm tracking-[0.28em] text-primary">LA MARCA</p>
          <h2 className="font-display text-4xl tracking-wide text-fg md:text-5xl">Diseño único. Sólo acá.</h2>
        </div>
        <article className="rounded-lg border border-border bg-bg p-5">
          <Shirt className="mb-3 size-6 text-primary" />
          <h3 className="font-semibold text-fg">Algodón premium</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            100% algodón, corte cómodo para maratones nocturnas o para salir con tu fandom puesto.
          </p>
        </article>
        <article className="rounded-lg border border-border bg-bg p-5">
          <Sparkles className="mb-3 size-6 text-primary" />
          <h3 className="font-semibold text-fg">DTF de alta definición</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Cada arte está inspirado en portadas, mundos y frases que marcaron época. No es merch genérica.
          </p>
        </article>
        <article className="rounded-lg border border-border bg-bg p-5">
          <Truck className="mb-3 size-6 text-primary" />
          <h3 className="font-semibold text-fg">Pedido directo</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Elegís diseño y talle, y cerramos por WhatsApp {WHATSAPP_DISPLAY}.
          </p>
        </article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <a href="#top" className="flex items-center gap-3">
          <img src="/logo.png" alt="M22 Shop" className="h-10 w-10 rounded-full object-cover" />
          <p className="font-display text-2xl tracking-wide text-fg">M22SHOP</p>
        </a>
        <p className="text-sm text-muted">Para aquellos que crecieron jugando.</p>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="text-sm text-fg underline-offset-4 hover:underline">
          {WHATSAPP_DISPLAY}
        </a>
      </div>
    </footer>
  );
}
