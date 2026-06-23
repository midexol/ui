import { describe, it, expect } from "vitest";
import { truncateAddress } from "./utils";

describe("truncateAddress", () => {
  it("truncates standard ASCII strings correctly", () => {
    expect(truncateAddress("GA2C5RFPE6GCKIG3EQZ52V2Q4CQA2F4D5CFAOKL3TFRGZJ6A6K", 6, 4)).toBe("GA2C5R...6A6K");
  });

  it("returns the original string if it is shorter or equal to start + end length", () => {
    expect(truncateAddress("1234567890", 6, 4)).toBe("1234567890");
    expect(truncateAddress("123456789", 6, 4)).toBe("123456789");
  });

  it("returns empty string for empty input", () => {
    expect(truncateAddress("")).toBe("");
  });

  it("handles single-character strings", () => {
    expect(truncateAddress("A")).toBe("A");
  });

  it("safely truncates mixed unicode and emoji strings", () => {
    // 12 chars: "👋🌍🌞🌙⭐🌟🌠💫✨☄️🔥💧"
    const emojis = "👋🌍🌞🌙⭐🌟🌠💫✨☄️🔥💧";
    expect(truncateAddress(emojis, 3, 2)).toBe("👋🌍🌞...🔥💧");
  });
});
