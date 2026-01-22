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

function formatPct(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(2)}%`;
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

export default function Home() {
  const [adSpend, setAdSpend] = useState("");
  const [adSales, setAdSales] = useState("");
  const [totalSales, setTotalSales] = useState("");

  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [focusedField, setFocusedField] = useState<
    "spend" | "adsales" | "totalsales" | null
  >(null);

  const adSpendNum = useMemo(() => parseMoney(adSpend), [adSpend]);
  const adSalesNum = useMemo(() => parseMoney(adSales), [adSales]);
  const totalSalesNum = useMemo(() => parseMoney(totalSales), [totalSales]);

  const baseValid =
    Number.isFinite(adSpendNum) &&
    Number.isFinite(adSalesNum) &&
    Number.isFinite(totalSalesNum) &&
    adSpendNum >= 0 &&
    adSalesNum > 0 &&
    totalSalesNum > 0;

  const logicalValid = baseValid && adSalesNum <= totalSalesNum;

  const tacos = logicalValid ? (adSpendNum / totalSalesNum) * 100 : NaN;
  const acos = logicalValid ? (adSpendNum / adSalesNum) * 100 : NaN;
  const organicSales = logicalValid ? totalSalesNum - adSalesNum : NaN;
  const organicPct = logicalValid ? (organicSales / totalSalesNum) * 100 : NaN;

  function validate(): string | null {
    if (!baseValid) return "Please enter valid numbers in all fields.";
    if (adSalesNum > totalSalesNum)
      return "Ad Sales cannot be greater than Total Sales.";
    return null;
  }

  function onCalculate() {
    const v = validate();
    if (v) {
      setError(v);
      setShowResult(false);
      return;
    }
    setError(null);
    setShowResult(true);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onCalculate();
  }

  function onClear() {
    setAdSpend("");
    setAdSales("");
    setTotalSales("");
    setShowResult(false);
    setError(null);
  }

  const canCalculate = logicalValid;

  return (
    <>
      <Head>
        <title>Amazon TACoS Calculator</title>
        <meta
          name="description"
          content="Calculate Amazon TACoS, ACoS, and organic sales using Ad Spend, Ad Sales, and Total Sales."
        />
      </Head>

      <div className="min-h-screen bg-[#f8fafc]">
        <div className="mx-auto max-w-5xl px-4 pt-12 pb-16">
          {/* Breadcrumbs */}
          <div className="mb-8 flex justify-center text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Home</span>
            <span className="mx-2 text-[#F7C948]">→</span>
            <span className="hover:text-gray-700 cursor-pointer">Tools</span>
            <span className="mx-2 text-[#F7C948]">→</span>
            <span className="font-medium text-gray-900">
              Amazon TACoS Calculator
            </span>
          </div>

          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              Amazon TACoS Calculator
            </h1>

            <div className="mt-4 text-lg text-gray-600 leading-snug">
              <div>
                Calculate your{" "}
                <span className="font-semibold text-gray-900">
                  Total Advertising Cost of Sales (TACoS)
                </span>{" "}
                instantly.
              </div>
              <div className="mt-1">
                Enter your total ad spend, ad sales, and total sales, then click
                calculate.
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <form onSubmit={onSubmit} className="space-y-5">
                {/* Total Ad Spend */}
                <div>
                  <div className="mb-2 font-medium text-gray-900">
                    Total Ad Spend ($)
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    value={adSpend}
                    onFocus={() => setFocusedField("spend")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => {
                      setAdSpend(sanitizeNumericInput(e.target.value));
                      setShowResult(false);
                      setError(null);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData("text");
                      setAdSpend(sanitizeNumericInput(text));
                      setShowResult(false);
                      setError(null);
                    }}
                    placeholder="e.g. 500"
                    className="w-full h-12 rounded-full border border-gray-200 px-5 outline-none focus:border-gray-300"
                  />
                  {focusedField === "spend" && (
                    <div className="mt-2 text-sm text-gray-500">
                      Enter your total ad spend (numbers only).
                    </div>
                  )}
                </div>

                {/* Ad Sales */}
                <div>
                  <div className="mb-2 font-medium text-gray-900">
                    Ad Sales ($)
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    value={adSales}
                    onFocus={() => setFocusedField("adsales")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => {
                      setAdSales(sanitizeNumericInput(e.target.value));
                      setShowResult(false);
                      setError(null);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData("text");
                      setAdSales(sanitizeNumericInput(text));
                      setShowResult(false);
                      setError(null);
                    }}
                    placeholder="e.g. 2000"
                    className="w-full h-12 rounded-full border border-gray-200 px-5 outline-none focus:border-gray-300"
                  />
                  {focusedField === "adsales" && (
                    <div className="mt-2 text-sm text-gray-500">
                      Enter ad-attributed sales (numbers only).
                    </div>
                  )}
                </div>

                {/* Total Sales */}
                <div>
                  <div className="mb-2 font-medium text-gray-900">
                    Total Sales ($)
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    value={totalSales}
                    onFocus={() => setFocusedField("totalsales")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => {
                      setTotalSales(sanitizeNumericInput(e.target.value));
                      setShowResult(false);
                      setError(null);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData("text");
                      setTotalSales(sanitizeNumericInput(text));
                      setShowResult(false);
                      setError(null);
                    }}
                    placeholder="e.g. 5000"
                    className="w-full h-12 rounded-full border border-gray-200 px-5 outline-none focus:border-gray-300"
                  />
                  {focusedField === "totalsales" && (
                    <div className="mt-2 text-sm text-gray-500">
                      Enter total sales (ad + organic) (numbers only).
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!canCalculate}
                  className={[
                    "w-full h-12 rounded-full font-semibold transition",
                    canCalculate
                      ? "bg-[#F7C948] text-gray-900 hover:bg-gray-900 hover:text-[#F7C948]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed",
                  ].join(" ")}
                >
                  Calculate Metrics
                </button>

                {/* Error */}
                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                {/* Results */}
                {showResult ? (
                  <div className="mt-6 rounded-2xl border border-gray-100 bg-[#fbf6e7] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <div className="text-center md:text-left">
                        <div className="text-xs font-semibold tracking-wider text-gray-600">
                          YOUR TACOS
                        </div>
                        <div className="mt-2 text-5xl font-bold text-gray-900">
                          {formatPct(tacos)}
                        </div>
                      </div>

                      <div className="text-center md:text-left">
                        <div className="text-xs font-semibold tracking-wider text-gray-600">
                          YOUR ACOS
                        </div>
                        <div className="mt-2 text-5xl font-bold text-gray-900">
                          {formatPct(acos)}
                        </div>
                      </div>

                      <div className="md:col-span-2 rounded-2xl bg-white border border-gray-100 p-5">
                        <div className="text-xs font-semibold tracking-wider text-gray-600">
                          ORGANIC SALES
                        </div>
                        <div className="mt-2 text-2xl font-bold text-gray-900">
                          {formatMoney(organicSales)}{" "}
                          <span className="text-gray-500 font-semibold">
                            ({formatPct(organicPct)})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 text-center text-sm text-gray-700">
                      <div className="font-semibold">Formulas</div>
                      <div className="mt-1">
                        <span className="font-semibold">TACoS</span> = (Ad Spend
                        ÷ Total Sales) × 100
                      </div>
                      <div>
                        <span className="font-semibold">ACoS</span> = (Ad Spend
                        ÷ Ad Sales) × 100
                      </div>
                      <div>
                        <span className="font-semibold">Organic Sales</span> =
                        Total Sales − Ad Sales
                      </div>

                      <button
                        type="button"
                        onClick={onClear}
                        className="mt-4 text-sm font-semibold text-gray-700 hover:text-gray-900"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : null}
              </form>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            Tip: Lower TACoS usually indicates stronger organic sales and a
            healthier business.
          </div>
        </div>
      </div>
    </>
  );
}
