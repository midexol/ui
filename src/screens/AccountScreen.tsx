import { AccountCard } from "@/components/AccountCard";
import { BalanceList } from "@/components/BalanceList";
import { useSorokit } from "@/context/SorokitProvider";

export function AccountScreen() {
  const { isConnected } = useSorokit();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-semibold text-[#ebebeb] tracking-tight">
          Account
        </h2>
        <p className="text-[13px] text-[#555555] mt-1.5">
          Account details and asset balances
        </p>
      </div>

      {!isConnected ? (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-10 text-center">
          <p className="text-[13px] text-[#555555]">
            Connect your wallet to view account details
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <AccountCard />
          <BalanceList />
        </div>
      )}
    </div>
  );
}
