import { useEffect, useMemo, useState } from "react";
import { Instagram, MessageCircle, Minus, Plus, Shirt, ShoppingBag, Sparkles, Trash2, Truck, Twitch, Youtube, X } from "lucide-react";
import {
  FRANCHISES,
  PRODUCTS,
  PRODUCT_DESCRIPTION,
  formatPrice,
  type Product,
} from "@/data/products";
import { cartCount, cartLines, cartTotal, useCart } from "@/lib/cart";
import { WHATSAPP_DISPLAY, cartOrderMessage, whatsappUrl } from "@/lib/whatsapp";

export function StorePage() {
  const [franchise, setFranchise] = useState("Todas");
  const [query, setQuery] = useState("");
  const [onlySale, setOnlySale] = useState(false);
  const [active, setActive] = useState<Product | null>(null);
  const [size, setSize] = useState("L");
  const [qty, setQty] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const items = useCart((s) => s.items);

  useEffect(() => {
    setHydrated(true);
  }, []);

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
    setQty(1);
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-ok/10 blur-3xl" />
      </div>

      <Header count={hydrated ? cartCount(items) : 0} onCart={() => setCartOpen(true)} />

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
        <Socials />
        <Footer />
      </main>

      <a
        href={whatsappUrl("Hola M22shop! Quiero consultar por una remera.")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 left-5 z-40 flex h-14 items-center gap-2 rounded-full bg-ok px-5 font-semibold text-bg shadow-lg hover:brightness-110"
      >
        <MessageCircle className="size-5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-fg shadow-lg"
      >
        <ShoppingBag className="size-5" />
        <span>Pedido</span>
        {hydrated && cartCount(items) > 0 ? (
          <span className="grid min-w-6 place-items-center rounded-full bg-bg px-1.5 text-xs text-fg">
            {cartCount(items)}
          </span>
        ) : null}
      </button>

      {active ? (
        <ProductModal
          product={active}
          size={size}
          qty={qty}
          onSize={setSize}
          onQty={setQty}
          onClose={() => setActive(null)}
          onAdded={() => setCartOpen(true)}
        />
      ) : null}

      {cartOpen ? <CartDrawer onClose={() => setCartOpen(false)} /> : null}
    </div>
  );
}

function Header({ count, onCart }: { count: number; onCart: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-2 md:py-0">
        <div className="flex h-14 items-center justify-between gap-3 md:h-16">
          <a href="#top" className="flex min-w-0 items-center gap-2">
            <img src="/logo.png" alt="M22 Shop" className="size-10 shrink-0 rounded-full object-cover" />
            <span className="font-display text-xl tracking-wide text-fg sm:text-2xl">M22SHOP</span>
          </a>
          <div className="hidden md:block">
            <SocialIcons size="sm" />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onCart}
              className="relative inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 font-semibold text-fg"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">Pedido</span>
              {count > 0 ? (
                <span className="grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-fg">
                  {count}
                </span>
              ) : null}
            </button>
            <a
              href={whatsappUrl("Hola M22shop! Quiero hacer un pedido.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center rounded-full bg-primary px-3 font-semibold text-primary-fg sm:px-4"
            >
              Contacto
            </a>
          </div>
        </div>
        <div className="flex justify-center pb-1 md:hidden">
          <SocialIcons size="sm" />
        </div>
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
  qty,
  onSize,
  onQty,
  onClose,
  onAdded,
}: {
  product: Product;
  size: string;
  qty: number;
  onSize: (s: string) => void;
  onQty: (n: number) => void;
  onClose: () => void;
  onAdded: () => void;
}) {
  const add = useCart((s) => s.add);
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
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted">Cantidad</p>
            <div className="inline-flex items-center rounded-md border border-border bg-bg">
              <button type="button" className="grid size-10 place-items-center" onClick={() => onQty(Math.max(1, qty - 1))}>
                <Minus className="size-4" />
              </button>
              <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
              <button type="button" className="grid size-10 place-items-center" onClick={() => onQty(qty + 1)}>
                <Plus className="size-4" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              add(product.id, size, qty);
              onClose();
              onAdded();
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-fg"
          >
            <ShoppingBag className="size-4" />
            Sumar {qty} al pedido · {formatPrice(product.price * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ onClose }: { onClose: () => void }) {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const lines = cartLines(items);
  const total = cartTotal(items);
  const href = whatsappUrl(
    cartOrderMessage(
      lines.map((l) => ({ design: l.product.design, size: l.size, qty: l.qty, price: l.product.price })),
      total,
    ),
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-bg/80">
      <button type="button" className="absolute inset-0" aria-label="Cerrar pedido" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Tu pedido</p>
            <h2 className="font-display text-3xl tracking-wide text-fg">Carrito</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-border p-2 text-muted hover:text-fg">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {lines.length === 0 ? (
            <p className="rounded-lg border border-border bg-bg p-6 text-center text-sm text-muted">
              Todavía no sumaste remeras. Elegí un diseño y un talle.
            </p>
          ) : (
            <ul className="space-y-3">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.size}`} className="flex gap-3 rounded-lg border border-border bg-bg p-3">
                  <img src={line.product.image} alt={line.product.design} className="size-16 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-fg">{line.product.design}</p>
                    <p className="text-xs text-muted">Talle {line.size}</p>
                    <p className="text-sm font-semibold tabular-nums text-fg">{formatPrice(line.product.price * line.qty)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-md border border-border">
                        <button type="button" className="grid size-8 place-items-center" onClick={() => setQty(line.productId, line.size, line.qty - 1)}>
                          <Minus className="size-3" />
                        </button>
                        <span className="min-w-6 text-center text-xs font-semibold tabular-nums">{line.qty}</span>
                        <button type="button" className="grid size-8 place-items-center" onClick={() => setQty(line.productId, line.size, line.qty + 1)}>
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.productId, line.size)}
                        className="grid size-8 place-items-center rounded-md text-muted hover:text-primary"
                        aria-label="Sacar del pedido"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted">Total</span>
            <span className="text-lg font-bold tabular-nums text-fg">{formatPrice(total)}</span>
          </div>
          {lines.length > 0 ? (
            <div className="flex flex-col gap-2">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ok font-semibold text-bg"
              >
                <MessageCircle className="size-4" />
                Pedir {cartCount(items)} por WhatsApp
              </a>
              <button type="button" onClick={clear} className="h-10 text-sm text-muted hover:text-fg">
                Vaciar pedido
              </button>
            </div>
          ) : (
            <button type="button" onClick={onClose} className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary font-semibold text-primary-fg">
              Seguir mirando
            </button>
          )}
        </div>
      </aside>
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

function Socials() {
  return (
    <section id="redes" className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14">
        <div>
          <p className="font-display text-sm tracking-[0.28em] text-primary">REDES</p>
          <h2 className="font-display text-4xl tracking-wide text-fg">Seguí a Maruko22</h2>
        </div>
        <SocialIcons size="md" />
        <a
          href="https://m22shop.taplink.bio/"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Todos los links en Taplink
        </a>
      </div>
    </section>
  );
}

function SocialIcons({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-9" : "size-12";
  const icon = size === "sm" ? "size-4" : "size-6";
  const items = [
    { name: "Instagram", href: "https://instagram.com/soymaruko22/", icon: Instagram },
    { name: "YouTube", href: "https://www.youtube.com/@Maruko22", icon: Youtube },
    { name: "Twitch", href: "https://www.twitch.tv/maruko22", icon: Twitch },
    { name: "TikTok", href: "https://www.tiktok.com/@soymaruko22", icon: TikTokIcon },
  ];
  return (
    <div className="flex items-center gap-2">
      {items.map((n) => (
        <a
          key={n.name}
          href={n.href}
          target="_blank"
          rel="noreferrer"
          aria-label={n.name}
          title={n.name}
          className={`grid ${box} place-items-center rounded-full border border-border bg-surface text-fg transition hover:border-primary hover:text-primary`}
        >
          <n.icon className={icon} />
        </a>
      ))}
    </div>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M14.5 3h2.1c.2 1.8 1.5 3.3 3.4 3.7v2.2c-1.2 0-2.3-.4-3.2-1v6.4c0 3.4-2.7 6.2-6.2 6.2S4.4 17.7 4.4 14.3 7.1 8.1 10.6 8.1c.3 0 .6 0 .9.1v2.4c-.3-.1-.6-.1-.9-.1-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8 3.8-1.7 3.8-3.8V3z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <a href="#top" className="flex items-center gap-3">
          <img src="/logo.png" alt="M22 Shop" className="h-10 w-10 rounded-full object-cover" />
          <p className="font-display text-2xl tracking-wide text-fg">M22SHOP</p>
        </a>
        <SocialIcons size="md" />
        <a
          href="https://m22shop.taplink.bio/"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          m22shop.taplink.bio
        </a>
      </div>
    </footer>
  );
}
