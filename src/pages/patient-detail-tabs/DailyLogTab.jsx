import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Salad, Sparkles, Timer } from 'lucide-react';
import { dailyLogEntriesMock } from '../../mockData';

function shiftDate(currentDate, direction, dates) {
  const currentIndex = dates.findIndex((item) => item.value === currentDate);
  const nextIndex = currentIndex + direction;

  if (nextIndex < 0 || nextIndex >= dates.length) {
    return currentDate;
  }

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

  if (!totalKcal) {
    return { protein: 0, fat: 0, carbs: 0, label: '0:0:0' };
  }

  const proteinRatio = Math.round((proteinKcal / totalKcal) * 100);
  const fatRatio = Math.round((fatKcal / totalKcal) * 100);
  const carbsRatio = Math.max(0, 100 - proteinRatio - fatRatio);

  return {
    protein: proteinRatio,
    fat: fatRatio,
    carbs: carbsRatio,
    label: `${proteinRatio}:${fatRatio}:${carbsRatio}`,
  };
}

export default function DailyLogTab({ patient, onNavigate }) {
  const [selectedDate, setSelectedDate] = useState('2024-12-02');

  const dates = [
    { value: '2024-12-01', label: 'CN, 01/12' },
    { value: '2024-12-02', label: 'T2, 02/12' },
  ];

  const currentLog = dailyLogEntriesMock[selectedDate];
  const dailyRatio = buildMacroRatio(currentLog.totals);

  return (
    <div className="tab-pane daily-log-tab">
      <section className="daily-log-shell">
        <article className="card daily-log-summary">
          <div className="daily-log-toolbar">
            <div className="section-heading">
              <span className="eyebrow">Nhật ký khẩu phần</span>
              <h2>Theo dõi ngày ăn gần nhất và những khoảng trống cần can thiệp</h2>
            </div>

            <div className="daily-log-picker">
              <button
                className="btn-icon"
                type="button"
                aria-label="Xem ngày trước"
                onClick={() => setSelectedDate((current) => shiftDate(current, -1, dates))}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <select
                className="daily-log-select"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                aria-label="Chọn ngày nhật ký"
              >
                {dates.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
              <button
                className="btn-icon"
                type="button"
                aria-label="Xem ngày tiếp theo"
                onClick={() => setSelectedDate((current) => shiftDate(current, 1, dates))}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="log-summary-grid">
            <div className="log-summary-card">
              <span>Tổng năng lượng</span>
              <strong>{currentLog.totals.calories} kcal</strong>
            </div>
            <div className="log-summary-card">
              <span>Protein</span>
              <strong>{currentLog.totals.protein}</strong>
            </div>
            <div className="log-summary-card">
              <span>Chất béo</span>
              <strong>{currentLog.totals.fat}</strong>
            </div>
            <div className="log-summary-card">
              <span>Glucid</span>
              <strong>{currentLog.totals.carbs}</strong>
            </div>
          </div>

          <div className="ratio-inline-summary">
            <div className="ratio-inline-heading">
              <span>Tỷ lệ P:L:G</span>
              <strong>{dailyRatio.label}</strong>
            </div>
            <div className="ratio-inline-breakdown">
              <span className="ratio-pill ratio-pill-protein">P {dailyRatio.protein}%</span>
              <span className="ratio-pill ratio-pill-fat">L {dailyRatio.fat}%</span>
              <span className="ratio-pill ratio-pill-carb">G {dailyRatio.carbs}%</span>
            </div>
          </div>
        </article>

        <section className="daily-log-layout">
          <div className="daily-log-main">
            <article className="card log-focus-card">
              <div className="section-heading">
                <span className="eyebrow">Điểm đọc nhanh</span>
                <h2>{currentLog.dateDisplay}</h2>
                <p>{currentLog.insight}</p>
              </div>
            </article>

            <article className="card meal-list-card">
              <div className="section-heading">
                <span className="eyebrow">Bữa ăn trong ngày</span>
                <h2>Chi tiết từng bữa và phân bố chất dinh dưỡng</h2>
              </div>

              <div className="meal-list">
                {currentLog.meals.map((meal) => (
                  <article key={meal.id} className="meal-card">
                    <img src={meal.img} alt={meal.name} className="meal-card-image" width="800" height="520" loading="lazy" />
                    <div className="meal-card-body">
                      <div className="meal-card-heading">
                        <div>
                          <span className="meal-type">{meal.type}</span>
                          <h3>{meal.name}</h3>
                        </div>
                        <span className="meal-time">{meal.time}</span>
                      </div>

                      <div className="meal-macros">
                        <div>
                          <span>Kcal</span>
                          <strong>{meal.kcal}</strong>
                        </div>
                        <div>
                          <span>Protein</span>
                          <strong>{meal.protein} g</strong>
                        </div>
                        <div>
                          <span>Chất béo</span>
                          <strong>{meal.fat} g</strong>
                        </div>
                        <div>
                          <span>Glucid</span>
                          <strong>{meal.carbs} g</strong>
                        </div>
                      </div>

                      <div className="meal-ratio-inline">
                        <span>Tỷ lệ P:L:G</span>
                        <strong>{buildMacroRatio(meal).label}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <div className="log-secondary-grid">
              <article className="card compact-list-card">
                <div className="section-heading">
                  <span className="eyebrow">Bổ sung</span>
                  <h2>Thuốc và hỗ trợ dinh dưỡng</h2>
                </div>

                <div className="compact-list">
                  {currentLog.supplements.map((item) => (
                    <div key={item.id} className="compact-row">
                      <div>
                        <strong>{item.name}</strong>
                        <p>
                          {item.dose} • {item.time}
                        </p>
                      </div>
                      <span className="badge badge-success">{item.status}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="card compact-list-card">
                <div className="section-heading">
                  <span className="eyebrow">Vận động</span>
                  <h2>Hoạt động đi kèm trong ngày</h2>
                </div>

                {currentLog.activities.length > 0 ? (
                  <div className="compact-list">
                    {currentLog.activities.map((item) => (
                      <div key={item.id} className="compact-row">
                        <div>
                          <strong>{item.name}</strong>
                          <p>
                            {item.duration} • {item.note}
                          </p>
                        </div>
                        <span className="badge badge-blue">Theo dõi tốt</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-copy">Chưa ghi nhận vận động trong ngày này.</p>
                )}
              </article>
            </div>
          </div>

          <aside className="daily-log-side">
            <article className="card insight-card">
              <div className="insight-row">
                <Salad size={18} aria-hidden="true" />
                <div>
                  <strong>Mức hoàn thành nhật ký</strong>
                  <p>{patient.dietLogSummary.completion}</p>
                </div>
              </div>
              <div className="insight-row">
                <Droplets size={18} aria-hidden="true" />
                <div>
                  <strong>Lượng nước trung bình</strong>
                  <p>{patient.dietLogSummary.hydration}</p>
                </div>
              </div>
              <div className="insight-row">
                <Timer size={18} aria-hidden="true" />
                <div>
                  <strong>Điểm yếu chính</strong>
                  <p>Bữa phụ chiều và nhịp nước uống</p>
                </div>
              </div>
              <div className="insight-row">
                <Sparkles size={18} aria-hidden="true" />
                <div>
                  <strong>Gợi ý tiếp theo</strong>
                  <p>Tăng món giàu đạm mềm ở bữa phụ hoặc bữa tối sớm.</p>
                </div>
              </div>

              <button className="btn-primary full-width-btn" type="button" onClick={() => onNavigate('intervention-followup')}>
                Chuyển sang kế hoạch can thiệp
              </button>
            </article>
          </aside>
        </section>
      </section>
    </div>
  );
}
