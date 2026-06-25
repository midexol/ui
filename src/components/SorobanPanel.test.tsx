import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SorobanPanel } from "./SorobanPanel";
import { getClient } from "../lib/client";

const mockInvokeContract = vi.fn();

// Mock the getClient from lib/client
vi.mock("../lib/client", () => ({
  getClient: () => ({
    soroban: {
      invokeContract: mockInvokeContract,
    },
  }),
}));

vi.mock("@/context/useSorokit", () => ({
  useSorokit: () => ({
    isConnected: true,
    address: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWNA",
  }),
}));

describe("SorobanPanel", () => {
  beforeEach(() => {
    mockInvokeContract.mockReset();
  });

  it("should have invoke button disabled when method is empty", () => {
    render(<SorobanPanel contractId="" onContractIdChange={vi.fn()} />);
    const invokeBtn = screen.getByRole("button", { name: /invoke/i });
    expect(invokeBtn).toBeDisabled();
  });

  it("should show error when invalid JSON args are provided", async () => {
    const onContractIdChange = vi.fn();
    render(<SorobanPanel contractId="C123" onContractIdChange={onContractIdChange} />);
    
    const methodInput = screen.getByLabelText("Method");
    const argsInput = screen.getByLabelText("Arguments (JSON array)");
    const invokeBtn = screen.getByRole("button", { name: /invoke/i });

    fireEvent.change(methodInput, { target: { value: "mint" } });
    fireEvent.change(argsInput, { target: { value: "invalid json {" } });

    expect(invokeBtn).not.toBeDisabled();
    
    fireEvent.click(invokeBtn);

    const errorText = await screen.findByText(/Invalid JSON in arguments/i);
    expect(errorText).toBeInTheDocument();
  });

  it("should show error when invokeContract fails", async () => {
    mockInvokeContract.mockResolvedValueOnce({ data: null, error: "Contract execution failed" });
    
    const onContractIdChange = vi.fn();
    render(<SorobanPanel contractId="C123" onContractIdChange={onContractIdChange} />);
    
    const methodInput = screen.getByLabelText("Method");
    const invokeBtn = screen.getByRole("button", { name: /invoke/i });

    fireEvent.change(methodInput, { target: { value: "mint" } });
    fireEvent.click(invokeBtn);

    const errorText = await screen.findByText("Contract execution failed");
    expect(errorText).toBeInTheDocument();
  });

  it("should invoke contract successfully, show result, and reset state on Clear", async () => {
    mockInvokeContract.mockResolvedValueOnce({ data: { success: true, balance: 1000 }, error: null });
    
    const onContractIdChange = vi.fn();
    render(<SorobanPanel contractId="C123" onContractIdChange={onContractIdChange} />);
    
    const methodInput = screen.getByLabelText("Method");
    const argsInput = screen.getByLabelText("Arguments (JSON array)");
    const invokeBtn = screen.getByRole("button", { name: /invoke/i });

    fireEvent.change(methodInput, { target: { value: "balance" } });
    fireEvent.change(argsInput, { target: { value: '["GAAZI...", 42]' } });

    fireEvent.click(invokeBtn);

    // Verify result is displayed
    const resultHeader = await screen.findByText("Result");
    expect(resultHeader).toBeInTheDocument();
    expect(screen.getByText(/"balance": 1000/)).toBeInTheDocument();

    // Verify invokeContract parameters
    expect(mockInvokeContract).toHaveBeenCalledWith({
      contractId: "C123",
      method: "balance",
      args: ["GAAZI...", 42],
      sourceAccount: "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWNA",
    });

    // Verify Clear resets result
    const clearBtn = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearBtn);

    expect(screen.queryByText("Result")).not.toBeInTheDocument();
    expect(screen.queryByText(/"balance": 1000/)).not.toBeInTheDocument();
  });
});
