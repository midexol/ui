import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Dashboard } from "./Dashboard";
import { useSorokit } from "@/context/useSorokit";

vi.mock("@/context/useSorokit", () => ({
  useSorokit: vi.fn(),
}));

vi.mock("@/components/Sidebar", () => {
  return {
    Sidebar: ({ active, onNavigate }: any) => (
      <div data-testid="sidebar">
        <button onClick={() => onNavigate("transactions")}>Transactions</button>
        <span data-testid="active-nav">{active}</span>
      </div>
    ),
  };
});

vi.mock("@/components/TopBar", () => ({
  TopBar: () => <div data-testid="topbar" />,
}));

vi.mock("@/components/NetworkBanner", () => ({
  NetworkBanner: () => <div data-testid="network-banner" />,
}));

vi.mock("@/screens/WalletScreen", () => ({
  WalletScreen: () => <div data-testid="wallet-screen" />,
}));

vi.mock("@/screens/TransactionsScreen", () => ({
  TransactionsScreen: () => <div data-testid="transactions-screen" />,
}));

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(useSorokit).mockReturnValue({
      isConnected: true,
    } as any);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("restores the last active nav section from localStorage on mount", () => {
    localStorage.setItem("sorokit-active-nav", "transactions");
    render(<Dashboard />);
    expect(screen.getByTestId("active-nav").textContent).toBe("transactions");
    expect(screen.getByTestId("transactions-screen")).toBeInTheDocument();
  });

  it("persists active nav section to localStorage on navigation", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("active-nav").textContent).toBe("wallet");

    fireEvent.click(screen.getByRole("button", { name: "Transactions" }));
    expect(screen.getByTestId("active-nav").textContent).toBe("transactions");
    expect(localStorage.getItem("sorokit-active-nav")).toBe("transactions");
  });
});
