import Head from "next/head";
import React, { useMemo, useState } from "react";

function sanitizeNumberInput(value: string) {
  // allow digits + one dot, strip everything else
  const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 2) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("")}`; // keep only first dot
}

function toNumber(value: string) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : NaN;
}

export default function Home() {
  const [adSpend, setAdSpend] = useState("");
  const [adSales, setAdSales] = useState("");
  const [totalSales, setTotalSales] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const values = useMemo(() => {
    const spend = toNumber(adSpend);
    const ads = toNumber(adSales);
    const total = toNumber(totalSales);

    if (!Number.isFinite(spend) || !Number.isFinite(ads) || !Number.isFinite(total)) {
      return null;
    }

    // guardrails
    if (total <= 0 || ads <= 0 || spend < 0) return null;
    if (ads > total) return null;

    const tacos = (spend / total) * 100;
    const acos = (spend / ads) * 100;
    const organicSales = total - ads;
    const organicPercent = (organicSales / total) * 100;

    return { spend, ads, total, tacos, acos, organicSales, organicPercent };
  }, [adSpend, adSales, totalSales]);

  const fmtMoney0 = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtPct0 = (n: number) =>
    `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n)}%`;

  const fmtPct2 = (n: number) =>
    `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}%`;

  function validateAll() {
    setError(null);

    const spend = toNumber(adSpend);
    const ads = toNumber(adSales);
    const total = toNumber(totalSales);

    if (!Number.isFinite(spend) || !Number.isFinite(ads) || !Number.isFinite(total)) {
      setError("Please enter numbers in all fields.");
      return false;
    }
    if (total <= 0) {
      setError("Total Sales must be greater than 0.");
      return false;
    }
    if (ads <= 0) {
      setError("Ad Sales must be greater than 0.");
      return false;
    }
    if (spend < 0) {
      setError("Total Ad Spend cannot be negative.");
      return false;
    }
    if (ads > total) {
      setError("Ad Sales cannot be greater than Total Sales.");
      return false;
    }

    return true;
  }

  function onCalculate() {
    setSubmitted(true);
    if (!validateAll()) return;
  }

  function onClear() {
    setAdSpend("");
    setAdSales("");
    setTotalSales("");
    setSubmitted(false);
    setError(null);
  }

  const showResults = submitted && !error && values;

  const inputBase =
    "w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100";
  const labelBase = "block text-sm font-semibold text-slate-800 mb-2";
  const helperBase = "mt-1 text-xs text-slate-500";

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta
          name="description"
          content="Calculate Amazon TACoS (Total Advertising Cost of Sales) instantly. Enter total ad spend, ad sales, and total sales to get TACoS, ACoS, and organic sales."
        />
      </Head>

      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 pt-10 pb-16">
          {/* Breadcrumb */}
          <div className="mb-6 text-center text-xs text-slate-500">
            Home <span className="mx-2">→</span> Tools <span className="mx-2">→</span>{" "}
            <span className="font-semibold text-slate-700">Amazon TACoS Calculator</span>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Amazon TACoS Calculator
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Calculate your <span className="font-semibold text-slate-800">Total Advertising Cost of Sales (TACoS)</span>{" "}
            instantly.
            <br />
            Enter your total ad spend, ad sales, and total sales, then click calculate.
          </p>

          {/* Card (match ACoS width vibe) */}
          <div className="mx-auto mt-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            {/* Inputs */}
            <div className="space-y-5">
              <div>
                <label className={labelBase} htmlFor="adSpend">
                  Total Ad Spend ($)
                </label>
                <input
                  id="adSpend"
                  className={inputBase}
                  placeholder="e.g. 500"
                  inputMode="decimal"
                  autoComplete="off"
                  value={adSpend}
                  onChange={(e) => setAdSpend(sanitizeNumberInput(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onCalculate();
                  }}
                />
                <div className={helperBase}>Numbers only.</div>
              </div>

              <div>
                <label className={labelBase} htmlFor="adSales">
                  Ad Sales ($)
                </label>
                <input
                  id="adSales"
                  className={inputBase}
                  placeholder="e.g. 2000"
                  inputMode="decimal"
                  autoComplete="off"
                  value={adSales}
                  onChange={(e) => setAdSales(sanitizeNumberInput(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onCalculate();
                  }}
                />
                <div className={helperBase}>Sales attributed to ads.</div>
              </div>

              <div>
                <label className={labelBase} htmlFor="totalSales">
                  Total Sales ($)
                </label>
                <input
                  id="totalSales"
                  className={inputBase}
                  placeholder="e.g. 2500"
                  inputMode="decimal"
                  autoComplete="off"
                  value={totalSales}
                  onChange={(e) => setTotalSales(sanitizeNumberInput(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onCalculate();
                  }}
                />
                <div className={helperBase}>Ad sales + organic sales.</div>
              </div>
            </div>

            {/* Button */}
            <button
              type="button"
              onClick={onCalculate}
              className="mt-6 w-full rounded-full bg-[#f3c74b] px-6 py-4 font-semibold text-slate-900 shadow-sm transition hover:brightness-95 active:brightness-90"
            >
              Calculate Metrics
            </button>

            {/* Error */}
            {submitted && error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Results */}
            {showResults && (
              <div className="mt-6 rounded-2xl bg-[#f6edd9] p-6">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-slate-500">YOUR TACOS</div>
                    <div className="mt-2 text-4xl font-extrabold text-slate-900">{fmtPct2(values.tacos)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-slate-500">YOUR ACOS</div>
                    <div className="mt-2 text-4xl font-extrabold text-slate-900">{fmtPct2(values.acos)}</div>
                  </div>
                </div>

                {/* Organic box with better spacing like ACoS */}
                <div className="mt-6 rounded-2xl bg-white px-5 py-4 shadow-sm">
                  <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">ORGANIC SALES</div>
                  <div className="text-base font-semibold text-slate-900">
                    {fmtMoney0(values.organicSales)} ({fmtPct0(values.organicPercent)})
                  </div>
                </div>

                <div className="mt-5 text-center text-xs text-slate-600">
                  <div>TACoS = (Total Ad Spend ÷ Total Sales) × 100</div>
                  <div>ACoS = (Total Ad Spend ÷ Ad Sales) × 100</div>
                </div>

                <button
                  type="button"
                  onClick={onClear}
                  className="mx-auto mt-4 block text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-900"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Tip: Lower TACoS usually indicates stronger organic sales and a healthier business.
          </p>
        </div>
      </main>
    </>
  );
}
