export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid input');
  return value as Record<string, unknown>;
}
export function text(value: unknown, min: number, max: number) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) throw new Error('Invalid text');
  return value.trim();
}
export function choice(value: unknown, choices: string[]) {
  if (typeof value !== 'string' || !choices.includes(value)) throw new Error('Invalid choice');
  return value;
}
export function integer(value: unknown, min: number, max: number) {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) throw new Error('Invalid number');
  return value;
}
export function id(value: unknown) {
  const s = text(value, 1, 19);
  if (!/^[1-9]\d*$/.test(s)) throw new Error('Invalid ID');
  return s;
}
export function date(value: unknown) {
  const s = text(value, 10, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || !Number.isFinite(Date.parse(s)) || new Date(s).toISOString().slice(0, 10) !== s) throw new Error('Invalid date');
  return s;
}
export function booking(value: unknown) {
  const b = object(value);
  const start = date(b.start_date), end = date(b.end_date);
  const days = (Date.parse(end) - Date.parse(start)) / 86400000 + 1;
  if (days < 1 || days > 366) throw new Error('Choose 1 to 366 days');
  const email = text(b.customer_email, 3, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email');
  const phone = text(b.customer_phone, 6, 40);
  if (!/^[+\d ()-]+$/.test(phone)) throw new Error('Invalid phone');
  const token = text(b.admin_request_id, 36, 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) throw new Error('Invalid request ID');
  if (typeof b.total_price !== 'number' || !Number.isFinite(b.total_price) || b.total_price < 0 || b.total_price > 99999999.99 || Math.abs(b.total_price * 100 - Math.round(b.total_price * 100)) > 0.00001) throw new Error('Invalid price');
  return { customer_name: text(b.customer_name, 2, 120), customer_email: email, customer_phone: phone,
    start_date: start, end_date: end, total_days: days, total_price: b.total_price,
    payment_method: choice(b.payment_method, ['cash', 'online']),
    status: 'confirmed', payment_status: 'unpaid', admin_request_id: token, booking_source: 'whatsapp' };
}
