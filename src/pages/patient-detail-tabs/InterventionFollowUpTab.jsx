import React from 'react';
import CarePlanTab from './CarePlanTab';
import HistoryTab from './HistoryTab';

export default function InterventionFollowUpTab({ patient, showToast }) {
  return (
    <div className="tab-pane stacked-tab">


      <section id="intervention-plan" className="composite-section">
        <CarePlanTab patient={patient} showToast={showToast} />
      </section>

      <section id="intervention-history" className="composite-section">
        <HistoryTab showToast={showToast} />
      </section>
    </div>
  );
}
