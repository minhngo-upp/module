import React from 'react';
import { followUpsMock, visitRecordsMock } from '../../mockData';

export default function HistoryTab({ showToast }) {
  return (
    <div className="tab-pane history-tab">
      <section className="history-layout">
        <div className="history-main">
          <article className="card history-panel">
            <div className="section-heading">
              <span className="eyebrow">Theo dõi & lịch sử</span>
              <h2>Nhận định chuyên môn và diễn tiến can thiệp</h2>
            </div>

            <div className="history-form-grid">
              <label className="history-field">
                <span>Nhận định hiện tại</span>
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
            </div>

            <div className="timeline-list">
              {visitRecordsMock.map((record) => (
                <article key={record.id} className="timeline-entry">
                  <div className="timeline-dot" aria-hidden="true"></div>
                  <div className="timeline-content">
                    <div className="timeline-heading">
                      <div>
                        <strong>{record.visitType}</strong>
                        <p>
                          {record.visitDate} • {record.doctor}
                        </p>
                      </div>
                      <span className="badge badge-blue">Mốc đánh giá</span>
                    </div>
                    <p>{record.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>

        <aside className="history-side">
          <article className="card history-panel">
            <div className="section-heading">
              <span className="eyebrow">Follow-up</span>
              <h2>Các lần nhắc và phản hồi gần nhất</h2>
            </div>

            <div className="compact-list">
              {followUpsMock.map((item) => (
                <div key={item.id} className="compact-row compact-row-top">
                  <div>
                    <strong>
                      {item.channel} • {item.owner}
                    </strong>
                    <p>{item.dateTime}</p>
                    <p>{item.summary}</p>
                  </div>
                  <span className={`badge ${item.status === 'Đã xử lý' ? 'badge-success' : 'badge-warning'}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
