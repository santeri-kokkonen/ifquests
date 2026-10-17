import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMoveState } from "@/components/MoveProvider";

afterEach(() => vi.restoreAllMocks());
describe("Evidence photo lifecycle", () => {
  it("releases replaced uploads and the final upload when the session ends", () => {
    const create = vi.fn().mockReturnValueOnce("blob:first").mockReturnValueOnce("blob:second");
    const revoke = vi.fn();
    vi.stubGlobal("URL", class extends URL {
      static createObjectURL = create;
      static revokeObjectURL = revoke;
    });
    try {
      const { result, unmount } = renderHook(() => useMoveState());
      const file = new File(["photo"], "evidence.png", { type: "image/png" });
      act(() => { result.current.savePhotoFile("valve", file); });
      expect(result.current.photos.valve).toBe("blob:first");
      expect(revoke).not.toHaveBeenCalled();
      act(() => { result.current.savePhotoFile("valve", file); });
      expect(revoke).toHaveBeenCalledWith("blob:first");
      expect(revoke).not.toHaveBeenCalledWith("blob:second");
      unmount();
      expect(revoke).toHaveBeenCalledWith("blob:second");
    } finally { vi.unstubAllGlobals(); }
  });
  it("rejects non-image uploads without changing saved evidence", () => {
    const { result } = renderHook(() => useMoveState());
    const file = new File(["text"], "notes.txt", { type: "text/plain" });
    let error: string | null = null;
    act(() => { error = result.current.savePhotoFile("valve", file); });
    expect(error).not.toBeNull();
    expect(result.current.photos).toEqual({});
  });
});