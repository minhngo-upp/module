import React from 'react';

export default function BasicInfoTab({ patient }) {
  const sections = patient.basicInfoSections || [];
  
  return (
    <div className="module-container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <article key={section.title} className="minimal-card h-full">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 m-0">
              {section.title}
            </h3>
            <dl className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="text-sm">
                  <dt className="text-gray-500 mb-1">{item.label}</dt>
                  <dd className="font-medium text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}

        <article className="minimal-card h-full">
           <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 m-0">
             Lưu ý chuyên môn
           </h3>
           <ul className="space-y-3 text-sm">
             {patient.symptoms?.map((item) => (
               <li key={item.label}>
                 <span className="text-gray-500 block mb-1">{item.label}</span>
                 <span className="font-medium text-gray-900 block">{item.value}</span>
               </li>
             ))}
           </ul>
        </article>
      </div>
    </div>
  );
}
