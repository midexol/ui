import { SorobanPanel } from "@/components/SorobanPanel";

export function SorobanScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-semibold text-[#ebebeb] tracking-tight">
          Soroban
        </h2>
        <p className="text-[13px] text-[#555555] mt-1.5">
          Invoke smart contracts on the Stellar network
        </p>
      </div>
      <SorobanPanel />
    </div>
  );
}
