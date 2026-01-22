import Head from "next/head";
import React, { useMemo, useState } from "react";

function formatMoneySmart(value: number) {
  // No decimals if whole number; otherwise 2 decimals
  const isWhole = Math.abs(value % 1) < 1e-9;
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  });
}

function formatPercentSmart(value: number) {
  // No decimals if whole number; otherwise 2 decimals
  const isWhole = Math.abs(value % 1) < 1e-9;
  return `${isWhole ? Math.round(value) : value.toFixed(2)}%`;
}

export default function Home() {
  const [adSpend, setAdSpend] = useState<string>("");
  const [adSales, setAdSales] = useState<string>("");
  const [totalSales, setTotalSales] = useState<string>("");

  const [touched, setTouched] = useState({
    adSpend: false,
    adSales: false,
    totalSales: false,
  });

  const parsed = useMemo(() => {
    const spend = adSpend === "" ? NaN : Number(adSpend);
    const aSales = adSales === "" ? NaN : Number(adSales);
    const tSales = totalSales === "" ? NaN : Number(totalSales);

    return {
      spend,
      aSales,
      tSales,
      spendValid: Number.isFinite(spend) && spend >= 0,
      adSalesValid: Number.isFinite(aSales) && aSales >= 0,
      totalSalesValid: Number.isFinite(tSales) && tSales >= 0,
    };
  }, [adSpend, adSales, totalSales]);

  const canCalculate =
    parsed.spendValid &&
    parsed.adSalesValid &&
    parsed.totalSalesValid &&
    parsed.aSales > 0 &&
    parsed.tSales > 0 &&
    parsed.aSales <= parsed.tSales;

  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    if (!canCalculate) return null;

    const tacos = (parsed.spend / parsed.tSales) * 100;
    const acos = (parsed.spend / parsed.aSales) * 100;

    const organicSales = parsed.tSales - parsed.aSales;
    const organicPercent = (organicSales / parsed.tSales) * 100;

    return {
      tacos,
      acos,
      organicSales,
      organicPercent,
    };
  }, [canCalculate, parsed]);

  const onCalculate = () => {
    setTouched({ adSpend: true, adSales: true, totalSales: true });
    if (!canCalculate) return;
    setShowResults(true);
  };

  const onClear = () => {
    setAdSpend("");
    setAdSales("");
    setTotalSales("");
    setTouched({ adSpend: false, adSales: false, totalSales: false });
    setShowResults(false);
  };

  const inputBase =
    "w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100";
  const labelBase = "block text-sm font-semibold text-slate-900";
  const helperBase = "mt-1 text-xs text-slate-500";
  const errorBase = "mt-1 text-xs text-red-600";

  const showAdSalesTooHigh =
    touched.adSales &&
    touched.totalSales &&
    parsed.adSalesValid &&
    parsed.totalSalesValid &&
    parsed.aSales > parsed.tSales;

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta
          name="description"
          content="Calculate your Total Advertising Cost of Sales (TACoS) instantly."
        />
      </Head>

      <div className="min-h-screen bg-[#f7f7f8] px-4">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[640px] pt-10 text-center text-xs text-slate-500">
          Home <span className="mx-2">→</span> Tools{" "}
          <span className="mx-2">→</span>{" "}
          <span className="font-semibold text-slate-900">
            Amazon TACoS Calculator
          </span>
        </div>

        {/* Header */}
        <div className="mx-auto max-w-[640px] pt-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Amazon TACoS Calculator
          </h1>
          <p className="mx-auto mt-4 max-w-[56ch] text-slate-600">
            Calculate your{" "}
            <span className="font-semibold text-slate-900">
              Total Advertising Cost of Sales (TACoS)
            </span>{" "}
            instantly.
            <br />
            Enter your total ad spend, ad sales, and total sales, then click
            calculate.
          </p>
        </div>

        {/* Card (match ACoS width) */}
        <div className="mx-auto mt-10 max-w-[640px] rounded-3xl bg-white p-6 shadow-sm md:p-10">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className={labelBase}>Total Ad Spend ($)</label>
              {/* spacing like ACoS: label then small gap */}
              <div className="mt-2">
                <input
                  inputMode="decimal"
                  pattern="^[0-9]*[.]?[0-9]*$"
                  className={inputBase}
                  placeholder="e.g. 500"
                  value={adSpend}
                  onChange={(e) => {
                    // allow only digits + one dot
                    const v = e.target.value;
                    if (/^[0-9]*\.?[0-9]*$/.test(v)) setAdSpend(v);
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, adSpend: true }))}
                />
              </div>
              <div className={helperBase}>Numbers only.</div>
              {touched.adSpend && !parsed.spendValid && (
                <div className={errorBase}>Add a number (0 or more).</div>
              )}
            </div>

            <div>
              <label className={labelBase}>Ad Sales ($)</label>
              <div className="mt-2">
                <input
                  inputMode="decimal"
                  pattern="^[0-9]*[.]?[0-9]*$"
                  className={inputBase}
                  placeholder="e.g. 2000"
                  value={adSales}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^[0-9]*\.?[0-9]*$/.test(v)) setAdSales(v);
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, adSales: true }))}
                />
              </div>
              <div className={helperBase}>Sales attributed to ads.</div>
              {touched.adSales && !(parsed.adSalesValid && parsed.aSales > 0) && (
                <div className={errorBase}>Add a number greater than 0.</div>
              )}
            </div>

            <div>
              <label className={labelBase}>Total Sales ($)</label>
              <div className="mt-2">
                <input
                  inputMode="decimal"
                  pattern="^[0-9]*[.]?[0-9]*$"
                  className={inputBase}
                  placeholder="e.g. 2500"
                  value={totalSales}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^[0-9]*\.?[0-9]*$/.test(v)) setTotalSales(v);
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, totalSales: true }))}
                />
              </div>
              <div className={helperBase}>Ad sales + organic sales.</div>
              {touched.totalSales &&
                !(parsed.totalSalesValid && parsed.tSales > 0) && (
                  <div className={errorBase}>Add a number greater than 0.</div>
                )}
              {showAdSalesTooHigh && (
                <div className={errorBase}>
                  Ad Sales can’t be greater than Total Sales.
                </div>
              )}
            </div>
          </div>

          {/* Button (match ACoS size/feel) */}
          <button
            className={[
              "mt-8 w-full rounded-full py-4 font-semibold transition",
              canCalculate
                ? "bg-[#f5c542] text-slate-900 hover:brightness-95"
                : "cursor-not-allowed bg-slate-100 text-slate-400",
            ].join(" ")}
            onClick={onCalculate}
            disabled={!canCalculate}
          >
            Calculate Metrics
          </button>

          {/* Results */}
          {showResults && results && (
            <div className="mt-8 rounded-2xl bg-[#f7f1e2] p-6">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-xs font-semibold tracking-widest text-slate-500">
                    YOUR TACOS
                  </div>
                  <div className="mt-3 text-4xl font-extrabold text-slate-900">
                    {formatPercentSmart(results.tacos)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold tracking-widest text-slate-500">
                    YOUR ACOS
                  </div>
                  <div className="mt-3 text-4xl font-extrabold text-slate-900">
                    {formatPercentSmart(results.acos)}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-white p-4">
                <div className="text-[11px] font-bold tracking-widest text-slate-500">
                  ORGANIC SALES
                </div>
                <div className="mt-2 text-base font-semibold text-slate-900">
                  {formatMoneySmart(results.organicSales)} (
                  {formatPercentSmart(results.organicPercent)})
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-slate-600">
                <div>
                  TACoS = (Total Ad Spend ÷ Total Sales) × 100
                  <br />
                  ACoS = (Total Ad Spend ÷ Ad Sales) × 100
                </div>

                <button
                  className="mt-4 text-xs font-semibold text-slate-900 underline underline-offset-2"
                  onClick={onClear}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mx-auto mt-8 max-w-[640px] pb-16 text-center text-xs text-slate-500">
          Tip: Lower TACoS usually indicates stronger organic sales and a
          healthier business.
        </p>
      </div>
    </>
  );
}
