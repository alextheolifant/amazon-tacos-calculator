import Head from "next/head";
import { useMemo, useState } from "react";

function toNumber(value: string): number | null {
  const cleaned = value.replace(/[^\d.-]/g, "").trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

// $500.00 -> $500  |  $500.50 -> $500.50
function formatMoney(value: number): string {
  const hasCents = Math.round(value * 100) % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(value);
}

// 20.00% -> 20%  |  20.10% -> 20.1%  |  66.67% -> 66.67%
function formatPercent(value: number): string {
  const fixed = value.toFixed(2);
  const trimmed = fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  return `${trimmed}%`;
}

export default function Home() {
  const [adSpend, setAdSpend] = useState("");
  const [adSales, setAdSales] = useState("");
  const [totalSales, setTotalSales] = useState("");

  const spendNum = useMemo(() => toNumber(adSpend), [adSpend]);
  const adSalesNum = useMemo(() => toNumber(adSales), [adSales]);
  const totalSalesNum = useMemo(() => toNumber(totalSales), [totalSales]);

  const canCalculate =
    spendNum !== null &&
    adSalesNum !== null &&
    totalSalesNum !== null &&
    spendNum >= 0 &&
    adSalesNum > 0 &&
    totalSalesNum > 0;

  const tacos = useMemo(() => {
    if (!canCalculate || spendNum === null || totalSalesNum === null) return null;
    return (spendNum / totalSalesNum) * 100;
  }, [canCalculate, spendNum, totalSalesNum]);

  const acos = useMemo(() => {
    if (!canCalculate || spendNum === null || adSalesNum === null) return null;
    return (spendNum / adSalesNum) * 100;
  }, [canCalculate, spendNum, adSalesNum]);

  const organicSales = useMemo(() => {
    if (!canCalculate || totalSalesNum === null || adSalesNum === null) return null;
    return Math.max(0, totalSalesNum - adSalesNum);
  }, [canCalculate, totalSalesNum, adSalesNum]);

  const organicPercent = useMemo(() => {
    if (!canCalculate || organicSales === null || totalSalesNum === null) return null;
    if (totalSalesNum === 0) return null;
    return (organicSales / totalSalesNum) * 100;
  }, [canCalculate, organicSales, totalSalesNum]);

  const [showResults, setShowResults] = useState(false);

  function handleCalculate() {
    if (!canCalculate) return;
    setShowResults(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevents page refresh
    handleCalculate();  // same action as clicking the button
  }

  function handleClear() {
    setAdSpend("");
    setAdSales("");
    setTotalSales("");
    setShowResults(false);
  }

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta
          name="description"
          content="Calculate your Amazon TACoS and ACoS instantly. Enter total ad spend, ad sales, and total sales."
        />
      </Head>

      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-12 text-slate-900">
        <div className="mx-auto max-w-5xl text-center">
          <div className="text-sm text-slate-500">
            Home <span className="mx-2">→</span> Tools{" "}
            <span className="mx-2">→</span>{" "}
            <span className="font-semibold text-slate-700">Amazon TACoS Calculator</span>
          </div>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Amazon TACoS Calculator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-slate-600">
            Calculate your{" "}
            <span className="font-semibold text-slate-800">
              Total Advertising Cost of Sales (TACoS)
            </span>{" "}
            instantly. Enter your total ad spend, ad sales, and total sales, then click
            calculate.
          </p>

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8 text-left">
              {/* ✅ Enter will now submit this form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Total Ad Spend ($)
                  </label>
                  <input
                    value={adSpend}
                    onChange={(e) => setAdSpend(e.target.value)}
                    placeholder="e.g. 500"
                    inputMode="decimal"
                    className="w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-300"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Ad Sales ($)
                  </label>
                  <input
                    value={adSales}
                    onChange={(e) => setAdSales(e.target.value)}
                    placeholder="e.g. 2000"
                    inputMode="decimal"
                    className="w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-300"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Total Sales ($)
                  </label>
                  <input
                    value={totalSales}
                    onChange={(e) => setTotalSales(e.target.value)}
                    placeholder="e.g. 2500"
                    inputMode="decimal"
                    className="w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canCalculate}
                  className={[
                    "mt-2 w-full rounded-full py-4 text-sm font-semibold transition",
                    canCalculate
                      ? "bg-[#F4CA4C] text-slate-900 hover:brightness-95"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed",
                  ].join(" ")}
                >
                  Calculate Metrics
                </button>

                {showResults && (
                  <div className="mt-6 rounded-2xl bg-[#D0E0C9] p-6">
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="text-[11px] font-semibold tracking-widest text-slate-600">
                          YOUR TACOS
                        </div>
                        <div className="mt-2 text-4xl font-extrabold text-slate-900">
                          {tacos === null ? "—" : formatPercent(tacos)}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold tracking-widest text-slate-600">
                          YOUR ACOS
                        </div>
                        <div className="mt-2 text-4xl font-extrabold text-slate-900">
                          {acos === null ? "—" : formatPercent(acos)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-white px-5 py-4 text-center">
                      <div className="text-[11px] font-semibold tracking-widest text-slate-500">
                        ORGANIC SALES
                      </div>

                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {organicSales === null || organicPercent === null
                          ? "—"
                          : `${formatMoney(organicSales)} (${formatPercent(
                              organicPercent
                            ).replace("%", "% of total sales")})`}
                      </div>
                    </div>

                    <div className="mt-5 text-center text-[11px] leading-5 text-slate-500">
                      TACoS = (Total Ad Spend ÷ Total Sales) × 100
                      <br />
                      ACoS = (Total Ad Spend ÷ Ad Sales) × 100
                    </div>

                    <button
                      type="button"
                      onClick={handleClear}
                      className="mx-auto mt-4 block text-sm font-semibold text-slate-700 underline decoration-slate-400 underline-offset-4 hover:text-slate-900"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Tip: Lower TACoS usually indicates stronger organic sales and a healthier business.
          </p>
        </div>
      </main>
    </>
  );
}
