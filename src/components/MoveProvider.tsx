import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  activeAward,
  canRentVan,
  canClaimMove,
  canCompleteMove,
  CLEANING_COST,
  moveTotal,
  VAN_ACTIVE_COST,
} from "@/lib/move-rules";
import { DEMO_STORAGE_KEY, initialState, decodeDemoState, encodeDemoState } from "@/lib/demo-storage";

export function useMoveState() {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const ownedUrls = useRef(new Set<string>());
  const readers = useRef(new Set<FileReader>());
  useEffect(() => {
    try { setState(decodeDemoState(window.localStorage.getItem(DEMO_STORAGE_KEY))); }
    catch { setStorageError("Progress cannot be saved in this browser. Keep this tab open to retain your demo."); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(DEMO_STORAGE_KEY, encodeDemoState(state));
      setStorageError("");
    } catch {
      setStorageError("Progress could not be saved. Browser storage may be full or blocked; keep this tab open.");
    }
  }, [state, ready]);
  useEffect(() => {
    const retained = new Set(Object.values(state.photos));
    for (const url of ownedUrls.current) {
      if (!retained.has(url)) {
        URL.revokeObjectURL(url);
        ownedUrls.current.delete(url);
      }
    }
  }, [state.photos]);
  useEffect(() => {
    const urls = ownedUrls.current;
    const pending = readers.current;
    return () => {
      for (const reader of pending) reader.abort();
      pending.clear();
      for (const url of urls) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);
  const setOptIn = useCallback(
    (value: SetStateAction<boolean>) =>
      setState((p) => ({ ...p, optIn: typeof value === "function" ? value(p.optIn) : value })),
    [],
  );
  const setCustomer = useCallback(
    (value: SetStateAction<boolean>) =>
      setState((p) => ({
        ...p,
        customer: typeof value === "function" ? value(p.customer) : value,
      })),
    [],
  );
  const setSensorArrived = useCallback(
    (value: SetStateAction<boolean>) =>
      setState((p) => ({
        ...p,
        sensorArrived: typeof value === "function" ? value(p.sensorArrived) : value,
      })),
    [],
  );
  const setReport = useCallback(
    (value: SetStateAction<string>) =>
      setState((p) => ({ ...p, report: typeof value === "function" ? value(p.report) : value })),
    [],
  );
  const complete = useCallback(
    (id: string) =>
      setState((p) =>
        !p.completed.includes(id) && canCompleteMove(id, p.photos, p.confirmed, p.sensorArrived)
          ? { ...p, completed: [...p.completed, id] }
          : p,
      ),
    [],
  );
  const savePhoto = useCallback(
    (id: string, url: string) => setState((p) => ({ ...p, photos: { ...p.photos, [id]: url } })),
    [],
  );
  const savePhotoFile = useCallback(
    (id: string, file: File): string | null => {
      if (!file.type.startsWith("image/")) return "Please choose an image file.";
      if (file.size > 2 * 1024 * 1024) return "Please choose a photo smaller than 2 MB so it can be saved in this browser.";
      try {
        const url = URL.createObjectURL(file);
        ownedUrls.current.add(url);
        savePhoto(id, url);
        const reader = new FileReader();
        readers.current.add(reader);
        reader.onload = () => {
          readers.current.delete(reader);
          const photo = reader.result;
          if (typeof photo !== "string") return;
          setState((p) => p.photos[id] === url ? { ...p, photos: { ...p.photos, [id]: photo } } : p);
        };
        reader.onerror = () => {
          readers.current.delete(reader);
          setStorageError("This photo could not be saved for refreshes. Please choose another image.");
        };
        reader.readAsDataURL(file);
        return null;
      } catch {
        return "The photo could not be opened. Please try another image.";
      }
    },
    [savePhoto],
  );
  const confirm = useCallback(
    (id: string) =>
      setState((p) => (p.confirmed.includes(id) ? p : { ...p, confirmed: [...p.confirmed, id] })),
    [],
  );
  const join = useCallback((name: string) => {
    const helper = name.trim();
    if (!helper) return;
    setState((p) => (p.crew.includes(helper) ? p : { ...p, crew: [...p.crew, helper] }));
  }, []);
  const claim = useCallback(
    (id: string) =>
      setState((p) =>
        canClaimMove(id, p.completed, p.claimed) ? { ...p, claimed: [...p.claimed, id] } : p,
      ),
    [],
  );
  const earn = useCallback(
    (id: string) =>
      setState((p) => {
        if (p.habits.includes(id)) return p;
        const award = activeAward(p.customer, p.optIn, p.daily, p.yearly, 50);
        if (!award) return p;
        return {
          ...p,
          active: p.active + award,
          daily: p.daily + award,
          yearly: p.yearly + award,
          habits: [...p.habits, id],
        };
      }),
    [],
  );
  const redeemCleaning = useCallback(
    () =>
      setState((p) =>
        p.active >= CLEANING_COST && !p.cleaning
          ? { ...p, active: p.active - CLEANING_COST, cleaning: true }
          : p,
      ),
    [],
  );
  const rentVan = useCallback(
    () =>
      setState((p) =>
        canRentVan(p.active, p.vanReserved)
          ? { ...p, active: p.active - VAN_ACTIVE_COST, vanReserved: true }
          : p,
      ),
    [],
  );
  const finishLeak = useCallback(
    (id: string) =>
      setState((p) => (p.leakSteps.includes(id) ? p : { ...p, leakSteps: [...p.leakSteps, id] })),
    [],
  );
  const setLeakAlert = useCallback((value: boolean) => setState((p) => ({ ...p, leakAlert: value })), []);
  const setFaultLocation = useCallback((value: string) => setState((p) => ({ ...p, faultLocation: value })), []);
  const setFaultDescription = useCallback((value: string) => setState((p) => ({ ...p, faultDescription: value })), []);
  return {
    ...state,
    ready, storageError, setLeakAlert, setFaultLocation, setFaultDescription,
    total: moveTotal(state.completed),
    setOptIn,
    setCustomer,
    setReport,
    setSensorArrived,
    complete,
    savePhoto,
    savePhotoFile,
    confirm,
    join,
    claim,
    earn,
    redeemCleaning,
    rentVan,
    finishLeak,
  };
}
type MoveState = ReturnType<typeof useMoveState>;
const Context = createContext<MoveState | null>(null);
export function MoveProvider({ children }: { children: ReactNode }) {
  const state = useMoveState();
  return <Context.Provider value={state}>
    {state.storageError && <p role="alert" className="border-b bg-destructive/10 px-5 py-3 text-sm text-destructive">{state.storageError}</p>}
    {children}
  </Context.Provider>;
}
export function useMove() {
  const state = useContext(Context);
  if (!state) throw new Error("MoveProvider required");
  return state;
}
