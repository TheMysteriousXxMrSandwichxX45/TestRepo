import { afterEach, describe, expect, it, vi } from "vitest";

import { formatTimeDelta } from "#/utils/format-time-delta";

describe("formatTimeDelta", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ["2025-01-01T11:59:59Z", "1s"],
    ["2025-01-01T11:59:00Z", "1m"],
    ["2025-01-01T11:00:00Z", "1h"],
    ["2024-12-31T12:00:00Z", "1d"],
    ["2024-12-02T12:00:00Z", "1mo"],
    ["2024-01-02T12:00:00Z", "1y"],
  ])("formats %s as %s", (timestamp, expected) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T12:00:00Z"));

    expect(formatTimeDelta(timestamp)).toBe(expected);
  });

  it("interprets timezone-less timestamps as UTC", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T12:00:00Z"));

    expect(formatTimeDelta("2025-01-01T11:00:00")).toBe("1h");
  });

  it.each(["2025-01-01T11:00:00z", "2025-01-01T12:00:00+0100"])(
    "recognizes the timezone in %s",
    (timestamp) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-01T12:00:00Z"));

      expect(formatTimeDelta(timestamp)).toBe("1h");
    },
  );

  it("clamps future timestamps caused by clock skew", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T12:00:00Z"));

    expect(formatTimeDelta("2025-01-01T12:00:05Z")).toBe("0s");
  });
});
