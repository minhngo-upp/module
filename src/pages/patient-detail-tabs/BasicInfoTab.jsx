import React from 'react';

function InfoGroup({ section }) {
  return (
    <article className="card info-card">
      <div className="section-heading">
        <span className="eyebrow">Thông tin cơ bản</span>
        <h2>{section.title}</h2>
        <p>{section.description}</p>
      </div>

      <dl className="info-definition-list">
        {section.items.map((item) => (
          <div key={item.label} className="info-definition-row">
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default function BasicInfoTab({ patient }) {
  return (
    <div className="tab-pane info-tab">
      <section className="info-grid">
        <div className="info-main">
          {patient.basicInfoSections.map((section) => (
            <InfoGroup key={section.title} section={section} />
          ))}
        </div>

        <aside className="info-side">
          <article className="card info-card">
            <div className="section-heading">
              <span className="eyebrow">Lưu ý chuyên môn</span>
              <h2>Triệu chứng và khả năng dung nạp hiện tại</h2>
            </div>

            <ul className="detail-list">
              {patient.symptoms.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.value}
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
