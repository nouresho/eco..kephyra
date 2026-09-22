export function bookingInput(body: Record<string, unknown>) {
  const name = typeof body.customer_name === 'string' ? body.customer_name.trim() : '';
  const email = typeof body.customer_email === 'string' ? body.customer_email.trim().toLowerCase() : '';
  const phone = typeof body.customer_phone === 'string' ? body.customer_phone.trim() : '';
  const start = String(body.start_date ?? ''), end = String(body.end_date ?? '');
  const validDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
  const quantity = body.scooter_quantity === undefined ? 1 : body.scooter_quantity;
  if (typeof quantity !== 'number' || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10000) throw new Error('Choose a valid number of scooters.');
  const days = (Date.parse(end) - Date.parse(start)) / 86400000 + 1;
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Casablanca', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  if (name.length < 2 || name.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+\d ()-]{6,30}$/.test(phone) || !validDate(start) || !validDate(end) || start < today || !Number.isInteger(days) || days < 1 || days > 366) throw new Error('Please check your contact information and rental dates.');
  if (dailyRate(days) * days * quantity > 99999999.99) throw new Error('Please contact us for this group booking.');
  return { scooter_quantity: quantity, customer_name: name, customer_email: email, customer_phone: phone, start_date: start, end_date: end, total_days: days };
}
export function dailyRate(days: number) { return days >= 30 ? 120 : days >= 7 ? 155 : days >= 5 ? 170 : days >= 3 ? 180 : 200; }
