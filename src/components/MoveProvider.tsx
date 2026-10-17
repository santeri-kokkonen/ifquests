import { createContext, useContext, useState, type ReactNode } from "react";
import {
  activeAward,
  canRentVan,
  canClaimMove,
  canCompleteMove,
  CLEANING_COST,
  moveTotal,
  VAN_ACTIVE_COST,
} from "@/lib/move-rules";
export function useMoveState() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [crew, setCrew] = useState<string[]>([]);
  const [active, setActive] = useState(450);
  const [optIn, setOptIn] = useState(false);
  const [customer, setCustomer] = useState(true);
  const [daily, setDaily] = useState(0);
  const [yearly, setYearly] = useState(450);
  const [habits, setHabits] = useState<string[]>([]);
  const [cleaning, setCleaning] = useState(false);
  const [vanReserved, setVanReserved] = useState(false);
  const [report, setReport] = useState("");
  const [leakSteps, setLeakSteps] = useState<string[]>([]);
  const [sensorArrived, setSensorArrived] = useState(false);
  return {
    completed,
    photos,
    confirmed,
    claimed,
    crew,
    active,
    optIn,
    setOptIn,
    customer,
    setCustomer,
    daily,
    yearly,
    habits,
    cleaning,
    vanReserved,
    report,
    setReport,
    leakSteps,
    sensorArrived,
    setSensorArrived,
    total: moveTotal(completed),
    complete: (id: string) => {
      if (canCompleteMove(id, photos, confirmed, sensorArrived)) {
        setCompleted((p) => (p.includes(id) ? p : [...p, id]));
      }
    },
    savePhoto: (id: string, url: string) => setPhotos((p) => ({ ...p, [id]: url })),
    confirm: (id: string) => setConfirmed((p) => (p.includes(id) ? p : [...p, id])),
    join: (name: string) => setCrew((p) => (p.includes(name) ? p : [...p, name])),
    claim: (id: string) => {
      if (canClaimMove(id, completed, claimed)) setClaimed((p) => [...p, id]);
    },
    earn: (id: string) => {
      if (habits.includes(id)) return;
      const award = activeAward(customer, optIn, daily, yearly, 50);
      if (!award) return;
      setActive((p) => p + award);
      setDaily((p) => p + award);
      setYearly((p) => p + award);
      setHabits((p) => [...p, id]);
    },
    redeemCleaning: () => {
      if (active >= CLEANING_COST && !cleaning) {
        setActive((p) => p - CLEANING_COST);
        setCleaning(true);
      }
    },
    rentVan: () => {
      if (canRentVan(active, vanReserved)) {
        setActive((p) => p - VAN_ACTIVE_COST);
        setVanReserved(true);
      }
    },
    finishLeak: (id: string) => setLeakSteps((p) => (p.includes(id) ? p : [...p, id])),
  };
}
type MoveState = ReturnType<typeof useMoveState>;
const Context = createContext<MoveState | null>(null);
export function MoveProvider({ children }: { children: ReactNode }) {
  const state = useMoveState();
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useMove() {
  const state = useContext(Context);
  if (!state) throw new Error("MoveProvider required");
  return state;
}
