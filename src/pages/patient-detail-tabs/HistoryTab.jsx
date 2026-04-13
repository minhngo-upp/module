import React from 'react';
import { followUpsMock, visitRecordsMock } from '../../mockData';

function getFollowUpStatusClass(status) {
  return status === 'Đã xử lý' ? 'status-resolved' : 'status-pending';
}

function getTimelineEventType(record, index) {
  if (index === 0) return 'Điều chỉnh kế hoạch';
  if (record.visitType?.toLowerCase().includes('follow')) return 'Follow-up';
  return 'Mốc đánh giá';
}

export default function HistoryTab({ showToast }) {
  return (
    <div className="tab-pane history-tab">
      <section className="history-layout">
        <div className="history-main">
          <article className="card history-panel history-note-panel">
            <div className="section-heading">
              <span className="eyebrow">Theo dõi & lịch sử</span>
              <h2>Nhận định chuyên môn và bước theo dõi tiếp theo</h2>
              <p>Ghi nhận quyết định sau khi chỉnh kế hoạch, sau đó tạo follow-up để đóng vòng can thiệp.</p>
            </div>

            <div className="decision-note-prompts" aria-label="Gợi ý nội dung cần ghi nhận">
              <span>Bệnh nhân hợp tác mức nào?</span>
              <span>Phản ứng với bữa phụ / nước uống?</span>
              <span>Cần kiểm tra lại trong 24-48h?</span>
            </div>

            <div className="history-form-grid">
              <label className="history-field">
                <span>Nhận định chuyên môn hiện tại</span>
                <textarea
                  rows="4"
                  defaultValue="Bệnh nhân hợp tác tốt, vẫn cần nhắc đều bữa phụ chiều và nước uống. Ưu tiên can thiệp đơn giản, dễ làm theo."
                />
              </label>

              <label className="history-field">
                <span>Điểm cần theo dõi tiếp</span>
                <textarea
                  rows="4"
                  defaultValue="Theo dõi khả năng dung nạp khi tăng bữa phụ chiều, tổng nước uống và mức mệt về cuối ngày."
                />
              </label>
            </div>

            <div className="history-actions">
              <button className="btn-secondary" type="button" onClick={() => showToast('Đã lưu ghi chú chuyên môn')}>
                Lưu ghi chú
              </button>
              <button className="btn-primary" type="button" onClick={() => showToast('Đã tạo follow-up mới')}>
                Tạo follow-up
              </button>
            </div>
          </article>

          <article className="card history-panel">
            <div className="section-heading">
              <span className="eyebrow">Diễn tiến can thiệp</span>
              <h2>Các mốc đánh giá và cập nhật chuyên môn</h2>
              <p>Đã có 2 mốc can thiệp trong 7 ngày gần nhất, mốc mới nhất được ưu tiên hiển thị.</p>
            </div>

            <div className="timeline-list">
              {visitRecordsMock.map((record, index) => {
                const eventType = getTimelineEventType(record, index);
                return (
                <article key={record.id} className={`timeline-entry ${index === 0 ? 'latest' : ''}`}>
                  <div className="timeline-dot" aria-hidden="true"></div>
                  <div className="timeline-content">
                    <div className="timeline-heading">
                      <div>
                        <strong>{record.visitType}</strong>
                        <p>
                          {record.visitDate} • {record.doctor}
                        </p>
                      </div>
                      <span className={`badge ${index === 0 ? 'badge-success' : 'badge-blue'}`}>{eventType}</span>
                    </div>
                    <p>{record.summary}</p>
                  </div>
                </article>
                );
              })}
            </div>
          </article>
        </div>

        <aside className="history-side">
          <article className="card history-panel">
            <div className="section-heading">
              <span className="eyebrow">Follow-up</span>
              <h2>Các lần nhắc và phản hồi gần nhất</h2>
            </div>

            <div className="compact-list followup-list">
              {followUpsMock.map((item) => (
                <div key={item.id} className="compact-row compact-row-top followup-item">
                  <div className="followup-item-main">
                    <strong>{item.channel} • {item.owner}</strong>
                    <p className="followup-item-meta">{item.dateTime}</p>
                    <p>{item.summary}</p>
                  </div>
                  <span className={`badge ${item.status === 'Đã xử lý' ? 'badge-success' : 'badge-warning'} ${getFollowUpStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
