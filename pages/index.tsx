import Head from "next/head";
import React, { useMemo, useState } from "react";

const isValidNumber = (value: string) => {
  if (value.trim() === "") return false;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0;
};

const formatMoney = (value: number) => {
  // show no decimals unless needed
  const isInt = Math.abs(value - Math.round(value)) < 1e-9;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: isInt ? 0 : 2,
  }).format(value);

  // Intl returns e.g. "$500" already; keep as-is
  return formatted;
};

const formatPercent = (value: number) => {
  const rounded2 = Math.round(value * 100) / 100;
  const isInt = Math.abs(rounded2 - Math.round(rounded2)) < 1e-9;
  return `${isInt ? Math.round(rounded2) : rounded2.toFixed(2)}%`;
};

export default function Home() {
  const [adSpend, setAdSpend] = useState("");
  const [adSales, setAdSales] = useState("");
  const [totalSales, setTotalSales] = useState("");

  const [tacos, setTacos] = useState<number | null>(null);
  const [acos, setAcos] = useState<number | null>(null);
  const [organicSales, setOrganicSales] = useState<number | null>(null);
  const [organicPercent, setOrganicPercent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);

    if (!isValidNumber(adSpend) || !isValidNumber(adSales) || !isValidNumber(totalSales)) {
      setError("Please enter valid non-negative numbers in all fields.");
      return;
    }

    const adSpendNum = Number(adSpend);
    const adSalesNum = Number(adSales);
    const totalSalesNum = Number(totalSales);

    if (totalSalesNum === 0) {
      setError("Total Sales must be greater than 0.");
      return;
    }

    if (adSalesNum === 0) {
      setError("Ad Sales must be greater than 0.");
      return;
    }

    if (adSalesNum > totalSalesNum) {
      setError("Ad Sales can't be greater than Total Sales.");
      return;
    }

    const spend = adSpendNum;
    const adsales = adSalesNum;
    const totalsales = totalSalesNum;

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

  const tacosLabel = useMemo(() => (tacos == null ? "--" : formatPercent(tacos)), [tacos]);
  const acosLabel = useMemo(() => (acos == null ? "--" : formatPercent(acos)), [acos]);

  const organicSalesLabel = useMemo(() => {
    if (organicSales == null || organicPercent == null) return "--";
    return `${formatMoney(organicSales)} (${formatPercent(organicPercent)})`;
  }, [organicSales, organicPercent]);

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta name="description" content="Calculate your Total Advertising Cost of Sales (TACoS) instantly." />
      </Head>

      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-6 text-xs text-slate-500">
            Home <span className="mx-1">→</span> Tools <span className="mx-1">→</span>{" "}
            <span className="font-medium text-slate-700">Amazon TACoS Calculator</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Amazon TACoS Calculator
          </h1>

          {/* ✅ Keep as ONE combined paragraph (mobile wraps naturally, but stays “together”) */}
          <p className="mt-4 text-base text-slate-600">
            Calculate your{" "}
            <span className="font-semibold text-slate-800">
              Total Advertising Cost of Sales (TACoS)
            </span>{" "}
            instantly. Enter your total ad spend, ad sales, and total sales, then click calculate.
          </p>

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
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
                <label className="mb-2 block text-sm font-semibold text-slate-800">Ad Sales ($)</label>
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
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Button size matches ACoS tool */}
              <button
                onClick={calculate}
                className="h-12 w-full rounded-full bg-[#F2C94C] font-semibold text-slate-900 transition hover:brightness-95 active:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!adSpend || !adSales || !totalSales}
              >
                Calculate Metrics
              </button>

              {(tacos != null || acos != null) && (
                <div
                  className="mt-2 rounded-2xl px-6 py-6"
                  style={{ backgroundColor: "#D0E0C9" }}
                >
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-[11px] font-semibold tracking-widest text-slate-600">
                        YOUR TACOS
                      </div>
                      <div className="mt-2 text-4xl font-extrabold text-slate-900">
                        {tacosLabel}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold tracking-widest text-slate-600">
                        YOUR ACOS
                      </div>
                      <div className="mt-2 text-4xl font-extrabold text-slate-900">
                        {acosLabel}
                      </div>
                    </div>
                  </div>

                  {/* ✅ Center ORGANIC SALES label + value in the middle */}
                  <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-white px-5 py-4 text-center">
                    <div className="text-[11px] font-semibold tracking-widest text-slate-500">
                      ORGANIC SALES
                    </div>

                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      {organicSalesLabel}
                    </div>
                  </div>

                  <div className="mt-6 text-center text-xs text-slate-700">
                    <div>TACoS = (Total Ad Spend ÷ Total Sales) × 100</div>
                    <div>ACoS = (Total Ad Spend ÷ Ad Sales) × 100</div>
                  </div>

                  <button
                    onClick={clear}
                    className="mx-auto mt-4 block text-sm font-semibold text-slate-800 underline underline-offset-4 hover:text-slate-900"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-sm text-slate-500">
            Tip: Lower TACoS usually indicates stronger organic sales and a healthier business.
          </p>
        </div>
      </main>
    </>
  );
}
