import React, { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Droplets, PlusCircle, Timer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { dailyLogEntriesMock } from '../../mockData';

const targetMetrics = {
  calories: { label: 'Tổng năng lượng', target: '1.800 kcal', targetMin: 1800, unit: 'kcal' },
  protein: { label: 'Protein', target: '78 g', targetMin: 78, unit: 'g' },
  fat: { label: 'Chất béo', target: '50 g+', targetMin: 50, unit: 'g' },
  carbs: { label: 'Glucid', target: '190 g+', targetMin: 190, unit: 'g' },
  water: { label: 'Nước uống', target: '1.8 L', targetMin: 1.8, unit: 'L' },
};

const mealReviews = {
  'Bữa sáng': { status: 'Ổn', tone: 'success', note: 'Khởi đầu đủ năng lượng, có nguồn đạm.', needsAttention: false },
  'Bữa trưa': { status: 'Đủ năng lượng', tone: 'success', note: 'Bữa chính tốt nhất trong ngày.', needsAttention: false },
  'Bữa phụ chiều': { status: 'Còn nhẹ', tone: 'warning', note: 'Còn nhẹ, nên tăng thêm đạm mềm.', needsAttention: true },
  'Bữa tối': { status: 'Theo dõi thêm', tone: 'neutral', note: 'Phù hợp, có thể tăng nhẹ nếu bệnh nhân còn ăn được.', needsAttention: false },
};

function shiftDate(currentDate, direction, dates) {
  const currentIndex = dates.findIndex((item) => item.value === currentDate);
  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= dates.length) return currentDate;
  return dates[nextIndex].value;
}

function parseMacroValue(value) {
  return Number.parseFloat(String(value).replace(/[^\d.]/g, '')) || 0;
}

function buildMacroRatio({ protein, fat, carbs }) {
  const proteinKcal = parseMacroValue(protein) * 4;
  const fatKcal = parseMacroValue(fat) * 9;
  const carbKcal = parseMacroValue(carbs) * 4;
  const totalKcal = proteinKcal + fatKcal + carbKcal;
  if (!totalKcal) return { protein: 0, fat: 0, carbs: 0, label: '0:0:0' };
  const proteinRatio = Math.round((proteinKcal / totalKcal) * 100);
  const fatRatio = Math.round((fatKcal / totalKcal) * 100);
  const carbsRatio = Math.max(0, 100 - proteinRatio - fatRatio);
  return { protein: proteinRatio, fat: fatRatio, carbs: carbsRatio, label: `${proteinRatio}:${fatRatio}:${carbsRatio}` };
}

function getMetricStatus(metricKey, value) {
  const numericValue = parseMacroValue(value);
  const metric = targetMetrics[metricKey];
  const progress = Math.min(100, Math.round((numericValue / metric.targetMin) * 100));

  if (numericValue >= metric.targetMin) {
    return { label: 'Đạt mục tiêu', tone: 'success', progress, delta: 'Đạt mốc tối thiểu' };
  }

  if (progress >= 85) {
    const missing = Math.round((metric.targetMin - numericValue) * (metricKey === 'water' ? 10 : 1)) / (metricKey === 'water' ? 10 : 1);
    return { label: 'Gần đạt', tone: 'warning', progress, delta: `Thiếu ${missing} ${metric.unit}` };
  }

  return { label: 'Chưa đạt', tone: 'danger', progress, delta: `Cần cải thiện` };
}

function NutritionStatusBadge({ children, tone = 'neutral' }) {
  return <span className={`nutrition-status-badge status-${tone}`}>{children}</span>;
}

function DailyNutritionHero({ currentLog, onNavigate, showToast }) {
  return (
    <article className="daily-nutrition-hero">
      <div className="daily-hero-left">
        <span className="eyebrow">Nhận định lâm sàng trong ngày</span>
        <h2>Điểm cần chú ý hôm nay</h2>
        <p>Tổng năng lượng gần đạt mục tiêu nhưng phân bố chưa đều. Điểm lệch chính nằm ở bữa phụ chiều và nước uống.</p>
        <ul>
          <li>Bữa phụ chiều còn nhẹ và ít đạm.</li>
          <li>Nước uống mới đạt khoảng 1.5 L.</li>
          <li>Glucid ổn về tổng lượng nhưng cần theo dõi phân bố giữa bữa.</li>
        </ul>
      </div>

      <aside className="daily-hero-action">
        <h3>Việc nên làm tiếp</h3>
        <ul>
          <li>Tăng bữa phụ mềm, giàu đạm.</li>
          <li>Chia nước uống theo 3-4 mốc giờ.</li>
          <li>Giữ năng lượng đều giữa các bữa chính.</li>
        </ul>
        <div className="daily-hero-actions">
          <button className="btn-primary" type="button" onClick={() => onNavigate('intervention-followup')}>
            Chuyển sang kế hoạch can thiệp
            <ArrowRight size={15} aria-hidden="true" />
          </button>
          <button className="btn-secondary" type="button" onClick={() => showToast('Đã tạo lượt theo dõi từ nhật ký khẩu phần')}>
            <PlusCircle size={15} aria-hidden="true" />
            Tạo theo dõi
          </button>
        </div>
        <p>{currentLog.insight}</p>
      </aside>
    </article>
  );
}

function MetricCardCompact({ metricKey, actual }) {
  const metric = targetMetrics[metricKey];
  const status = getMetricStatus(metricKey, actual);

  return (
    <article className="metric-card-compact">
      <div className="metric-card-topline">
        <span>{metric.label}</span>
        <NutritionStatusBadge tone={status.tone}>{status.label}</NutritionStatusBadge>
      </div>
      <strong>{actual}</strong>
      <div className="micro-progress" aria-hidden="true">
        <span className={`micro-progress-fill progress-${status.tone}`} style={{ width: `${status.progress}%` }} />
      </div>
      <p>Mục tiêu: {metric.target}</p>
      <small>{status.delta}</small>
    </article>
  );
}

function MetricStrip({ currentLog }) {
  const metrics = [
    ['calories', `${currentLog.totals.calories} kcal`],
    ['protein', currentLog.totals.protein],
    ['fat', currentLog.totals.fat],
    ['carbs', currentLog.totals.carbs],
    ['water', '1.5 L'],
  ];

  return (
    <section className="nutrition-metric-strip" aria-label="Mục tiêu so với thực tế">
      {metrics.map(([key, value]) => (
        <MetricCardCompact key={key} metricKey={key} actual={value} />
      ))}
    </section>
  );
}

function MacroDistributionMini({ ratio }) {
  return (
    <section className="macro-distribution-mini">
      <div>
        <span className="eyebrow">P:L:G hôm nay</span>
        <strong>{ratio.label}</strong>
        <p>Phân bố tương đối ổn, nhưng đạm nên tăng nhẹ ở bữa phụ chiều.</p>
      </div>
      <div className="macro-stack-bar" aria-label={`Protein ${ratio.protein}%, lipid ${ratio.fat}%, glucid ${ratio.carbs}%`}>
        <span className="macro-protein" style={{ width: `${ratio.protein}%` }}>P {ratio.protein}%</span>
        <span className="macro-fat" style={{ width: `${ratio.fat}%` }}>L {ratio.fat}%</span>
        <span className="macro-carb" style={{ width: `${ratio.carbs}%` }}>G {ratio.carbs}%</span>
      </div>
    </section>
  );
}

function SevenDayTrendSection({ data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const underGoalCount = data.filter((item) => item.actual < item.goal).length;

  return (
    <section className="seven-day-trend-section">
      <div className="section-heading with-row">
        <div>
          <span className="eyebrow">Xu hướng 7 ngày</span>
          <h2>Biến thiên năng lượng gần đây</h2>
          <p>Dưới mục tiêu {underGoalCount}/7 ngày. Năng lượng ổn hơn 3 ngày gần đây nhưng vẫn chưa đều.</p>
        </div>
        <button className="btn-secondary btn-small" type="button" onClick={() => setIsExpanded((current) => !current)}>
          {isExpanded ? 'Thu gọn' : 'Mở biểu đồ'}
        </button>
      </div>

      {isExpanded ? (
        <div className="nutrition-chart-shell compact">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <ReferenceLine y={1800} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Mục tiêu', position: 'insideTopRight', fill: '#64748b', fontSize: 12 }} />
              <Line type="monotone" name="Thực tế" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </section>
  );
}

function MealFilterToggle({ activeMode, onChange }) {
  return (
    <div className="meal-filter-toggle" aria-label="Lọc bữa ăn">
      <button className={activeMode === 'attention' ? 'active' : ''} type="button" onClick={() => onChange('attention')}>
        Chỉ xem bữa cần chú ý
      </button>
      <button className={activeMode === 'all' ? 'active' : ''} type="button" onClick={() => onChange('all')}>
        Xem tất cả bữa
      </button>
    </div>
  );
}

function MealReviewCardCompact({ meal }) {
  const review = mealReviews[meal.type] ?? { status: 'Theo dõi thêm', tone: 'neutral', note: 'Cần đọc cùng tổng năng lượng trong ngày.' };
  const ratio = buildMacroRatio(meal);

  return (
    <article className={`meal-review-compact tone-${review.tone}`}>
      <img src={meal.img} alt={meal.name} width="800" height="520" loading="lazy" />
      <div className="meal-review-compact-body">
        <div className="meal-review-compact-header">
          <div>
            <span>{meal.type} · {meal.time}</span>
            <h3>{meal.name}</h3>
          </div>
          <NutritionStatusBadge tone={review.tone}>{review.status}</NutritionStatusBadge>
        </div>
        <p>{review.note}</p>
        <div className="meal-compact-metrics">
          <span>{meal.kcal} kcal</span>
          <span>{meal.protein}g protein</span>
          <span>{meal.fat}g fat</span>
          <span>{meal.carbs}g carb</span>
        </div>
        <small>P:L:G {ratio.label} · P {ratio.protein}% · L {ratio.fat}% · G {ratio.carbs}%</small>
      </div>
    </article>
  );
}

function MealsToReviewSection({ meals }) {
  const [filterMode, setFilterMode] = useState('attention');
  const visibleMeals = filterMode === 'attention'
    ? meals.filter((meal) => mealReviews[meal.type]?.needsAttention)
    : meals;

  return (
    <section className="meals-to-review-section" id="meal-review">
      <div className="section-heading with-row">
        <div>
          <span className="eyebrow">Bữa cần rà soát</span>
          <h2>Bữa cần ưu tiên rà soát</h2>
          <p>Mặc định chỉ hiển thị bữa lệch chính để giảm tải đọc.</p>
        </div>
        <MealFilterToggle activeMode={filterMode} onChange={setFilterMode} />
      </div>

      <div className="meal-review-compact-list">
        {visibleMeals.map((meal) => (
          <MealReviewCardCompact key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  );
}

function DailySupportContextSection({ currentLog }) {
  return (
    <section className="daily-support-context-section" id="support-context">
      <div className="support-context-primary">
        <span className="eyebrow">Nước uống</span>
        <h2>Bối cảnh ngày ăn</h2>
        <div className="support-context-row">
          <Droplets size={18} aria-hidden="true" />
          <p><strong>Nước uống hôm nay:</strong> 1.5 L / 1.8 L. Nên chia thành 3-4 mốc trong ngày.</p>
        </div>
        <div className="support-context-row">
          <Timer size={18} aria-hidden="true" />
          <p><strong>Bữa phụ:</strong> khoảng cách bữa trưa và bữa phụ còn dài, bữa phụ đến muộn và ít đạm.</p>
        </div>
      </div>

      <details className="secondary-day-context">
        <summary>Sức khỏe trong ngày</summary>
        <div className="secondary-day-context-grid">
          <article>
            <h3>Thực phẩm bổ sung</h3>
            {currentLog.supplements.map((item) => (
              <p key={item.id}><strong>{item.name}</strong> · {item.dose} · {item.time} · {item.status}</p>
            ))}
          </article>
          <article>
            <h3>Vận động</h3>
            {currentLog.activities.length > 0 ? currentLog.activities.map((item) => (
              <p key={item.id}><strong>{item.name}</strong> · {item.duration} · {item.note}</p>
            )) : <p>Chưa ghi nhận vận động trong ngày này.</p>}
          </article>
        </div>
      </details>
    </section>
  );
}

export default function DailyLogTab({ onNavigate, showToast }) {
  const [selectedDate, setSelectedDate] = useState('2024-12-02');
  const dates = [
    { value: '2024-12-01', label: 'CN, 01/12' },
    { value: '2024-12-02', label: 'T2, 02/12' },
  ];
  const currentLog = dailyLogEntriesMock[selectedDate] ?? dailyLogEntriesMock['2024-12-02'];
  const dailyRatio = useMemo(() => buildMacroRatio(currentLog.totals), [currentLog.totals]);
  const kcalVariationData = [
    { date: '26/11', actual: 1600, goal: 1800 },
    { date: '27/11', actual: 1750, goal: 1800 },
    { date: '28/11', actual: 2100, goal: 1800 },
    { date: '29/11', actual: 1950, goal: 1800 },
    { date: '30/11', actual: 1800, goal: 1800 },
    { date: '01/12', actual: 1850, goal: 1800 },
    { date: '02/12', actual: currentLog.totals.calories, goal: 1800 },
  ];

  return (
    <div className="tab-pane daily-log-tab daily-log-minimal">
      <div className="daily-log-minimal-toolbar">
        <div>
          <span className="eyebrow">Nhật ký</span>
          <h2>Rà soát ngày ăn để hỗ trợ ra quyết định</h2>
        </div>
        <div className="daily-log-picker">
          <button className="btn-icon" type="button" aria-label="Xem ngày trước" onClick={() => setSelectedDate((current) => shiftDate(current, -1, dates))}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <CalendarDays size={17} aria-hidden="true" />
          <select className="daily-log-select" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} aria-label="Chọn ngày nhật ký">
            {dates.map((date) => <option key={date.value} value={date.value}>{date.label}</option>)}
          </select>
          <button className="btn-icon" type="button" aria-label="Xem ngày tiếp theo" onClick={() => setSelectedDate((current) => shiftDate(current, 1, dates))}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <DailyNutritionHero currentLog={currentLog} onNavigate={onNavigate} showToast={showToast} />
      <MetricStrip currentLog={currentLog} />
      <MacroDistributionMini ratio={dailyRatio} />
      <SevenDayTrendSection data={kcalVariationData} />
      <MealsToReviewSection meals={currentLog.meals} />
      <DailySupportContextSection currentLog={currentLog} />
    </div>
  );
}
