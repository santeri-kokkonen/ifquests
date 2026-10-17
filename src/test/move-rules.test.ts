import { describe, it, expect } from "vitest";
import {
  tasks,
  moveTotal,
  canClaimMove,
  canCompleteMove,
  activeAward,
  moveRewards,
  coverageResult,
  canRentVan,
  VAN_ACTIVE_COST,
} from "@/lib/move-rules";
describe("MoveReady credit rules", () => {
  it("all nine quests total 1,000 MoveCredits", () =>
    expect(moveTotal(tasks.map((t) => t.id))).toBe(1000));
  for (const [id, value] of [
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
  it("crew pizza unlocks at 300, not 250", () => {
    expect(canClaimMove("pizza", ["valve", "lifting"], [])).toBe(false);
    expect(canClaimMove("pizza", ["valve", "tray"], [])).toBe(true);
  });
  it("sensor unlocks at 600, not 550", () => {
    expect(canClaimMove("leak-sensor", ["valve", "tray", "alarm"], [])).toBe(false);
    expect(canClaimMove("leak-sensor", ["valve", "tray", "alarm", "sensor"], [])).toBe(true);
  });
  it("photo checks require saved evidence", () => {
    expect(canCompleteMove("valve", {}, ["valve"], false)).toBe(false);
    expect(canCompleteMove("valve", { valve: "sample" }, ["valve"], false)).toBe(true);
  });
  it("crew must witness moving safety checks", () => {
    expect(canCompleteMove("alarm", {}, [], false)).toBe(false);
    expect(canCompleteMove("alarm", {}, ["alarm"], false)).toBe(true);
  });
  it("sensor setup waits for delivery", () => {
    expect(canCompleteMove("sensor", {}, ["sensor"], false)).toBe(false);
    expect(canCompleteMove("sensor", {}, ["sensor"], true)).toBe(true);
  });
  it("coverage guidance supports someone with no policy", () =>
    expect(coverageResult("none", "no", "no")).toContain("buying is not required"));
  it("coverage checks require no photo, helper or sensor delivery", () =>
    expect(canCompleteMove("coverage", {}, [], false)).toBe(true));
  it("activity cannot unlock a move reward", () =>
    expect(canClaimMove("pizza", [], [])).toBe(false));
  it("only customers accrue activity credits", () =>
    expect(activeAward(false, true, 0, 0, 50)).toBe(0));
  it("requires activity opt-in", () => expect(activeAward(true, false, 0, 0, 50)).toBe(0));
  it("caps activity credits daily", () => expect(activeAward(true, true, 40, 0, 50)).toBe(10));
  it("caps activity credits yearly", () => expect(activeAward(true, true, 0, 9990, 50)).toBe(10));
  it("invalid numeric activity data cannot corrupt credit balances", () => {
    expect(activeAward(true, true, Number.NaN, 0, 50)).toBe(0);
    expect(activeAward(true, true, 0, Infinity, 50)).toBe(0);
    expect(activeAward(true, true, -10, 0, 50)).toBe(0);
  });
  it("a rental van costs 150 ActiveCredits, not 100", () => {
    expect(VAN_ACTIVE_COST).toBe(150);
    expect(canRentVan(100, false)).toBe(false);
    expect(canRentVan(150, false)).toBe(true);
  });
  it("a rental van can only be booked once", () => expect(canRentVan(500, true)).toBe(false));
});
