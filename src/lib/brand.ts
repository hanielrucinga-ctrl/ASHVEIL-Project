export const BRAND_EMAIL = "ashveil.vg@gmail.com";
export const BRAND_SITE = "ashveilvg.baag.cc";
export const BAAG_STORE_URL = `https://${BRAND_SITE}`;
export const WHATSAPP_NUMBER = "250787360229";

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappOrderUrl(input: {
  name: string;
  size: string;
  qty: number;
  unitCents: number;
}) {
  const amount = ((input.unitCents * input.qty) / 100).toFixed(2);
  const text = [
    "Ashveil order",
    `Product: ${input.name}`,
    `Size: ${input.size}`,
    `Quantity: ${input.qty}`,
    `Amount: $${amount}`,
  ].join("\n");
  return whatsappUrl(text);
}

export type WhatsappOrderItem = {
  name: string;
  size: string;
  qty: number;
  unitCents: number;
};

export function whatsappCartOrderUrl(input: {
  name: string;
  phone: string;
  deliveryNotes: string;
  items: WhatsappOrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}) {
  const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const itemLines = input.items.map(
    (item) =>
      `- ${item.name} · ${item.size} ×${item.qty} — ${money(item.unitCents * item.qty)}`,
  );
  const text = [
    "Hello Ashveil, I’d like to place an order.",
    "",
    `Name: ${input.name.trim()}`,
    `WhatsApp: ${input.phone.trim()}`,
    ...(input.deliveryNotes.trim()
      ? [`Delivery notes: ${input.deliveryNotes.trim()}`]
      : []),
    "",
    "Items:",
    ...itemLines,
    "",
    `Subtotal: ${money(input.subtotalCents)}`,
    `Estimated shipping: ${input.shippingCents ? money(input.shippingCents) : "Free"}`,
    `Estimated total: ${money(input.totalCents)}`,
    "",
    "Please confirm availability, delivery, and payment options.",
  ].join("\n");
  return whatsappUrl(text);
}
