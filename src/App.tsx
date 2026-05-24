import React, { useMemo, useState } from "react";


function numberFormat(value) {
  if (!Number.isFinite(value)) return "0";
  return Math.round(value).toLocaleString("ko-KR");
}

function money(value) {
  return `${numberFormat(value)}원`;
}

function percent(value) {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(2)}%`;
}

function Field({ label, value, onChange, suffix }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="inputRow">
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} />
        <span>{suffix}</span>
      </div>
    </div>
  );
}

const recWeightOptions = [
  { label: "일반부지 1.0", value: 1.0 },
  { label: "건물 위 1.2", value: 1.2 },
  { label: "소형 우대 1.5", value: 1.5 },
  { label: "수상 태양광 1.5", value: 1.5 },
];

const marketTrend = [
  { month: "1월", SMP: 123, REC: 71000 },
  { month: "2월", SMP: 126, REC: 73500 },
  { month: "3월", SMP: 129, REC: 74800 },
  { month: "4월", SMP: 127, REC: 75500 },
  { month: "5월", SMP: 128, REC: 76000 },
];

const regionSunHours = [
  { name: "서울", hours: 3.35, note: "수도권" },
  { name: "경기", hours: 3.45, note: "수도권" },
  { name: "강원", hours: 3.65, note: "동해안/산간" },
  { name: "충북", hours: 3.6, note: "내륙" },
  { name: "충남", hours: 3.75, note: "서해안" },
  { name: "대전", hours: 3.6, note: "내륙" },
  { name: "전북", hours: 3.8, note: "익산·전주권" },
  { name: "전남", hours: 3.95, note: "남해안" },
  { name: "광주", hours: 3.85, note: "호남" },
  { name: "경북", hours: 3.8, note: "동남권" },
  { name: "경남", hours: 3.7, note: "남동권" },
  { name: "대구", hours: 3.75, note: "내륙" },
  { name: "부산", hours: 3.6, note: "해안" },
  { name: "울산", hours: 3.65, note: "해안" },
  { name: "제주", hours: 3.9, note: "도서" },
];

const appStyle = `
  * { box-sizing: border-box; }
  html, body, #root { width: 100%; min-height: 100%; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; background: #f3f4f6 !important; color: #111827; }
  #root { max-width: none !important; margin: 0 !important; padding: 0 !important; text-align: left !important; }
  .page { width: 100%; min-height: 100vh; padding: 20px; }
  .hero { background: white; padding: 22px; border-radius: 18px; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(15,23,42,.08); display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; }
  .hero h1 { margin: 8px 0; font-size: 34px; }
  .badge { color: #d97706; font-weight: 800; margin: 0; }
  .desc { color: #666; margin: 0 0 12px; }
  .chips { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
  .chips span { background: #f1f5f9; padding: 8px 12px; border-radius: 999px; font-size: 13px; }
  .heroButtons { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
  button { border: none; padding: 10px 14px; border-radius: 12px; background: #2563eb; color: white; cursor: pointer; font-weight: 700; font-family: inherit; }
  button:hover { opacity: .9; }
  button.outline { background: white; color: #333; border: 1px solid #ccc; }
  .layout { display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 20px; align-items: start; width: 100%; }
  .panel, .card, .result { background: white; border-radius: 18px; padding: 20px; box-shadow: 0 8px 24px rgba(15,23,42,.06); }
  .content { display: flex; flex-direction: column; gap: 20px; }
  .tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .tabs button { background: #e5e7eb; color: #111827; }
  .tabs button.active { background: #111827; color: white; }
  .form { display: flex; flex-direction: column; gap: 16px; }
  .field label { display: block; margin-bottom: 6px; font-weight: 800; font-size: 14px; }
  .inputRow { display: flex; align-items: center; gap: 10px; }
  .inputRow input, select { flex: 1; width: 100%; padding: 11px; border-radius: 12px; border: 1px solid #d1d5db; font-size: 15px; }
  .inputRow span { width: 72px; color: #6b7280; font-size: 13px; }
  .summaryGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .result p { margin: 0; color: #6b7280; font-size: 14px; }
  .result h3 { margin: 8px 0 0; font-size: 23px; }
  .green h3 { color: #059669; } .orange h3 { color: #d97706; } .blue h3 { color: #2563eb; } .purple h3 { color: #7c3aed; }
  .card h2 { margin: 0 0 14px; font-size: 22px; }
  .regionGrid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  .region { background: #f9fafb; color: #111827; border: 1px solid #e5e7eb; border-radius: 14px; padding: 13px; text-align: left; display: flex; flex-direction: column; gap: 4px; }
  .region.selected { border: 2px solid #f59e0b; background: #fffbeb; }
  .region small, .region em { color: #6b7280; font-style: normal; font-size: 12px; }
  .region strong { color: #d97706; font-size: 22px; }
  .trendGrid, .detailGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .trend, .detail { background: #f9fafb; padding: 13px; border-radius: 12px; display: flex; flex-direction: column; gap: 6px; }
  .detail p { margin: 0; color: #6b7280; font-size: 13px; }
  .barList { display: flex; flex-direction: column; gap: 10px; }
  .barRow { display: grid; grid-template-columns: 60px 1fr 140px; gap: 10px; align-items: center; font-size: 14px; }
  .barTrack { background: #e5e7eb; height: 14px; border-radius: 999px; overflow: hidden; }
  .barTrack div { background: #2563eb; height: 100%; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: left; }
  .empty { color: #666; }
  .notice { background: #f3f4f6; padding: 12px; border-radius: 10px; color: #4b5563; }
  @media (max-width: 900px) { .hero { flex-direction: column; } .layout { grid-template-columns: 1fr; } .summaryGrid, .regionGrid, .trendGrid, .detailGrid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .page { padding: 12px; } .summaryGrid, .regionGrid, .trendGrid, .detailGrid { grid-template-columns: 1fr; } .barRow { grid-template-columns: 48px 1fr; } .barRow b { grid-column: 2; } }
`;

export default function App() {
  const [tab, setTab] = useState("basic");
  const [selectedRegion, setSelectedRegion] = useState("전북");
  const [history, setHistory] = useState([]);

  const [basic, setBasic] = useState({
    capacityKw: 100,
    sunHours: 3.8,
    smpPrice: 128,
    recPrice: 76000,
    recWeight: 1.2,
    installCost: 130000000,
    maintenanceMonthly: 200000,
  });

  const [loan, setLoan] = useState({
    loanAmount: 90000000,
    interestRate: 5.5,
    years: 10,
    graceMonths: 0,
  });

  const marketPrice = { smp: 128, rec: 76000, updated: "2026년 5월 기준" };

  const result = useMemo(() => {
    const capacityKw = Number(basic.capacityKw) || 0;
    const sunHours = Number(basic.sunHours) || 0;
    const smpPrice = Number(basic.smpPrice) || 0;
    const recPrice = Number(basic.recPrice) || 0;
    const recWeight = Number(basic.recWeight) || 0;
    const installCost = Number(basic.installCost) || 0;
    const maintenanceMonthly = Number(basic.maintenanceMonthly) || 0;

    const loanAmount = Number(loan.loanAmount) || 0;
    const interestRate = Number(loan.interestRate) || 0;
    const years = Number(loan.years) || 0;
    const graceMonths = Number(loan.graceMonths) || 0;

    const dailyKwh = capacityKw * sunHours;
    const monthlyKwh = dailyKwh * 30;
    const yearlyKwh = dailyKwh * 365;
    const recPerKwh = (recPrice / 1000) * recWeight;
    const incomePerKwh = smpPrice + recPerKwh;
    const monthlySales = monthlyKwh * incomePerKwh;
    const yearlySales = yearlyKwh * incomePerKwh;

    const totalMonths = Math.max(years * 12, 0);
    const repayMonths = Math.max(totalMonths - graceMonths, 1);
    const monthlyPrincipal = loanAmount > 0 ? loanAmount / repayMonths : 0;

    let remainPrincipal = loanAmount;
    let totalLoanPaymentYear1 = 0;
    let totalNetProfitYear1 = 0;
    let cumulativeNet = -Math.max(installCost - loanAmount, 0);
    let paybackMonth = null;
    let graceMonthlyProfit = 0;
    let repayMonthlyProfit = 0;
    const yearlyRows = [];

    for (let month = 1; month <= 240; month++) {
      const isGrace = month <= graceMonths;
      const interest = remainPrincipal * (interestRate / 100) / 12;
      const principal = loanAmount > 0 && month <= totalMonths && !isGrace ? Math.min(monthlyPrincipal, remainPrincipal) : 0;
      const loanPayment = loanAmount > 0 && month <= totalMonths ? principal + interest : 0;
      remainPrincipal = Math.max(remainPrincipal - principal, 0);

      const net = monthlySales - maintenanceMonthly - loanPayment;
      if (isGrace) graceMonthlyProfit += net;
      else if (month <= totalMonths) repayMonthlyProfit += net;
      cumulativeNet += net;

      if (month <= 12) {
        totalLoanPaymentYear1 += loanPayment;
        totalNetProfitYear1 += net;
      }
      if (paybackMonth === null && cumulativeNet >= 0) paybackMonth = month;

      if (month % 12 === 0) {
        yearlyRows.push({
          year: month / 12,
          cumulative: cumulativeNet,
          yearlyNet: net * 12,
          yearlySales,
        });
      }
    }

    const selfCapital = Math.max(installCost - loanAmount, 0);
    const roiYear1 = selfCapital > 0 ? (totalNetProfitYear1 / selfCapital) * 100 : 0;

    return {
      dailyKwh,
      monthlyKwh,
      yearlyKwh,
      incomePerKwh,
      monthlySales,
      yearlySales,
      avgMonthlyLoanPayment: totalLoanPaymentYear1 / 12,
      monthlyNetProfit: totalNetProfitYear1 / 12,
      yearlyNetProfit: totalNetProfitYear1,
      graceMonthlyProfit: graceMonths > 0 ? graceMonthlyProfit / graceMonths : monthlySales - maintenanceMonthly,
      repayMonthlyProfit: totalMonths - graceMonths > 0 ? repayMonthlyProfit / (totalMonths - graceMonths) : monthlySales - maintenanceMonthly,
      paybackText: paybackMonth ? `${Math.floor(paybackMonth / 12)}년 ${paybackMonth % 12}개월` : "20년 이상",
      roiYear1,
      yearlyRows,
    };
  }, [basic, loan]);

  const updateBasic = (key, value) => setBasic((prev) => ({ ...prev, [key]: value }));
  const updateLoan = (key, value) => setLoan((prev) => ({ ...prev, [key]: value }));

  const applyMarketPrice = () => setBasic((prev) => ({ ...prev, smpPrice: marketPrice.smp, recPrice: marketPrice.rec }));
  const applyRegion = (region) => {
    setSelectedRegion(region.name);
    setBasic((prev) => ({ ...prev, sunHours: region.hours }));
  };

  const saveHistory = () => {
    setHistory((prev) => [
      { id: Date.now(), capacity: basic.capacityKw, monthlySales: result.monthlySales, yearlyNet: result.yearlyNetProfit, payback: result.paybackText },
      ...prev,
    ].slice(0, 10));
  };

  const reset = () => {
    setSelectedRegion("전북");
    setBasic({ capacityKw: 100, sunHours: 3.8, smpPrice: 128, recPrice: 76000, recWeight: 1.2, installCost: 130000000, maintenanceMonthly: 200000 });
    setLoan({ loanAmount: 90000000, interestRate: 5.5, years: 10, graceMonths: 0 });
  };

  return (
    <>
      <style>{appStyle}</style>
      <div className="page">
      <header className="hero">
        <div>
          <p className="badge">☀ 태양광 발전 수익 분석</p>
          <h1>태양광 수익계산기</h1>
          <p className="desc">설비용량, 발전운전시간, SMP, REC, 대출조건을 넣으면 예상 수익을 계산합니다.</p>
          <div className="chips">
            <span>최근 SMP {numberFormat(marketPrice.smp)}원/kWh</span>
            <span>최근 REC {numberFormat(marketPrice.rec)}원/REC</span>
            <span>{marketPrice.updated}</span>
          </div>
        </div>
        <div className="heroButtons">
          <button onClick={applyMarketPrice}>최근 시세 적용</button>
          <button onClick={saveHistory}>계산 기록 저장</button>
          <button className="outline" onClick={reset}>초기화</button>
        </div>
      </header>

      <main className="layout">
        <section className="panel inputPanel">
          <div className="tabs">
            <button className={tab === "basic" ? "active" : ""} onClick={() => setTab("basic")}>기본 입력</button>
            <button className={tab === "loan" ? "active" : ""} onClick={() => setTab("loan")}>대출 설정</button>
          </div>

          {tab === "basic" ? (
            <div className="form">
              <Field label="설비용량" value={basic.capacityKw} onChange={(v) => updateBasic("capacityKw", v)} suffix="kW" />
              <Field label={`1일 발전운전시간 (${selectedRegion} 기준)`} value={basic.sunHours} onChange={(v) => updateBasic("sunHours", v)} suffix="시간" />
              <Field label="SMP 단가" value={basic.smpPrice} onChange={(v) => updateBasic("smpPrice", v)} suffix="원/kWh" />
              <Field label="REC 단가" value={basic.recPrice} onChange={(v) => updateBasic("recPrice", v)} suffix="원/REC" />
              <div className="field">
                <label>REC 가중치 선택</label>
                <select value={basic.recWeight} onChange={(e) => updateBasic("recWeight", e.target.value)}>
                  {recWeightOptions.map((option, idx) => <option key={idx} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <Field label="총 설치비" value={basic.installCost} onChange={(v) => updateBasic("installCost", v)} suffix="원" />
              <Field label="월 유지관리비" value={basic.maintenanceMonthly} onChange={(v) => updateBasic("maintenanceMonthly", v)} suffix="원" />
            </div>
          ) : (
            <div className="form">
              <Field label="대출금액" value={loan.loanAmount} onChange={(v) => updateLoan("loanAmount", v)} suffix="원" />
              <Field label="대출금리" value={loan.interestRate} onChange={(v) => updateLoan("interestRate", v)} suffix="%" />
              <Field label="상환기간" value={loan.years} onChange={(v) => updateLoan("years", v)} suffix="년" />
              <Field label="유예기간" value={loan.graceMonths} onChange={(v) => updateLoan("graceMonths", v)} suffix="개월" />
              <p className="notice">대출 방식은 원금균등상환 기준입니다. 유예기간에는 이자만 반영합니다.</p>
            </div>
          )}
        </section>

        <section className="content">
          <div className="summaryGrid">
            <Result title="월 예상 매출" value={money(result.monthlySales)} />
            <Result title="연 예상 매출" value={money(result.yearlySales)} />
            <Result title="월 순수익" value={money(result.monthlyNetProfit)} color="green" />
            <Result title="투자금 회수기간" value={result.paybackText} color="orange" />
            <Result title="유예기간 월 수령금액" value={money(result.graceMonthlyProfit)} color="blue" />
            <Result title="원리금상환 월 수령금액" value={money(result.repayMonthlyProfit)} color="purple" />
          </div>

          <Card title="지역별 평균 발전운전시간">
            <div className="regionGrid">
              {regionSunHours.map((region) => (
                <button key={region.name} className={selectedRegion === region.name ? "region selected" : "region"} onClick={() => applyRegion(region)}>
                  <b>{region.name}</b><small>{region.note}</small><strong>{region.hours}h</strong><em>클릭 시 적용</em>
                </button>
              ))}
            </div>
          </Card>

          <Card title="최근 SMP / REC 시세">
            <div className="trendGrid">
              {marketTrend.map((m) => (
                <div className="trend" key={m.month}>
                  <b>{m.month}</b>
                  <span>SMP {m.SMP}원</span>
                  <span>REC {numberFormat(m.REC)}원</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="계산 상세">
            <div className="detailGrid">
              <Detail label="일 발전량" value={`${numberFormat(result.dailyKwh)} kWh`} />
              <Detail label="월 발전량" value={`${numberFormat(result.monthlyKwh)} kWh`} />
              <Detail label="연 발전량" value={`${numberFormat(result.yearlyKwh)} kWh`} />
              <Detail label="kWh당 예상수익" value={money(result.incomePerKwh)} />
              <Detail label="월 평균 대출상환" value={money(result.avgMonthlyLoanPayment)} />
              <Detail label="1년차 자기자본 수익률" value={percent(result.roiYear1)} />
            </div>
          </Card>

          <Card title="20년 누적수익">
            <div className="barList">
              {result.yearlyRows.map((row) => (
                <div className="barRow" key={row.year}>
                  <span>{row.year}년</span>
                  <div className="barTrack">
                    <div
                      style={{
                        width: `${Math.min(Math.max((row.cumulative / 300000000) * 100, 3), 100)}%`,
                      }}
                    ></div>
                  </div>
                  <b>{money(row.cumulative)}</b>
                </div>
              ))}
            </div>
          </Card>

          <Card title="최근 계산 기록">
            {history.length === 0 ? <p className="empty">아직 저장된 계산 기록이 없습니다.</p> : (
              <table>
                <thead><tr><th>용량</th><th>월매출</th><th>연순수익</th><th>회수기간</th></tr></thead>
                <tbody>{history.map((h) => <tr key={h.id}><td>{h.capacity}kW</td><td>{money(h.monthlySales)}</td><td>{money(h.yearlyNet)}</td><td>{h.payback}</td></tr>)}</tbody>
              </table>
            )}
          </Card>
        </section>
      </main>
    </div>
    </>
  );
}

function Result({ title, value, color = "" }) {
  return (
    <div className={`result ${color}`}>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail">
      <p>{label}</p>
      <b>{value}</b>
    </div>
  );
}
