import { z } from "zod";
import { tasks, moveRewards } from "./move-rules";

export const DEMO_STORAGE_KEY = "if-quests-demo-v1";
export const initialState = {
  completed: [] as string[], photos: {} as Record<string, string>,
  confirmed: [] as string[], claimed: [] as string[], crew: [] as string[],
  active: 450, optIn: false, customer: true, daily: 0, yearly: 450,
  habits: [] as string[], cleaning: false, vanReserved: false, report: "",
  leakSteps: [] as string[], sensorArrived: false,
  leakAlert: false, faultLocation: "",
  faultDescription: "Water detected near the bathroom sink. Please inspect urgently.",
};
const strings = z.array(z.string()).catch([]);
const counter = (fallback: number) => z.number().finite().nonnegative().catch(fallback);
const schema = z.object({
  completed: strings, confirmed: strings, claimed: strings, crew: strings,
  photos: z.record(z.string()).catch({}), active: counter(450),
  optIn: z.boolean().catch(false), customer: z.boolean().catch(true),
  daily: counter(0), yearly: counter(450), habits: strings,
  cleaning: z.boolean().catch(false), vanReserved: z.boolean().catch(false),
  report: z.string().catch(""), leakSteps: strings, sensorArrived: z.boolean().catch(false),
  leakAlert: z.boolean().catch(false), faultLocation: z.string().catch(""),
  faultDescription: z.string().catch(initialState.faultDescription),
});
export type DemoState = typeof initialState;
export function decodeDemoState(raw: string | null): DemoState {
  if (!raw) return initialState;
  try {
    const envelope = JSON.parse(raw);
    if (envelope?.version !== 1) return initialState;
    const state = schema.parse(envelope.state);
    const ids = new Set<string>(tasks.map((task) => task.id));
    state.completed = [...new Set(state.completed.filter((id) => ids.has(id)))];
    state.confirmed = [...new Set(state.confirmed.filter((id) => ids.has(id)))];
    state.claimed = [...new Set(state.claimed.filter((id) => moveRewards.some((r) => r.id === id)))];
    state.crew = [...new Set(state.crew.map((name) => name.trim()).filter(Boolean))];
    state.leakSteps = [...new Set(state.leakSteps.filter((id) => ["water", "report", "evidence"].includes(id)))];
    state.photos = Object.fromEntries(Object.entries(state.photos).filter(([id, url]) =>
      (ids.has(id) || id === "leak") && /^(data:image\/|https:\/\/|\/(?!\/))/.test(url)));
    return state;
  } catch { return initialState; }
}
export function encodeDemoState(state: DemoState) {
  return JSON.stringify({ version: 1, state: {
    ...state, photos: Object.fromEntries(Object.entries(state.photos).filter(([, url]) => !url.startsWith("blob:"))),
  } });
}