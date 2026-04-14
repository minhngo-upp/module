import React from 'react';

export default function BasicInfoTab({ patient }) {
  const sections = patient.basicInfoSections || [];

  return (
    <div className="assessment-background-grid">
      {sections.map((section) => (
        <article key={section.title} className="background-info-card">
          <div className="background-info-heading">
            <h3>{section.title}</h3>
            {section.description ? <p>{section.description}</p> : null}
          </div>
          <dl>
            {section.items.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}

      <article className="background-info-card">
        <div className="background-info-heading">
          <h3>Lưu ý chuyên môn</h3>
          <p>Những điểm giúp diễn giải nhân trắc và xét nghiệm.</p>
        </div>
        <dl>
          {patient.symptoms?.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  );
}
