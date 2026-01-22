import Head from "next/head";
import React, { useMemo, useState } from "react";

type Num = number | null;

function parseNum(value: string): Num {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatPercent(value: number): string {
  const rounded2 = Math.round(value * 100) / 100;
  const isInt = Math.abs(rounded2 - Math.round(rounded2)) < 1e-9;
  return `${isInt ? Math.round(rounded2) : rounded2.toFixed(2)}%`;
}

function formatMoney(value: number): string {
  const rounded2 = Math.round(value * 100) / 100;
  const isInt = Math.abs(rounded2 - Math.round(rounded2)) < 1e-9;

  return `$${(isInt ? Math.round(rounded2) : rounded2).toLocaleString("en-US", {
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: isInt ? 0 : 2,
  })}`;
}

export default function Home() {
  const [adSpend, setAdSpend] = useState("");
  const [adSales, setAdSales] = useState("");
  const [totalSales, setTotalSales] = useState("");

  const adSpendNum = useMemo(() => parseNum(adSpend), [adSpend]);
  const adSalesNum = useMemo(() => parseNum(adSales), [adSales]);
  const totalSalesNum = useMemo(() => parseNum(totalSales), [totalSales]);

  const [tacos, setTacos] = useState<number | null>(null);
  const [acos, setAcos] = useState<number | null>(null);
  const [organicSales, setOrganicSales] = useState<number | null>(null);
  const [organicPercent, setOrganicPercent] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  const canCalculate =
    adSpendNum !== null &&
    adSalesNum !== null &&
    totalSalesNum !== null &&
    adSpendNum >= 0 &&
    adSalesNum > 0 &&
    totalSalesNum > 0;

  const calculate = () => {
    setError(null);

    if (!canCalculate) {
      setError("Please enter valid numbers in all fields.");
      return;
    }

    if ((adSalesNum as number) > (totalSalesNum as number)) {
      setError("Ad Sales can't be greater than Total Sales.");
      return;
    }

    const spend = adSpendNum as number;
    const adsales = adSalesNum as number;
    const totalsales = totalSalesNum as number;

    const tacosValue = (spend / totalsales) * 100;
    const acosValue = (spend / adsales) * 100;
    const organic = totalsales - adsales;
    const organicPct = (organic / totalsales) * 100;

    setTacos(tacosValue);
    setAcos(acosValue);
    setOrganicSales(organic);
    setOrganicPercent(organicPct);
  };

  const clear = () => {
    setAdSpend("");
    setAdSales("");
    setTotalSales("");
    setTacos(null);
    setAcos(null);
    setOrganicSales(null);
    setOrganicPercent(null);
    setError(null);
  };

  const onNumberChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      // allow empty, digits, and a single dot
      if (v === "" || /^\d*\.?\d*$/.test(v)) setter(v);
    };

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta
          name="description"
          content="Calculate your Total Advertising Cost of Sales (TACoS) instantly."
        />
      </Head>

      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-6 text-xs text-slate-500">
            Home <span className="mx-1">→</span> Tools{" "}
            <span className="mx-1">→</span>{" "}
            <span className="font-medium text-slate-700">
              Amazon TACoS Calculator
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Amazon TACoS Calculator
          </h1>

          <p className="mt-4 text-base text-slate-600">
            Calculate your{" "}
            <span className="font-semibold text-slate-800">
              Total Advertising Cost of Sales (TACoS)
            </span>{" "}
            instantly.
            <br />
            Enter your total ad spend, ad sales, and total sales, then click
            calculate.
          </p>

          {/* Match ACOS-style narrower tool width */}
          <div className="mx-auto mt-10 max-w-[560px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="space-y-6 text-left">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Total Ad Spend ($)
                </label>
                <input
                  inputMode="decimal"
                  placeholder="e.g. 500"
                  className="h-12 w-full rounded-full border border-slate-200 px-5 text-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  value={adSpend}
                  onChange={onNumberChange(setAdSpend)}
                  onKeyDown={(e) => e.key === "Enter" && calculate()}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Ad Sales ($)
                </label>
                <input
                  inputMode="decimal"
                  placeholder="e.g. 2000"
                  className="h-12 w-full rounded-full border border-slate-200 px-5 text-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  value={adSales}
                  onChange={onNumberChange(setAdSales)}
                  onKeyDown={(e) => e.key === "Enter" && calculate()}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Total Sales ($)
                </label>
                <input
                  inputMode="decimal"
                  placeholder="e.g. 2500"
                  className="h-12 w-full rounded-full border border-slate-200 px-5 text-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  value={totalSales}
                  onChange={onNumberChange(setTotalSales)}
                  onKeyDown={(e) => e.key === "Enter" && calculate()}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {/* Match ACOS button size/feel */}
              <button
                type="button"
                onClick={calculate}
                disabled={!canCalculate}
                className={[
                  "h-12 w-full rounded-full font-semibold transition",
                  canCalculate
                    ? "bg-[#F6C344] text-slate-900 hover:brightness-95"
                    : "cursor-not-allowed bg-slate-100 text-slate-400",
                ].join(" ")}
              >
                Calculate Metrics
              </button>

              {(tacos !== null || acos !== null) && (
                <div className="rounded-2xl bg-[#FBF3DF] p-6 sm:p-7">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-[11px] font-semibold tracking-widest text-slate-500">
                        YOUR TACOS
                      </div>
                      <div className="mt-2 text-4xl font-extrabold">
                        {tacos === null ? "—" : formatPercent(tacos)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold tracking-widest text-slate-500">
                        YOUR ACOS
                      </div>
                      <div className="mt-2 text-4xl font-extrabold">
                        {acos === null ? "—" : formatPercent(acos)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-white px-5 py-4">
                    <div className="text-[11px] font-semibold tracking-widest text-slate-500">
                      ORGANIC SALES
                    </div>

                    {/* removes .00 like: $500 (20%) */}
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      {organicSales === null || organicPercent === null
                        ? "—"
                        : `${formatMoney(organicSales)} (${formatPercent(
                            organicPercent
                          )})`}
                    </div>
                  </div>

                  <div className="mt-5 text-center text-[11px] leading-5 text-slate-500">
                    TACoS = (Total Ad Spend ÷ Total Sales) × 100
                    <br />
                    ACoS = (Total Ad Spend ÷ Ad Sales) × 100
                  </div>

                  <button
                    type="button"
                    onClick={clear}
                    className="mx-auto mt-4 block text-sm font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Tip: Lower TACoS usually indicates stronger organic sales and a healthier business.
          </p>
        </div>
      </main>
    </>
  );
}
