import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMoveState } from "@/components/MoveProvider";
import { DEMO_STORAGE_KEY, decodeDemoState, encodeDemoState, initialState } from "@/lib/demo-storage";

describe("Local demo persistence", () => {
  it("restores credits, purchases, crew, task progress and fault draft after remount", () => {
    const first = renderHook(() => useMoveState());
    act(() => {
      first.result.current.setOptIn(true);
      first.result.current.earn("steps");
      first.result.current.rentVan();
      first.result.current.join("Sam");
      first.result.current.complete("coverage");
      first.result.current.setLeakAlert(true);
      first.result.current.setFaultLocation("Turku 12");
      first.result.current.setReport("Saved report");
      first.result.current.finishLeak("report");
    });
    first.unmount();
    const second = renderHook(() => useMoveState());
    expect(second.result.current.active).toBe(350);
    expect(second.result.current.vanReserved).toBe(true);
    expect(second.result.current.crew).toEqual(["Sam"]);
    expect(second.result.current.completed).toEqual(["coverage"]);
    expect(second.result.current.faultLocation).toBe("Turku 12");
    expect(second.result.current.report).toBe("Saved report");
    expect(second.result.current.leakAlert).toBe(true);
    act(() => second.result.current.earn("steps"));
    expect(second.result.current.active).toBe(350);
  });
  it("restores uploaded evidence as durable image data rather than an expired blob", async () => {
    vi.stubGlobal("URL", class extends URL {
      static override createObjectURL = vi.fn(() => "blob:upload");
      static override revokeObjectURL = vi.fn();
    });
    try {
      const first = renderHook(() => useMoveState());
      act(() => first.result.current.savePhotoFile("valve", new File(["photo"], "photo.png", { type: "image/png" })));
      await waitFor(() => expect(first.result.current.photos["valve"]).toMatch(/^data:image\/png/));
      const saved = first.result.current.photos["valve"];
      first.unmount();
      const second = renderHook(() => useMoveState());
      expect(second.result.current.photos["valve"]).toBe(saved);
    } finally { vi.unstubAllGlobals(); }
  });
  it("falls back safely for corrupted, unknown-version and malformed saved data", () => {
    expect(decodeDemoState("broken")).toEqual(initialState);
    expect(decodeDemoState('{"version":2}')).toEqual(initialState);
    const decoded = decodeDemoState(JSON.stringify({ version: 1, state: {
      active: -1, completed: ["coverage", "coverage", "unknown"], photos: { valve: "blob:expired", leak: "javascript:bad" }, crew: null,
    } }));
    expect(decoded.active).toBe(450);
    expect(decoded.completed).toEqual(["coverage"]);
    expect(decoded.photos).toEqual({});
    expect(decoded.crew).toEqual([]);
  });
  it("surfaces blocked browser storage without breaking actions", () => {
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    try {
      const { result } = renderHook(() => useMoveState());
      act(() => result.current.join("Sam"));
      expect(result.current.crew).toEqual(["Sam"]);
      expect(result.current.storageError).not.toBe("");
    } finally { write.mockRestore(); }
  });
  it("never serializes transient object URLs", () => {
    window.localStorage.setItem(DEMO_STORAGE_KEY, encodeDemoState({ ...initialState, photos: { valve: "blob:temporary" } }));
    expect(decodeDemoState(window.localStorage.getItem(DEMO_STORAGE_KEY)).photos).toEqual({});
  });
  it("rejects evidence over the 2 MB storage limit", () => {
    const { result } = renderHook(() => useMoveState());
    const file = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "large.png", { type: "image/png" });
    act(() => expect(result.current.savePhotoFile("valve", file)).not.toBeNull());
    expect(result.current.photos).toEqual({});
  });
});