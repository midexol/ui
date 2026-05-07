import { TransactionPanel } from "@/components/TransactionPanel";

export function TransactionsScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-semibold text-[#ebebeb] tracking-tight">
          Transactions
        </h2>
        <p className="text-[13px] text-[#555555] mt-1.5">
          Submit payments on the Stellar network
        </p>
      </div>
      <TransactionPanel />
    </div>
  );
}
