import { useSorokit } from "@/context/SorokitProvider";
import { AccountCard } from "@/components/AccountCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { truncateAddress } from "@/lib/utils";

export function WalletScreen() {
  const { address, isConnected, disconnectWallet, network } = useSorokit();

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-[18px] font-semibold text-[#ebebeb] tracking-tight">
          Wallet
        </h2>
        <p className="text-[13px] text-[#555555] mt-1.5">
          Manage your connected wallet
        </p>
      </div>

      {/* Status */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[rgba(86,69,212,0.15)] border border-[rgba(86,69,212,0.3)] flex items-center justify-center text-[13px] font-bold text-[#5645d4] shrink-0">
              {address ? address.slice(0, 2) : "—"}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[14px] font-semibold text-[#ebebeb]">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
                <Badge variant={isConnected ? "success" : "default"} dot>
                  {isConnected ? "Active" : "Inactive"}
                </Badge>
              </div>
              {address && (
                <span data-address className="mt-1 block">
                  {truncateAddress(address, 12, 6)}
                </span>
              )}
            </div>
          </div>
          {isConnected && (
            <Button variant="secondary" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          )}
        </div>

        {network && (
          <div className="grid grid-cols-2 gap-5 mt-5 pt-5 border-t border-[#2a2a2a]">
            <InfoItem label="Network" value={network.name} />
            <InfoItem label="RPC Endpoint" value={network.rpcUrl} mono />
          </div>
        )}
      </div>

      <AccountCard />
    </div>
  );
}

function InfoItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-[#444444]">
        {label}
      </span>
      <span
        className={`text-[12px] text-[#999999] break-all ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
