import { describe, it, expect } from "vitest";
import { tasks, moveTotal, canClaimMove, activeAward, moveRewards } from "@/lib/move-rules";
describe("MoveReady credit rules", () => {
  it("all ten quests total 1,100 MoveCredits", () =>
    expect(moveTotal(tasks.map((t) => t.id))).toBe(1100));
  for (const [id, value] of [
    ["old-photos", 100],
    ["tray", 150],
    ["alarm", 100],
    ["valve", 200],
    ["drain", 100],
    ["sensor", 150],
    ["condition", 100],
    ["lifting", 50],
    ["grip", 50],
    ["coverage", 100],
  ] as const)
    it(`${id} earns ${value}`, () => expect(moveTotal([id])).toBe(value));
  for (const [id, cost] of [
    ["trailer", 100],
    ["pizza", 300],
    ["leak-sensor", 600],
  ] as const)
    it(`${id} unlocks at ${cost}`, () => {
      expect(moveRewards.find((r) => r.id === id)?.cost).toBe(cost);
      expect(canClaimMove(id, [], [])).toBe(false);
      expect(
        canClaimMove(
          id,
          tasks.map((t) => t.id),
          [],
        ),
      ).toBe(true);
      expect(
        canClaimMove(
          id,
          tasks.map((t) => t.id),
          [id],
        ),
      ).toBe(false);
    });
  it("duplicate quests never award twice", () => expect(moveTotal(["valve", "valve"])).toBe(200));
  it("activity cannot unlock a move reward", () =>
    expect(canClaimMove("pizza", [], [])).toBe(false));
  it("only customers accrue activity credits", () =>
    expect(activeAward(false, true, 0, 0, 50)).toBe(0));
  it("requires activity opt-in", () => expect(activeAward(true, false, 0, 0, 50)).toBe(0));
  it("caps activity credits daily", () => expect(activeAward(true, true, 40, 0, 50)).toBe(10));
  it("caps activity credits yearly", () => expect(activeAward(true, true, 0, 9990, 50)).toBe(10));
});
