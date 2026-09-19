import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { date } from './validation';
// Optional integration helper: keep the existing route and its response contract.
export async function availability(db: SupabaseClient, start: string, end: string) {
  date(start); date(end);
  const days = (Date.parse(end)-Date.parse(start))/86400000+1;
  if (days < 1 || days > 366) throw new Error('Invalid dates');
  const { data, error } = await db.rpc('ec_availability', { p_start: start, p_end: end });
  if (error || !data || data.length !== days) throw new Error('Availability unavailable');
  const availabilityByDate: Record<string, number> = {};
  for (const row of data as { day: string; available_scooters: number }[]) availabilityByDate[row.day] = row.available_scooters;
  const availableScooters = Math.min(...Object.values(availabilityByDate));
  return { success: true, available: availableScooters > 0, availableScooters,
    unavailableDates: Object.keys(availabilityByDate).filter(d => availabilityByDate[d] === 0),
    availabilityByDate, startDate: start, endDate: end };
}
