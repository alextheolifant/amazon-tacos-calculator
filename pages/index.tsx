import Head from "next/head";
import { useMemo, useState } from "react";

function toNumber(value: string) {
  const clean = value.replace(/[^0-9.]/g, "");
  if (!clean) return NaN;
  return Number(clean);
}

function fmtMoney(n: number) {
  if (!Number.isFinite(n)) return "$0";
  const isInt = Math.abs(n % 1) < 1e-9;
  return (
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: isInt ? 0 : 2,
      maximumFractionDigits: isInt ? 0 : 2,
    })
  );
}

function fmtPct(n: number) {
  if (!Number.isFinite(n)) return "0%";
  const isInt = Math.abs(n % 1) < 1e-9;
  return `${n.toLocaleString("en-US", {
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: isInt ? 0 : 2,
  })}%`;
}

export default function Home() {
  const [adSpend, setAdSpend] = useState("");
  const [adSales, setAdSales] = useState("");
  const [totalSales, setTotalSales] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const nums = useMemo(() => {
    const spend = toNumber(adSpend);
    const ads = toNumber(adSales);
    const total = toNumber(totalSales);

    const valid =
      Number.isFinite(spend) &&
      Number.isFinite(ads) &&
      Number.isFinite(total) &&
      spend >= 0 &&
      ads >= 0 &&
      total > 0 &&
      ads <= total;

    if (!valid) return { valid: false as const };

    const tacos = (spend / total) * 100;
    const acos = ads === 0 ? Infinity : (spend / ads) * 100;
    const organic = total - ads;
    const organicPct = (organic / total) * 100;

    return {
      valid: true as const,
      spend,
      ads,
      total,
      tacos,
      acos,
      organic,
      organicPct,
    };
  }, [adSpend, adSales, totalSales]);

  const tacos = nums.valid ? nums.tacos : null;
  const acos = nums.valid ? nums.acos : null;
  const organic = nums.valid ? nums.organic : null;
  const organicPct = nums.valid ? nums.organicPct : null;

  const canCalculate =
    Number.isFinite(toNumber(adSpend)) &&
    Number.isFinite(toNumber(adSales)) &&
    Number.isFinite(toNumber(totalSales));

  function onCalculate() {
    setSubmitted(true);
  }

  function onClear() {
    setAdSpend("");
    setAdSales("");
    setTotalSales("");
    setSubmitted(false);
  }

  const showError = submitted && !nums.valid;

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta
          name="description"
          content="Calculate TACoS, ACoS, and organic sales instantly."
        />
      </Head>

      <main className="min-h-screen bg-[#F7F9FC] px-4">
        <div className="mx-auto max-w-5xl py-10 sm:py-14">
          {/* Breadcrumb */}
          <div className="flex justify-center">
            <div className="text-xs text-slate-500">
              Home <span className="mx-2">→</span> Tools{" "}
              <span className="mx-2">→</span>{" "}
              <span className="font-medium text-slate-700">
                Amazon TACoS Calculator
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Amazon TACoS Calculator
            </h1>
            <p className="mx-auto mt-4 max-w-[720px] text-base leading-relaxed text-slate-600 sm:text-lg">
              Calculate your <span className="font-semibold">Total Advertising Cost of Sales (TACoS)</span> instantly.
              <br />
              Enter your total ad spend, ad sales, and total sales, then click calculate.
            </p>
          </div>

          {/* Card */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Total Ad Spend ($)
                </label>
                <input
                  value={adSpend}
                  onChange={(e) => setAdSpend(e.target.value)}
                  placeholder="e.g. 500"
                  inputMode="decimal"
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-800 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Ad Sales ($)
                </label>
                <input
                  value={adSales}
                  onChange={(e) => setAdSales(e.target.value)}
                  placeholder="e.g. 2000"
                  inputMode="decimal"
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-800 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Total Sales ($)
                </label>
                <input
                  value={totalSales}
                  onChange={(e) => setTotalSales(e.target.value)}
                  placeholder="e.g. 2500"
                  inputMode="decimal"
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-800 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <button
                onClick={onCalculate}
                disabled={!canCalculate}
                className={[
                  "mt-2 w-full rounded-full px-6 py-4 text-sm font-semibold transition",
                  canCalculate
                    ? "bg-[#F7C948] text-slate-900 hover:brightness-[0.98]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed",
                ].join(" ")}
              >
                Calculate Metrics
              </button>

              {showError && (
                <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
                  Please enter valid numbers. Ad Sales cannot be greater than Total Sales, and Total Sales must be greater than 0.
                </div>
              )}

              {(tacos !== null || acos !== null) && (
                <div className="rounded-2xl bg-[#D0E0C9] p-6 sm:p-7">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="text-center">
                      <div className="text-[11px] font-semibold tracking-widest text-slate-700/70">
                        YOUR TACOS
                      </div>
                      <div className="mt-2 text-4xl font-extrabold text-slate-900">
                        {tacos === null ? "—" : fmtPct(tacos)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-[11px] font-semibold tracking-widest text-slate-700/70">
                        YOUR ACOS
                      </div>
                      <div className="mt-2 text-4xl font-extrabold text-slate-900">
                        {acos === null
                          ? "—"
                          : acos === Infinity
                          ? "∞"
                          : fmtPct(acos)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-white px-5 py-4 ring-1 ring-slate-200">
                    <div className="text-[11px] font-semibold tracking-widest text-slate-600">
                      ORGANIC SALES
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {organic === null || organicPct === null
                        ? "—"
                        : `${fmtMoney(organic)} (${fmtPct(organicPct)})`}
                    </div>
                  </div>

                  <div className="mt-6 text-center text-xs text-slate-600">
                    TACoS = (Total Ad Spend ÷ Total Sales) × 100
                    <br />
                    ACoS = (Total Ad Spend ÷ Ad Sales) × 100
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={onClear}
                      className="text-xs font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-900"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Tip: Lower TACoS usually indicates stronger organic sales and a healthier business.
          </p>
        </div>
      </main>
    </>
  );
}
