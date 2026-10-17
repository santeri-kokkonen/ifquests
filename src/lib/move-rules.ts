export type Room = "before" | "kitchen" | "bathroom" | "entry";
export const rooms = [
  { id: "before", name: "Before you move", subtitle: "Sorted before you move in" },
  { id: "kitchen", name: "Kitchen", subtitle: "Small checks. Big protection." },
  { id: "bathroom", name: "Bathroom", subtitle: "Know your water shut-off" },
  { id: "entry", name: "Entry", subtitle: "A safe start at home" },
] as const;
export const tasks = [
  {
    id: "tray",
    room: "kitchen",
    name: "Check the dishwasher leak tray",
    credits: 150,
    photo: true,
    hint: "Look for a tray beneath the dishwasher and visible water or damage. Do not move hoses; report concerns to maintenance.",
  },
  {
    id: "alarm",
    room: "kitchen",
    name: "Test the smoke alarm",
    credits: 100,
    photo: false,
    hint: "Use the test button according to the alarm’s instructions. If it does not sound, contact your landlord or maintenance.",
  },
  {
    id: "valve",
    room: "bathroom",
    name: "Find the water shut-off valve",
    credits: 200,
    photo: true,
    hint: "Locate the valve and save a clear photo. Ask maintenance if you are unsure; do not force it.",
  },
  {
    id: "drain",
    room: "bathroom",
    name: "Check the floor drain",
    credits: 100,
    photo: false,
    hint: "Look for visible blockage around the drain cover or an unusual smell. Report concerns to maintenance.",
  },
  {
    id: "sensor",
    room: "bathroom",
    name: "Bring your leak sensor online",
    credits: 150,
    photo: false,
    hint: "After the sensor arrives, install and test it according to its instructions. Ask the supplier if you are unsure.",
  },
  {
    id: "condition",
    room: "entry",
    name: "Take move-in condition photos",
    credits: 100,
    photo: true,
    hint: "Record existing floor scratches and wall marks. Share the record with your landlord.",
  },
  {
    id: "lifting",
    room: "entry",
    name: "Complete the safe lifting check",
    credits: 50,
    photo: false,
    hint: "Clear your route, keep loads manageable and get help with heavy or awkward items.",
  },
  {
    id: "grip",
    room: "entry",
    name: "Check winter grip for your commute",
    credits: 50,
    photo: false,
    hint: "Check local conditions and choose footwear or traction aids suited to your route.",
  },
  {
    id: "coverage",
    room: "before",
    name: "Check your home coverage",
    credits: 100,
    photo: false,
    hint: "Three questions to see what needs checking. No purchase required.",
  },
] as const;
export const moveRewards = [
  {
    id: "pizza",
    name: "Pizza for your crew",
    cost: 300,
    detail: "A thank-you for the friends who show up.",
  },
  {
    id: "leak-sensor",
    name: "A leak sensor",
    cost: 600,
    detail: "An early warning for your new home.",
  },
] as const;
export const ACTIVE_DAILY_CAP = 50;
export const ACTIVE_YEARLY_CAP = 10000;
export const CLEANING_COST = 10000;
export const VAN_ACTIVE_COST = 6000;
export function moveTotal(completed: string[]) {
  return tasks.filter((t) => completed.includes(t.id)).reduce((sum, t) => sum + t.credits, 0);
}
export function canCompleteMove(
  id: string,
  photos: Record<string, string>,
  _confirmed: string[],
  sensorArrived: boolean,
) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return false;
  if (id === "coverage") return true;
  return (
    (!task.photo || Boolean(photos[id])) &&
    (id !== "sensor" || sensorArrived)
  );
}
export function canClaimMove(id: string, completed: string[], claimed: string[]) {
  const reward = moveRewards.find((r) => r.id === id);
  return Boolean(reward && moveTotal(completed) >= reward.cost && !claimed.includes(id));
}
export function activeAward(
  customer: boolean,
  optIn: boolean,
  daily: number,
  yearly: number,
  amount: number,
) {
  if (![daily, yearly, amount].every(Number.isFinite) || daily < 0 || yearly < 0 || amount < 0)
    return 0;
  return customer && optIn
    ? Math.max(0, Math.min(amount, ACTIVE_DAILY_CAP - daily, ACTIVE_YEARLY_CAP - yearly))
    : 0;
}
export function coverageResult(policy: string, liability: string, address: string) {
  if (policy === "none")
    return "You may need home contents and liability cover. Compare suitable policies before moving; buying is not required to finish this quest.";
  if (liability === "unsure" || liability === "no" || address !== "yes")
    return "Check your liability cover and new insured address with If before moving. No purchase is needed to complete this check.";
  return "Your answers suggest the basics are in place. Confirm limits, exclusions and the move date with If.";
}
export function canRentVan(active: number, alreadyBought: boolean) {
  return !alreadyBought && active >= VAN_ACTIVE_COST;
}
