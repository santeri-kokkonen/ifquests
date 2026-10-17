import { act, renderHook } from "@testing-library/react";
import { StrictMode, useEffect, type ReactNode } from "react";
import { describe, it, expect } from "vitest";
import { useMoveState } from "@/components/MoveProvider";
describe("MoveReady session actions", () => {
  it("repeated StrictMode effects cannot award daily steps twice", () => {
    const { result } = renderHook(
      () => {
        const state = useMoveState();
        const { setOptIn, earn } = state;
        useEffect(() => {
          setOptIn(true);
          earn("steps");
        }, [setOptIn, earn]);
        return state;
      },
      { wrapper: ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode> },
    );
    expect(result.current.active).toBe(10500);
    expect(result.current.daily).toBe(50);
    expect(result.current.habits).toEqual(["steps"]);
  });
  it("batched repeated earning never exceeds the 50-credit daily cap", () => {
    const { result } = renderHook(() => useMoveState());
    act(() => {
      result.current.setOptIn(true);
      result.current.earn("steps");
      result.current.earn("steps");
      result.current.earn("battery");
    });
    expect(result.current.active).toBe(10500);
    expect(result.current.daily).toBe(50);
    expect(result.current.yearly).toBe(10500);
    expect(result.current.habits).toEqual(["steps"]);
  });
  it("batched purchases do not spend the same balance twice", () => {
    const { result } = renderHook(() => useMoveState());
    act(() => {
      result.current.redeemCleaning();
      result.current.redeemCleaning();
      result.current.rentVan();
    });
    expect(result.current.active).toBe(450);
    expect(result.current.cleaning).toBe(true);
    expect(result.current.vanReserved).toBe(false);
  });
  it("batched van bookings are charged only once", () => {
    const { result } = renderHook(() => useMoveState());
    act(() => {
      result.current.rentVan();
      result.current.rentVan();
    });
    expect(result.current.active).toBe(4450);
    expect(result.current.vanReserved).toBe(true);
  });
  it("batched evidence and witness updates are available to completion", () => {
    const { result } = renderHook(() => useMoveState());
    act(() => {
      result.current.savePhoto("valve", "sample");
      result.current.confirm("valve");
      result.current.complete("valve");
      result.current.complete("valve");
    });
    expect(result.current.completed).toEqual(["valve"]);
    expect(result.current.total).toBe(200);
  });
  it("batched milestone claims cannot duplicate a reward", () => {
    const { result } = renderHook(() => useMoveState());
    act(() => {
      result.current.savePhoto("valve", "sample");
      result.current.confirm("valve");
      result.current.complete("valve");
      result.current.complete("coverage");
      result.current.claim("pizza");
      result.current.claim("pizza");
    });
    expect(result.current.claimed).toEqual(["pizza"]);
    expect(result.current.total).toBe(300);
  });
  it("annual smoke alarm check cannot pay twice in the demo year", () => {
    const { result } = renderHook(() => useMoveState());
    act(() => result.current.setOptIn(true));
    act(() => result.current.earn("annual-alarm"));
    act(() => result.current.earn("annual-alarm"));
    expect(result.current.active).toBe(10500);
    expect(result.current.habits).toEqual(["annual-alarm"]);
  });
  it("sensor battery check is an inclusive alternative to step rewards", () => {
    const { result } = renderHook(() => useMoveState());
    act(() => result.current.setOptIn(true));
    act(() => result.current.earn("battery"));
    expect(result.current.active).toBe(10500);
    expect(result.current.completed).toEqual([]);
  });
  it("cleaning needs 10000 ActiveCredits and never uses MoveCredits", () => {
    const { result } = renderHook(() => useMoveState());
    const before = result.current.active;
    act(() => result.current.complete("coverage"));
    act(() => result.current.redeemCleaning());
    expect(result.current.cleaning).toBe(false);
    expect(result.current.active).toBe(before);
    expect(result.current.total).toBe(100);
  });
  it("completing a check never bypasses its crew witness", () => {
    const { result } = renderHook(() => useMoveState());
    act(() => result.current.complete("alarm"));
    expect(result.current.total).toBe(0);
    act(() => result.current.confirm("alarm"));
    act(() => result.current.complete("alarm"));
    expect(result.current.total).toBe(100);
  });
  it("a rental van cannot be bought without 6000 ActiveCredits", () => {
    const { result } = renderHook(() => useMoveState());
    const before = result.current.active;
    act(() => result.current.rentVan());
    expect(result.current.active).toBe(before);
    expect(result.current.vanReserved).toBe(false);
  });
});
