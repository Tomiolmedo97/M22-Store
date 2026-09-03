export const WHATSAPP_NUMBER = "5491125050204";
export const WHATSAPP_DISPLAY = "+54 9 11 2505-0204";

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function orderMessage(design: string, size: string) {
  return `Hola M22shop! Quiero la remera "${design}" en talle ${size}.`;
}
