// pages/index.tsx
import Head from "next/head";
import React, { useMemo, useState } from "react";

function formatMoney(value: number) {
  // no decimals, with commas: 11013 -> $11,013
  return (
    "$" +
    Math.round(value).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })
  );
}

function formatPercent(value: number) {
  // show 0 decimals if whole, otherwise 2 decimals (e.g. 50% or 66.67%)
  const isWhole = Math.abs(value - Math.round(value)) < 1e-9;
  return isWhole ? `${Math.round(value)}%` : `${value.toFixed(2)}%`;
}

export default function Home() {
  const [adSpend, setAdSpend] = useState<string>("");
  const [adSales, setAdSales] = useState<string>("");
  const [totalSales, setTotalSales] = useState<string>("");

  const [tacos, setTacos] = useState<number | null>(null);
  const [acos, setAcos] = useState<number | null>(null);
  const [organicSales, setOrganicSales] = useState<number | null>(null);
  const [organicPercent, setOrganicPercent] = useState<number | null>(null);

  const isReady = useMemo(() => {
    const a = parseFloat(adSpend);
    const s = parseFloat(adSales);
    const t = parseFloat(totalSales);
    if ([a, s, t].some((v) => Number.isNaN(v))) return false;
    if (t <= 0 || s <= 0 || a < 0) return false;
    if (s > t) return false;
    return true;
  }, [adSpend, adSales, totalSales]);

  function calculate() {
    const a = parseFloat(adSpend);
    const s = parseFloat(adSales);
    const t = parseFloat(totalSales);

    if ([a, s, t].some((v) => Number.isNaN(v))) return;

    if (s > t) {
      alert("Ad Sales cannot be greater than Total Sales.");
      return;
    }
    if (t <= 0 || s <= 0) {
      alert("Ad Sales and Total Sales must be greater than 0.");
      return;
    }
    if (a < 0) {
      alert("Ad Spend cannot be negative.");
      return;
    }

    const tacosValue = (a / t) * 100;
    const acosValue = (a / s) * 100;
    const organicValue = t - s;
    const organicPctValue = (organicValue / t) * 100;

    setTacos(tacosValue);
    setAcos(acosValue);
    setOrganicSales(organicValue);
    setOrganicPercent(organicPctValue);
  }

  function clearAll() {
    setAdSpend("");
    setAdSales("");
    setTotalSales("");
    setTacos(null);
    setAcos(null);
    setOrganicSales(null);
    setOrganicPercent(null);
  }

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta
          name="description"
          content="Calculate your Total Advertising Cost of Sales (TACoS) instantly."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-[#F5F7FB] px-4 pb-16">
        {/* Breadcrumbs */}
        <div className="mx-auto w-full max-w-[520px] pt-8 text-center text-sm text-slate-500">
          Home &nbsp;→&nbsp; Tools &nbsp;→&nbsp;{" "}
          <span className="font-semibold text-slate-700">
            Amazon TACoS Calculator
          </span>
        </div>

        {/* Title */}
        <div className="mx-auto w-full max-w-[520px] pt-6 text-center">
          <h1 className="text-[40px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Amazon TACoS Calculator
          </h1>

          {/* single paragraph (mobile-friendly) */}
          <p className="mx-auto mt-4 max-w-[520px] text-lg leading-relaxed text-slate-600">
            Calculate your{" "}
            <span className="font-semibold text-slate-700">
              Total Advertising Cost of Sales (TACoS)
            </span>{" "}
            instantly. Enter your total ad spend, ad sales, and total sales, then
            click calculate.
          </p>
        </div>

        {/* Card */}
        <section className="mx-auto mt-10 w-full max-w-[520px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800">
                Total Ad Spend ($)
              </label>
              <input
                className="mt-2 w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                placeholder="e.g. 500"
                inputMode="decimal"
                value={adSpend}
                onChange={(e) => setAdSpend(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") calculate();
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800">
                Ad Sales ($)
              </label>
              <input
                className="mt-2 w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                placeholder="e.g. 2000"
                inputMode="decimal"
                value={adSales}
                onChange={(e) => setAdSales(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") calculate();
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800">
                Total Sales ($)
              </label>
              <input
                className="mt-2 w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                placeholder="e.g. 2500"
                inputMode="decimal"
                value={totalSales}
                onChange={(e) => setTotalSales(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") calculate();
                }}
              />
            </div>

            <button
              className={[
                "mt-2 w-full rounded-full py-4 text-center text-sm font-semibold shadow-sm transition",
                isReady
                  ? "bg-[#F4C84D] text-slate-900 hover:brightness-95"
                  : "cursor-not-allowed bg-slate-100 text-slate-400",
              ].join(" ")}
              onClick={calculate}
              disabled={!isReady}
            >
              Calculate Metrics
            </button>
          </div>

          {/* Results */}
          {tacos !== null && acos !== null && organicSales !== null && (
            <div className="mt-6 rounded-3xl bg-[#D0E0C9] p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-[11px] font-semibold tracking-widest text-slate-600">
                    YOUR TACOS
                  </div>
                  <div className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
                    {formatPercent(tacos)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[11px] font-semibold tracking-widest text-slate-600">
                    YOUR ACOS
                  </div>
                  <div className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
                    {formatPercent(acos)}
                  </div>
                </div>
              </div>

              {/* Centered Organic Sales */}
              <div className="mt-6 rounded-2xl bg-white px-5 py-5 text-center flex flex-col items-center justify-center">
                <div className="text-[11px] font-semibold tracking-widest text-slate-500">
                  ORGANIC SALES
                </div>

                {/* removes .00 like: $500 (20%) */}
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {organicSales === null || organicPercent === null
                    ? "—"
                    : `${formatMoney(organicSales)} (${formatPercent(
                        organicPercent
                      )} of total sales)`}
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-slate-600">
                <div>
                  TACoS = ( Total Ad Spend ÷ Total Sales ) × 100
                </div>
                <div>
                  ACoS = ( Total Ad Spend ÷ Ad Sales ) × 100
                </div>
              </div>

              <button
                className="mx-auto mt-4 block text-sm font-semibold text-slate-800 underline underline-offset-4"
                onClick={clearAll}
              >
                Clear
              </button>
            </div>
          )}
        </section>

        <p className="mx-auto mt-8 w-full max-w-[520px] text-center text-sm text-slate-500">
          Tip: Lower TACoS usually indicates stronger organic sales and a
          healthier business.
        </p>
      </main>
    </>
  );
}
