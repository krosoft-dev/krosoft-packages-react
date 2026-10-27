import { describe, expect, it } from "vitest";
import { isHalloweenSeason, isSnowSeason } from "../../src/seasonal/seasons";

describe("isSnowSeason", () => {
  it.each([
    ["2026-12-01", true],
    ["2026-12-31", true],
    ["2026-11-30", false],
    ["2027-01-01", false],
  ])("%s → %s", (date, expected) => {
    expect(isSnowSeason(new Date(`${date}T12:00:00`))).toBe(expected);
  });
});

describe("isHalloweenSeason", () => {
  it.each([
    ["2026-10-24", false],
    ["2026-10-25", true],
    ["2026-10-31", true],
    ["2026-11-02", true],
    ["2026-11-03", false],
    ["2026-12-25", false],
  ])("%s → %s", (date, expected) => {
    expect(isHalloweenSeason(new Date(`${date}T12:00:00`))).toBe(expected);
  });
});
