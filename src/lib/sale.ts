import { cartCount, cartLines, type CartItem } from "@/lib/cart";

export const SALE_END = new Date("2026-10-01T00:00:00-03:00");
export const PACK_SIZE = 3;
export const PACK_PRICE = 70000;
export const UNIT_PROMO = 23000;
export const SHIPPING = 5000;

export function isSaleActive(now = Date.now()) {
  return now < SALE_END.getTime();
}

export function saleRemaining(now = Date.now()) {
  const ms = Math.max(0, SALE_END.getTime() - now);
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { ms, days, hours, minutes, seconds, done: ms === 0 };
}

export type CartQuote = {
  count: number;
  listSubtotal: number;
  packs: number;
  remainder: number;
  packValue: number;
  remainderValue: number;
  discount: number;
  saleOn: boolean;
  shipping: number;
  total: number;
};

export function quoteCart(items: CartItem[], now = Date.now()): CartQuote {
  const lines = cartLines(items);
  const count = cartCount(items);
  const units: number[] = [];
  for (const line of lines) {
    for (let i = 0; i < line.qty; i++) units.push(line.product.price);
  }
  const listSubtotal = units.reduce((s, p) => s + p, 0);
  const saleOn = isSaleActive(now);
  const packs = saleOn ? Math.floor(count / PACK_SIZE) : 0;
  const remainder = saleOn ? count % PACK_SIZE : count;
  const remainderUnits = saleOn ? units.slice(packs * PACK_SIZE) : units;
  const remainderValue = remainderUnits.reduce((s, p) => s + p, 0);
  const packValue = packs * PACK_PRICE;
  const saleSubtotal = saleOn ? packValue + remainderValue : listSubtotal;
  const discount = Math.max(0, listSubtotal - saleSubtotal);
  return {
    count,
    listSubtotal,
    packs,
    remainder,
    packValue,
    remainderValue,
    discount,
    saleOn,
    shipping: SHIPPING,
    total: saleSubtotal + SHIPPING,
  };
}
