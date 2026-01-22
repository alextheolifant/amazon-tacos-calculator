import Head from "next/head";
import React, { useMemo, useState } from "react";

function isNumericLike(value: string) {
  // allow digits + single dot
  return /^[0-9]*\.?[0-9]*$/.test(value);
}

function formatMoneyNoDecimals(value: number) {
  // always show no decimals: 500 -> $500, 1500.9 -> $1,501
  const rounded = Math.round(value);
  return `$${rounded.toLocaleString("en-US")}`;
}

function formatPercentNoDecimals(value: number) {
  // always show no decimals: 20.00 -> 20%
  return `${Math.round(value)}%`;
}

export default function Home() {
  const [adSpend, setAdSpend] = useState<string>("");
  const [adSales, setAdSales] = useState<string>("");
  const [totalSales, setTotalSales] = useState<string>("");

  const [tacosValue, setTacosValue] = useState<string>("");
  const [acosValue, setAcosValue] = useState<string>("");
  const [organicSalesText, setOrganicSalesText] = useState<string>("");

  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string>("");

  const canCalculate = useMemo(() => {
    const a = parseFloat(adSpend);
    const b = parseFloat(adSales);
    const c = parseFloat(totalSales);
    return (
      !Number.isNaN(a) &&
      !Number.isNaN(b) &&
      !Number.isNaN(c) &&
      a > 0 &&
      b > 0 &&
      c > 0
    );
  }, [adSpend, adSales, totalSales]);

  function calculateMetrics() {
    setError("");

    const spend = parseFloat(adSpend);
    const adRev = parseFloat(adSales);
    const totalRev = parseFloat(totalSales);

    if ([spend, adRev, totalRev].some((v) => Number.isNaN(v))) {
      setError("Please enter numbers in all fields.");
      setShowResults(false);
      return;
    }

    if (spend <= 0 || adRev <= 0 || totalRev <= 0) {
      setError("Values must be greater than 0.");
      setShowResults(false);
      return;
    }

    if (adRev > totalRev) {
      setError("Ad Sales cannot be greater than Total Sales.");
      setShowResults(false);
      return;
    }

    const tacos = (spend / totalRev) * 100;
    const acos = (spend / adRev) * 100;
    const organicSales = totalRev - adRev;
    const organicPercent = totalRev === 0 ? 0 : (organicSales / totalRev) * 100;

    setTacosValue(`${tacos.toFixed(2)}%`);
    setAcosValue(`${acos.toFixed(2)}%`);

    // requested format: $500 (20%)
    setOrganicSalesText(
      `${formatMoneyNoDecimals(organicSales)} (${formatPercentNoDecimals(
        organicPercent
      )})`
    );

    setShowResults(true);
  }

  function clearForm() {
    setAdSpend("");
    setAdSales("");
    setTotalSales("");
    setTacosValue("");
    setAcosValue("");
    setOrganicSalesText("");
    setError("");
    setShowResults(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && canCalculate) {
      e.preventDefault();
      calculateMetrics();
    }
  }

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta
          name="description"
          content="Calculate your Total Advertising Cost of Sales (TACoS) instantly."
        />
      </Head>

      <main className="min-h-screen bg-[#f6f8fb] px-4 py-12">
        {/* Breadcrumb */}
        <div className="mx-auto flex max-w-2xl justify-center">
          <p className="text-xs text-slate-500">
            Home <span className="mx-2">→</span> Tools{" "}
            <span className="mx-2">→</span>{" "}
            <span className="font-semibold text-slate-700">
              Amazon TACoS Calculator
            </span>
          </p>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-6 max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Amazon TACoS Calculator
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Calculate your <span className="font-semibold">Total Advertising Cost of Sales (TACoS)</span>{" "}
            instantly.
            <br />
            Enter your total ad spend, ad sales, and total sales, then click
            calculate.
          </p>
        </div>

        {/* Card */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-black/5 md:p-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Total Ad Spend ($)
                </label>
                <div className="mt-2">
                  <input
                    value={adSpend}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!isNumericLike(v)) return;
                      setAdSpend(v);
                    }}
                    onKeyDown={handleKeyDown}
                    inputMode="decimal"
                    placeholder="e.g. 500"
                    className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Ad Sales ($)
                </label>
                <div className="mt-2">
                  <input
                    value={adSales}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!isNumericLike(v)) return;
                      setAdSales(v);
                    }}
                    onKeyDown={handleKeyDown}
                    inputMode="decimal"
                    placeholder="e.g. 2000"
                    className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Total Sales ($)
                </label>
                <div className="mt-2">
                  <input
                    value={totalSales}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!isNumericLike(v)) return;
                      setTotalSales(v);
                    }}
                    onKeyDown={handleKeyDown}
                    inputMode="decimal"
                    placeholder="e.g. 2500"
                    className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error ? (
              <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {/* Button */}
            <button
              onClick={calculateMetrics}
              disabled={!canCalculate}
              className={`mt-7 w-full rounded-full px-6 py-4 text-sm font-semibold transition
                ${
                  canCalculate
                    ? "bg-[#f4c542] text-slate-900 hover:brightness-95"
                    : "bg-slate-100 text-slate-400"
                }`}
            >
              Calculate Metrics
            </button>

            {/* Results */}
            {showResults ? (
              <div className="mt-7 rounded-2xl bg-[#f7f0df] p-6 md:p-7">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-slate-500">
                      YOUR TACOS
                    </p>
                    <p className="mt-2 text-4xl font-extrabold text-slate-900">
                      {tacosValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-slate-500">
                      YOUR ACOS
                    </p>
                    <p className="mt-2 text-4xl font-extrabold text-slate-900">
                      {acosValue}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-white px-5 py-4 text-left shadow-sm ring-1 ring-black/5">
                  <p className="text-xs font-semibold tracking-widest text-slate-500">
                    ORGANIC SALES
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {organicSalesText}
                  </p>
                </div>

                <div className="mt-6 text-center text-xs text-slate-600">
                  <p>
                    TACoS = (Total Ad Spend ÷ Total Sales) × 100
                    <br />
                    ACoS = (Total Ad Spend ÷ Ad Sales) × 100
                  </p>

                  <button
                    onClick={clearForm}
                    className="mt-4 text-xs font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-900"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Tip */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Tip: Lower TACoS usually indicates stronger organic sales and a
            healthier business.
          </p>
        </div>
      </main>
    </>
  );
}
