import Head from "next/head";
import React, { useMemo, useState } from "react";

function sanitizeNumericInput(value: string) {
  // Allow digits + one dot; strip everything else
  let v = (value || "").replace(/[^0-9.]/g, "");
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }
  return v;
}

function parseMoney(v: string) {
  const cleaned = (v || "").replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function clampNonNegative(n: number) {
  if (!Number.isFinite(n)) return n;
  return Math.max(0, n);
}

function formatPct2(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(2)}%`;
}

function formatPct0(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `${Math.round(n)}%`;
}

function formatMoney(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function formatMoney0(n: number) {
  if (!Number.isFinite(n)) return "—";
  // No cents — keep it clean
  return Math.round(n).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function Home() {
  const [adSpendRaw, setAdSpendRaw] = useState("");
  const [adSalesRaw, setAdSalesRaw] = useState("");
  const [totalSalesRaw, setTotalSalesRaw] = useState("");

  const [touched, setTouched] = useState({
    adSpend: false,
    adSales: false,
    totalSales: false,
  });

  const [showResults, setShowResults] = useState(false);

  const values = useMemo(() => {
    const adSpend = clampNonNegative(parseMoney(adSpendRaw));
    const adSales = clampNonNegative(parseMoney(adSalesRaw));
    const totalSales = clampNonNegative(parseMoney(totalSalesRaw));

    const isValid =
      Number.isFinite(adSpend) &&
      Number.isFinite(adSales) &&
      Number.isFinite(totalSales) &&
      adSpendRaw.trim() !== "" &&
      adSalesRaw.trim() !== "" &&
      totalSalesRaw.trim() !== "";

    const logicalOk =
      isValid && Number.isFinite(adSales) && Number.isFinite(totalSales)
        ? adSales <= totalSales
        : true;

    const tacos =
      isValid && totalSales > 0 ? (adSpend / totalSales) * 100 : NaN;

    const acos = isValid && adSales > 0 ? (adSpend / adSales) * 100 : NaN;

    const organicSales =
      isValid && Number.isFinite(totalSales) && Number.isFinite(adSales)
        ? totalSales - adSales
        : NaN;

    const organicPct =
      isValid && totalSales > 0 && Number.isFinite(organicSales)
        ? (organicSales / totalSales) * 100
        : NaN;

    return {
      adSpend,
      adSales,
      totalSales,
      isValid,
      logicalOk,
      tacos,
      acos,
      organicSales,
      organicPct,
    };
  }, [adSpendRaw, adSalesRaw, totalSalesRaw]);

  const canCalculate = values.isValid && values.logicalOk;

  function onCalculate(e?: React.FormEvent) {
    e?.preventDefault();
    setTouched({ adSpend: true, adSales: true, totalSales: true });
    if (!canCalculate) return;
    setShowResults(true);
  }

  function onClear() {
    setAdSpendRaw("");
    setAdSalesRaw("");
    setTotalSalesRaw("");
    setTouched({ adSpend: false, adSales: false, totalSales: false });
    setShowResults(false);
  }

  const adSalesTooHigh =
    touched.adSales &&
    touched.totalSales &&
    values.isValid &&
    !values.logicalOk;

  const inputBase =
    "h-12 w-full rounded-full border border-gray-200 bg-white px-5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100";

  const labelBase = "mb-3 block text-sm font-semibold text-gray-800";

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta
          name="description"
          content="Calculate your Amazon Total Advertising Cost of Sales (TACoS), ACoS, and organic contribution instantly."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-[#F6F7FB] px-6 pb-24 pt-10 text-gray-900">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-8 flex justify-center text-xs text-gray-500">
            <span>Home</span>
            <span className="mx-2">→</span>
            <span>Tools</span>
            <span className="mx-2">→</span>
            <span className="font-semibold text-gray-700">
              Amazon TACoS Calculator
            </span>
          </div>

          {/* Header */}
          <header className="mx-auto mb-10 max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl">
              Amazon TACoS Calculator
            </h1>
            <p className="mt-4 text-base text-gray-600">
              Calculate your{" "}
              <span className="font-semibold text-gray-800">
                Total Advertising Cost of Sales (TACoS)
              </span>{" "}
              instantly.
              <br />
              Enter your total ad spend, ad sales, and total sales, then click
              calculate.
            </p>
          </header>

          {/* Card */}
          <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <form onSubmit={onCalculate} className="space-y-5">
              {/* Total Ad Spend */}
              <div>
                <label className={labelBase} htmlFor="adSpend">
                  Total Ad Spend ($)
                </label>
                <input
                  id="adSpend"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="e.g. 500"
                  className={inputBase}
                  value={adSpendRaw}
                  onChange={(e) => setAdSpendRaw(sanitizeNumericInput(e.target.value))}
                  onBlur={() => setTouched((t) => ({ ...t, adSpend: true }))}
                />
              </div>

              {/* Ad Sales */}
              <div>
                <label className={labelBase} htmlFor="adSales">
                  Ad Sales ($)
                </label>
                <input
                  id="adSales"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="e.g. 2000"
                  className={inputBase}
                  value={adSalesRaw}
                  onChange={(e) => setAdSalesRaw(sanitizeNumericInput(e.target.value))}
                  onBlur={() => setTouched((t) => ({ ...t, adSales: true }))}
                />
              </div>

              {/* Total Sales */}
              <div>
                <label className={labelBase} htmlFor="totalSales">
                  Total Sales ($)
                </label>
                <input
                  id="totalSales"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="e.g. 5000"
                  className={inputBase}
                  value={totalSalesRaw}
                  onChange={(e) =>
                    setTotalSalesRaw(sanitizeNumericInput(e.target.value))
                  }
                  onBlur={() => setTouched((t) => ({ ...t, totalSales: true }))}
                />
              </div>

              {adSalesTooHigh && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Ad Sales cannot be greater than Total Sales.
                </div>
              )}

              <button
                type="submit"
                disabled={!canCalculate}
                className={[
                  "h-12 w-full rounded-full font-semibold transition",
                  canCalculate
                    ? "bg-[#F2C94C] text-gray-900 hover:bg-[#EABF3F]"
                    : "cursor-not-allowed bg-gray-100 text-gray-400",
                ].join(" ")}
              >
                Calculate Metrics
              </button>
            </form>

            {/* Results */}
            {showResults && canCalculate && (
              <div className="mt-8 rounded-2xl bg-[#FAF3E0] p-6">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-[11px] font-bold tracking-widest text-gray-500">
                      YOUR TACOS
                    </div>
                    <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                      {formatPct2(values.tacos)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-widest text-gray-500">
                      YOUR ACOS
                    </div>
                    <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                      {formatPct2(values.acos)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white px-5 py-4">
                  <div className="text-[11px] font-bold tracking-widest text-gray-500">
                    ORGANIC SALES
                  </div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {formatMoney0(values.organicSales)} ({formatPct0(values.organicPct)})
                  </div>
                </div>

                <div className="mt-6 text-center text-xs text-gray-600">
                  <div>
                    TACoS = (Total Ad Spend ÷ Total Sales) × 100
                  </div>
                  <div>
                    ACoS = (Total Ad Spend ÷ Ad Sales) × 100
                  </div>

                  <button
                    type="button"
                    onClick={onClear}
                    className="mt-4 text-sm font-semibold text-gray-800 underline underline-offset-4 hover:text-gray-900"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tip */}
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-gray-500">
            Tip: Lower TACoS usually indicates stronger organic sales and a healthier
            business.
          </p>
        </div>
      </main>
    </>
  );
}
