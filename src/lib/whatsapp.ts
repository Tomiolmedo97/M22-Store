export const WHATSAPP_NUMBER = "5491125050204";
export const WHATSAPP_DISPLAY = "+54 9 11 2505-0204";

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function orderMessage(design: string, size: string, qty = 1) {
  const units = qty > 1 ? `${qty} x ` : "";
  return `Hola M22shop! Quiero ${units}la remera "${design}" en talle ${size}.`;
}

export function cartOrderMessage(
  lines: { design: string; size: string; qty: number; price: number }[],
  total: number,
) {
  const list = lines
    .map((l) => `• ${l.qty} x "${l.design}" — talle ${l.size} ($${(l.price * l.qty).toLocaleString("es-AR")})`)
    .join("\n");
  return `Hola M22shop! Quiero hacer este pedido:\n\n${list}\n\nTotal: $${total.toLocaleString("es-AR")}`;
}
