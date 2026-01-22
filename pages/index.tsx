// pages/index.tsx
import Head from "next/head";
import React, { useMemo, useState } from "react";

function sanitizeNumberInput(value: string) {
  // allow digits + ONE decimal point
  let v = value.replace(/[^\d.]/g, "");
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    // remove any extra dots
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }
  return v;
}

function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function formatMoneySmart(n: number) {
  // No .00 if whole number, otherwise keep up to 2 decimals
  const isWhole = Math.abs(n - Math.round(n)) < 1e-9;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  });
}

function formatPercentSmart(n: number) {
  // No .00 if whole number, otherwise keep 2 decimals
  const isWhole = Math.abs(n - Math.round(n)) < 1e-9;
  return `${isWhole ? Math.round(n) : n.toFixed(2)}%`;
}

export default function Home() {
  const [adSpend, setAdSpend] = useState<string>("");
  const [adSales, setAdSales] = useState<string>("");
  const [totalSales, setTotalSales] = useState<string>("");

  const [tacos, setTacos] = useState<number | null>(null);
  const [acos, setAcos] = useState<number | null>(null);
  const [organicSales, setOrganicSales] = useState<number | null>(null);
  const [organicPercent, setOrganicPercent] = useState<number | null>(null);

  const adSpendNum = useMemo(() => toNumber(adSpend), [adSpend]);
  const adSalesNum = useMemo(() => toNumber(adSales), [adSales]);
  const totalSalesNum = useMemo(() => toNumber(totalSales), [totalSales]);

  const isValid = useMemo(() => {
    if (![adSpendNum, adSalesNum, totalSalesNum].every((n) => Number.isFinite(n))) return false;
    if (adSpendNum <= 0 || adSalesNum <= 0 || totalSalesNum <= 0) return false;
    if (adSalesNum > totalSalesNum) return false;
    return true;
  }, [adSpendNum, adSalesNum, totalSalesNum]);

  const calculate = () => {
    if (!isValid) return;

    const tacosVal = (adSpendNum / totalSalesNum) * 100;
    const acosVal = (adSpendNum / adSalesNum) * 100;
    const organicVal = totalSalesNum - adSalesNum;
    const organicPctVal = (organicVal / totalSalesNum) * 100;

    setTacos(tacosVal);
    setAcos(acosVal);
    setOrganicSales(organicVal);
    setOrganicPercent(organicPctVal);
  };

  const clear = () => {
    setAdSpend("");
    setAdSales("");
    setTotalSales("");
    setTacos(null);
    setAcos(null);
    setOrganicSales(null);
    setOrganicPercent(null);
  };

  const onKeyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      calculate();
    }
  };

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta name="description" content="Calculate your Amazon TACoS, ACoS and Organic Sales instantly." />
      </Head>

      <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-10">
          {/* Breadcrumb */}
          <div className="mb-6 text-center text-sm text-slate-500">
            Home <span className="mx-2">→</span> Tools <span className="mx-2">→</span>{" "}
            <span className="font-semibold text-slate-700">Amazon TACoS Calculator</span>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Amazon TACoS Calculator</h1>
            <p className="mt-4 text-slate-600">
              Calculate your <span className="font-semibold text-slate-800">Total Advertising Cost of Sales (TACoS)</span>{" "}
              instantly.
              <br />
              Enter your total ad spend, ad sales, and total sales, then click calculate.
            </p>
          </div>

          {/* Card (match ACoS tool width/feel) */}
          <div className="mx-auto mt-10 w-full max-w-2xl">
            <div className="rounded-2xl bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
              <div className="space-y-6">
                {/* Total Ad Spend */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800">Total Ad Spend ($)</label>
                  <div className="mt-2">
                    <input
                      value={adSpend}
                      onChange={(e) => setAdSpend(sanitizeNumberInput(e.target.value))}
                      onKeyDown={onKeyDownEnter}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="e.g. 500"
                      className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                    />
                  </div>
                </div>

                {/* Ad Sales */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800">Ad Sales ($)</label>
                  <div className="mt-2">
                    <input
                      value={adSales}
                      onChange={(e) => setAdSales(sanitizeNumberInput(e.target.value))}
                      onKeyDown={onKeyDownEnter}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="e.g. 2000"
                      className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                    />
                  </div>
                </div>

                {/* Total Sales */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800">Total Sales ($)</label>
                  <div className="mt-2">
                    <input
                      value={totalSales}
                      onChange={(e) => setTotalSales(sanitizeNumberInput(e.target.value))}
                      onKeyDown={onKeyDownEnter}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="e.g. 2500"
                      className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                    />
                  </div>

                  {/* Inline validation hint */}
                  {Number.isFinite(adSalesNum) &&
                    Number.isFinite(totalSalesNum) &&
                    adSalesNum > totalSalesNum && (
                      <p className="mt-2 text-sm text-red-600">
                        Ad Sales cannot be greater than Total Sales.
                      </p>
                    )}
                </div>

                {/* Button */}
                <button
                  onClick={calculate}
                  disabled={!isValid}
                  className={[
                    "mt-2 w-full rounded-full py-4 text-base font-semibold transition",
                    isValid
                      ? "bg-[#f2c94c] text-slate-900 hover:brightness-95"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed",
                  ].join(" ")}
                >
                  Calculate Metrics
                </button>

                {/* Results */}
                {tacos !== null && acos !== null && organicSales !== null && organicPercent !== null && (
                  <div className="rounded-2xl bg-[#f7f0df] p-7">
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="text-xs font-bold tracking-widest text-slate-500">YOUR TACOS</div>
                        <div className="mt-2 text-4xl font-extrabold text-slate-900">{formatPercentSmart(tacos)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-widest text-slate-500">YOUR ACOS</div>
                        <div className="mt-2 text-4xl font-extrabold text-slate-900">{formatPercentSmart(acos)}</div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-xl bg-white p-5">
                      <div className="text-xs font-bold tracking-widest text-slate-500">ORGANIC SALES</div>

                      {/* Add spacing like ACoS label/input spacing (this was your ask) */}
                      <div className="mt-2 text-lg font-bold text-slate-900">
                        {formatMoneySmart(organicSales)} ({formatPercentSmart(organicPercent)})
                      </div>
                    </div>

                    <div className="mt-6 text-center text-xs text-slate-600">
                      <div>TACoS = (Total Ad Spend ÷ Total Sales) × 100</div>
                      <div>ACoS = (Total Ad Spend ÷ Ad Sales) × 100</div>
                    </div>

                    <button
                      onClick={clear}
                      className="mx-auto mt-4 block text-sm font-semibold text-slate-800 underline underline-offset-4"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Tip: Lower TACoS usually indicates stronger organic sales and a healthier business.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
