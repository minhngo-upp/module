import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Droplets, Salad, Sparkles, Timer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { dailyLogEntriesMock } from '../../mockData';

const targetMetrics = {
  calories: { label: 'Tổng năng lượng', target: '1.800-1.950 kcal', targetMin: 1800, unit: 'kcal' },
  protein: { label: 'Protein', target: '78-92 g', targetMin: 78, unit: 'g' },
  fat: { label: 'Chất béo', target: 'Trong vùng phù hợp', targetMin: 50, unit: 'g' },
  carbs: { label: 'Glucid', target: 'Phân bố đều giữa các bữa', targetMin: 190, unit: 'g' },
};

const mealReviews = {
  'Bữa sáng': { status: 'Ổn', tone: 'success', note: 'Khởi đầu đủ năng lượng, có đạm.' },
  'Bữa trưa': { status: 'Đủ năng lượng', tone: 'success', note: 'Bữa chính tốt nhất trong ngày.' },
  'Bữa phụ chiều': { status: 'Còn nhẹ', tone: 'warning', note: 'Nên tăng món mềm, giàu đạm.' },
  'Bữa tối': { status: 'Theo dõi thêm', tone: 'neutral', note: 'Phù hợp, có thể tăng nhẹ nếu còn ăn được.' },
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

function MetricStatusBadge({ children, tone = 'neutral' }) {
  return <span className={`nutrition-status-badge status-${tone}`}>{children}</span>;
}

function getMetricStatus(metricKey, value) {
  const numericValue = parseMacroValue(value);
  const metric = targetMetrics[metricKey];
  if (metricKey === 'calories') return { label: numericValue >= metric.targetMin ? 'Đạt mục tiêu' : 'Gần đạt', tone: numericValue >= metric.targetMin ? 'success' : 'warning', progress: Math.min(100, Math.round((numericValue / metric.targetMin) * 100)), delta: numericValue >= metric.targetMin ? 'Đạt mốc tối thiểu' : `Thiếu ${metric.targetMin - numericValue} kcal` };
  if (numericValue >= metric.targetMin) return { label: 'Đạt mục tiêu', tone: 'success', progress: 100, delta: 'Trong vùng mục tiêu' };
  return { label: 'Cần theo dõi', tone: 'warning', progress: Math.round((numericValue / metric.targetMin) * 100), delta: `Cần tăng thêm ${Math.round(metric.targetMin - numericValue)} ${metric.unit}` };
}

function DailyNutritionImpressionCard({ currentLog }) {
  return (
    <article className="card daily-impression-card">
      <div className="section-heading">
        <span className="eyebrow">Kết luận nhanh ngày</span>
        <h2>Điểm cần chú ý hôm nay</h2>
        <p>Tổng năng lượng gần đạt mục tiêu, nhưng bữa phụ chiều và nước uống vẫn là khoảng trống cần can thiệp.</p>
      </div>
      <div className="daily-impression-grid">
        <section>
          <h3>Điều đáng chú ý</h3>
          <ul>
            <li>Tổng kcal gần đạt nhưng phân bố chưa đều giữa các bữa.</li>
            <li>Bữa phụ chiều còn nhẹ và ít đạm.</li>
            <li>Nước uống mới đạt khoảng 1.5 lít.</li>
          </ul>
        </section>
        <section>
          <h3>Việc nên làm tiếp</h3>
          <ul>
            <li>Tăng bữa phụ mềm, giàu đạm.</li>
            <li>Chia nước uống theo mốc giờ.</li>
            <li>Giữ năng lượng đều giữa các bữa chính.</li>
          </ul>
        </section>
      </div>
      <p className="daily-impression-note">{currentLog.insight}</p>
    </article>
  );
}

function DailyTargetVsActualRow({ currentLog }) {
  const metricEntries = [
    ['calories', `${currentLog.totals.calories} kcal`],
    ['protein', currentLog.totals.protein],
    ['fat', currentLog.totals.fat],
    ['carbs', currentLog.totals.carbs],
  ];

  return (
    <div className="daily-target-grid">
      {metricEntries.map(([key, actual]) => {
        const metric = targetMetrics[key];
        const status = getMetricStatus(key, actual);
        return (
          <article className="daily-target-card" key={key}>
            <div className="daily-target-top">
              <span>{metric.label}</span>
              <MetricStatusBadge tone={status.tone}>{status.label}</MetricStatusBadge>
            </div>
            <strong>{actual}</strong>
            <div className="micro-progress" aria-hidden="true">
              <span className={`micro-progress-fill progress-${status.tone}`} style={{ width: `${status.progress}%` }} />
            </div>
            <p>Mục tiêu: {metric.target}</p>
            <small>{status.delta}</small>
          </article>
        );
      })}
    </div>
  );
}

function MacroDistributionCard({ ratio }) {
  return (
    <article className="macro-distribution-card">
      <div>
        <span className="eyebrow">Phân bố năng lượng hôm nay</span>
        <h3>P:L:G {ratio.label}</h3>
        <p>Cân đối tương đối ổn, nhưng đạm nên được tăng nhẹ ở bữa phụ chiều.</p>
      </div>
      <div className="macro-stack-bar" aria-label={`Protein ${ratio.protein}%, lipid ${ratio.fat}%, glucid ${ratio.carbs}%`}>
        <span className="macro-protein" style={{ width: `${ratio.protein}%` }}>P {ratio.protein}%</span>
        <span className="macro-fat" style={{ width: `${ratio.fat}%` }}>L {ratio.fat}%</span>
        <span className="macro-carb" style={{ width: `${ratio.carbs}%` }}>G {ratio.carbs}%</span>
      </div>
    </article>
  );
}

function WaterIntakeCard() {
  return (
    <article className="card water-intake-card">
      <div className="water-card-top">
        <div className="status-icon"><Droplets size={18} aria-hidden="true" /></div>
        <div>
          <span className="eyebrow">Nước uống</span>
          <h3>1.5 L hôm nay</h3>
          <p>Mục tiêu: 1.8 L · Thiếu khoảng 0.3 L</p>
        </div>
        <MetricStatusBadge tone="warning">Chưa đạt</MetricStatusBadge>
      </div>
      <div className="micro-progress" aria-hidden="true">
        <span className="micro-progress-fill progress-warning" style={{ width: '83%' }} />
      </div>
      <p className="water-guidance">Nên chia thành 3-4 mốc trong ngày, tránh dồn nhiều vào cuối ngày.</p>
    </article>
  );
}

function NutritionTrendChart({ data }) {
  const underGoalCount = data.filter((item) => item.actual < item.goal).length;
  return (
    <article className="card nutrition-trend-card">
      <div className="section-heading">
        <span className="eyebrow">Xu hướng 7 ngày</span>
        <h2>Biến thiên năng lượng gần đây</h2>
        <p>Dưới mục tiêu {underGoalCount}/7 ngày. Năng lượng ổn hơn 3 ngày gần đây nhưng vẫn chưa đều.</p>
      </div>
      <div className="nutrition-chart-shell">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 12px 24px -20px rgb(15 23 42 / 0.35)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '13px' }} />
            <ReferenceLine y={1800} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Mục tiêu', position: 'insideTopRight', fill: '#64748b', fontSize: 12 }} />
            <Line type="monotone" name="Thực tế" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" name="Mục tiêu" dataKey="goal" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function QuickInsightCard({ onNavigate }) {
  return (
    <article className="card insight-card decision-insight-card">
      <div className="section-heading">
        <span className="eyebrow">Điểm đọc nhanh</span>
        <h2>Vấn đề, ý nghĩa và ưu tiên xử lý</h2>
      </div>
      <div className="decision-insight-list">
        <div><strong>Vấn đề</strong><p>Bữa phụ chiều còn nhẹ, nước uống chưa đạt mục tiêu.</p></div>
        <div><strong>Ý nghĩa</strong><p>Tổng năng lượng cuối ngày dễ hụt, nhịp uống nước chưa đều.</p></div>
        <div><strong>Ưu tiên xử lý</strong><p>Tăng món mềm giàu đạm ở bữa phụ và chia nước theo mốc giờ.</p></div>
      </div>
      <button className="btn-primary nutrition-action-btn" type="button" onClick={() => onNavigate('intervention-followup')}>
        Chuyển sang kế hoạch can thiệp
        <ArrowRight size={15} className="button-icon-inline" aria-hidden="true" />
      </button>
    </article>
  );
}

function NutritionJumpNav() {
  return (
    <nav className="nutrition-jump-nav" aria-label="Đi nhanh trong nhật ký khẩu phần">
      <a href="#daily-overview">Tổng quan ngày</a>
      <a href="#meal-review">Từng bữa</a>
      <a href="#water-intake">Nước uống</a>
      <a href="#support-context">Bổ sung</a>
      <a href="#support-context">Vận động</a>
    </nav>
  );
}

function NutritionFilterBar() {
  return (
    <div className="nutrition-filter-bar" aria-label="Bộ lọc nhật ký khẩu phần">
      <button className="active" type="button">Tất cả bữa</button>
      <button type="button">Chỉ xem bữa cần chú ý</button>
      <button type="button">Chỉ ngày thiếu mục tiêu</button>
    </div>
  );
}

function MealReviewCard({ meal }) {
  const review = mealReviews[meal.type] ?? { status: 'Theo dõi thêm', tone: 'neutral', note: 'Cần đọc cùng tổng năng lượng trong ngày.' };
  const ratio = buildMacroRatio(meal);

  return (
    <article className={`meal-card meal-review-card meal-review-${review.tone}`}>
      <img src={meal.img} alt={meal.name} className="meal-card-image" width="800" height="520" loading="lazy" />
      <div className="meal-card-body">
        <div className="meal-card-heading">
          <div>
            <span className="meal-type">{meal.type}</span>
            <h3>{meal.name}</h3>
          </div>
          <div className="meal-heading-status">
            <span className="meal-time">{meal.time}</span>
            <MetricStatusBadge tone={review.tone}>{review.status}</MetricStatusBadge>
          </div>
        </div>

        <p className="meal-review-note">{review.note}</p>

        <div className="meal-macros">
          <div><span>Kcal</span><strong>{meal.kcal}</strong></div>
          <div><span>Protein</span><strong>{meal.protein} g</strong></div>
          <div><span>Chất béo</span><strong>{meal.fat} g</strong></div>
          <div><span>Glucid</span><strong>{meal.carbs} g</strong></div>
        </div>

        <div className="meal-ratio-inline">
          <span>Tỷ lệ P:L:G</span>
          <strong>{ratio.label}</strong>
          <small>P {ratio.protein}% · L {ratio.fat}% · G {ratio.carbs}%</small>
        </div>
      </div>
    </article>
  );
}

function MealTimingInsight() {
  return (
    <article className="card meal-timing-card">
      <div className="status-icon"><Timer size={18} aria-hidden="true" /></div>
      <div>
        <span className="eyebrow">Nhịp ăn</span>
        <h3>Khoảng cách bữa trưa và bữa phụ còn dài</h3>
        <p>Bữa phụ chiều đến muộn và ít đạm, dễ làm hụt năng lượng cuối ngày.</p>
      </div>
    </article>
  );
}

export default function DailyLogTab({ patient, onNavigate }) {
  const [selectedDate, setSelectedDate] = useState('2024-12-02');

  const kcalVariationData = [
    { date: '26/11', actual: 1600, goal: 1800 },
    { date: '27/11', actual: 1750, goal: 1800 },
    { date: '28/11', actual: 2100, goal: 1800 },
    { date: '29/11', actual: 1950, goal: 1800 },
    { date: '30/11', actual: 1800, goal: 1800 },
    { date: '01/12', actual: 1850, goal: 1800 },
    { date: '02/12', actual: parseFloat(dailyLogEntriesMock['2024-12-02']?.totals?.calories) || 1650, goal: 1800 },
  ];

  const dates = [
    { value: '2024-12-01', label: 'CN, 01/12' },
    { value: '2024-12-02', label: 'T2, 02/12' },
  ];

  const currentLog = dailyLogEntriesMock[selectedDate];
  const dailyRatio = useMemo(() => buildMacroRatio(currentLog.totals), [currentLog.totals]);

  return (
    <div className="tab-pane daily-log-tab">
      <section className="daily-log-shell">
        <article className="card daily-log-summary" id="daily-overview">
          <div className="daily-log-toolbar">
            <div className="section-heading">
              <span className="eyebrow">Nhật ký khẩu phần</span>
              <h2>Đọc nhanh ngày ăn và khoảng trống cần can thiệp</h2>
              <p>Ưu tiên mục tiêu vs thực tế, bữa lệch chính, nước uống và nhịp phân bố bữa.</p>
            </div>

            <div className="daily-log-picker">
              <button className="btn-icon" type="button" aria-label="Xem ngày trước" onClick={() => setSelectedDate((current) => shiftDate(current, -1, dates))}>
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <select className="daily-log-select" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} aria-label="Chọn ngày nhật ký">
                {dates.map((date) => <option key={date.value} value={date.value}>{date.label}</option>)}
              </select>
              <button className="btn-icon" type="button" aria-label="Xem ngày tiếp theo" onClick={() => setSelectedDate((current) => shiftDate(current, 1, dates))}>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <NutritionJumpNav />
          <DailyNutritionImpressionCard currentLog={currentLog} />
          <DailyTargetVsActualRow currentLog={currentLog} />
          <MacroDistributionCard ratio={dailyRatio} />
          <NutritionTrendChart data={kcalVariationData} />
        </article>

        <section className="daily-log-layout">
          <div className="daily-log-main">
            <WaterIntakeCard />
            <MealTimingInsight />

            <article className="card meal-list-card" id="meal-review">
              <div className="meal-list-header">
                <div className="section-heading">
                  <span className="eyebrow">Đánh giá từng bữa</span>
                  <h2>Bữa nào là điểm lệch chính trong ngày</h2>
                </div>
                <NutritionFilterBar />
              </div>

              <div className="meal-list">
                {currentLog.meals.map((meal) => <MealReviewCard key={meal.id} meal={meal} />)}
              </div>
            </article>

            <div className="log-secondary-grid" id="support-context">
              <article className="card compact-list-card secondary-context-card">
                <div className="section-heading">
                  <span className="eyebrow">Bổ sung</span>
                  <h2>Thuốc và hỗ trợ dinh dưỡng</h2>
                  <p>Context phụ để đối chiếu với nhận định ngày ăn.</p>
                </div>
                <div className="compact-list">
                  {currentLog.supplements.map((item) => (
                    <div key={item.id} className="compact-row">
                      <div><strong>{item.name}</strong><p>{item.dose} · {item.time}</p></div>
                      <span className="badge badge-success">{item.status}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="card compact-list-card secondary-context-card">
                <div className="section-heading">
                  <span className="eyebrow">Vận động</span>
                  <h2>Hoạt động đi kèm trong ngày</h2>
                  <p>Chỉ nhấn mạnh khi ảnh hưởng đến dung nạp hoặc mệt.</p>
                </div>
                {currentLog.activities.length > 0 ? (
                  <div className="compact-list">
                    {currentLog.activities.map((item) => (
                      <div key={item.id} className="compact-row">
                        <div><strong>{item.name}</strong><p>{item.duration} · {item.note}</p></div>
                        <span className="badge badge-blue">Theo dõi tốt</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="empty-copy">Chưa ghi nhận vận động trong ngày này.</p>}
              </article>
            </div>
          </div>

          <aside className="daily-log-side">
            <QuickInsightCard onNavigate={onNavigate} />
            <article className="card insight-card secondary-context-card">
              <div className="insight-row">
                <Salad size={18} aria-hidden="true" />
                <div><strong>Mức hoàn thành nhật ký</strong><p>{patient.dietLogSummary.completion}</p></div>
              </div>
              <div className="insight-row">
                <Droplets size={18} aria-hidden="true" />
                <div><strong>Lượng nước trung bình</strong><p>{patient.dietLogSummary.hydration}</p></div>
              </div>
              <div className="insight-row">
                <Sparkles size={18} aria-hidden="true" />
                <div><strong>Gợi ý tiếp theo</strong><p>Tăng món giàu đạm mềm ở bữa phụ hoặc bữa tối sớm.</p></div>
              </div>
            </article>
          </aside>
        </section>
      </section>
    </div>
  );
}
