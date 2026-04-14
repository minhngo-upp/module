import React, { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, CheckCircle2, ChevronRight } from 'lucide-react';
import { labReportsMock } from '../../mockData';

const labClinicalMeta = {
  'Protein toàn phần': {
    severity: 'danger',
    label: 'Ưu tiên rà soát',
    delta: 'Giảm từ 6.5 g/dL lần trước',
    interpretation: 'Cần rà soát lượng đạm thực tế và khả năng dung nạp.',
  },
  'Glucose đói': {
    severity: 'warning',
    label: 'Cần theo dõi',
    delta: 'Tăng từ 97 mg/dL lần trước',
    interpretation: 'Ưu tiên phân bố tinh bột đều giữa các bữa.',
  },
  Canxi: {
    severity: 'warning',
    label: 'Cần theo dõi',
    delta: 'Giảm từ 8.7 mg/dL lần trước',
    interpretation: 'Đối chiếu với lượng sữa/chế phẩm và tình trạng dung nạp.',
  },
  Hemoglobin: {
    severity: 'danger',
    label: 'Ưu tiên rà soát',
    delta: 'Không đổi so với lần trước',
    interpretation: 'Cân nhắc theo dõi khẩu phần giàu sắt/đạm.',
  },
};

const reportInterpretations = {
  'Sinh hóa máu': 'Ưu tiên chú ý đạm và đường huyết vì ảnh hưởng trực tiếp đến phân bố bữa ăn.',
  'Điện giải đồ': 'Canxi hơi thấp, các điện giải còn lại chưa có dấu rối loạn đáng kể.',
  'Công thức máu': 'Hemoglobin thấp nhẹ, cần theo dõi thêm nguy cơ thiếu máu và khẩu phần hỗ trợ.',
};

const reportReviewStatus = {
  'Sinh hóa máu': 'Chưa rà soát',
  'Điện giải đồ': 'Đã đối chiếu',
  'Công thức máu': 'Đã ghi nhận',
};

function LabPanelCard({ report, showToast }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const abnormalItems = report.items.filter((item) => item.abnormal);
  const abnormalCount = abnormalItems.length;
  const status = reportReviewStatus[report.reportType];
  const severityTone = abnormalCount > 1 ? 'danger' : (abnormalCount === 1 ? 'warning' : 'success');

  const visibleItems = isExpanded ? report.items : abnormalItems;

  return (
    <article className="minimal-card lab-panel-clean mb-4 p-0 overflow-hidden">
      <div 
         className="lab-panel-header p-4 cursor-pointer flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
         onClick={() => setIsExpanded(!isExpanded)}
      >
         <div className="flex items-center gap-4">
             <button className="text-gray-400">
               {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
             </button>
             <div>
                <h3 className="text-base font-bold m-0">{report.reportType}</h3>
                <div className="text-sm text-gray-500 mt-1 flex gap-3">
                   <span>{report.reportDate}</span>
                   <span>•</span>
                   <span className={`text-${status === 'Chưa rà soát' ? 'warning' : 'success'}`}>{status}</span>
                   <span>•</span>
                   <span>File: {report.attachmentUrl}</span>
                </div>
             </div>
         </div>
         <span className={`tag tag-${severityTone} font-bold`}>
            {abnormalCount > 0 ? `${abnormalCount} bất thường` : 'Ổn định'}
         </span>
      </div>
      
      {/* Interpretation Strip */}
      {reportInterpretations[report.reportType] && (
         <div className="bg-primary/10 text-primary-dark px-4 py-2 text-sm font-medium border-y border-primary/20">
            {reportInterpretations[report.reportType]}
         </div>
      )}

      {visibleItems.length > 0 && (
        <div className="lab-panel-body p-4 pt-2">
           <table className="w-full text-sm text-left">
              <thead>
                 <tr className="text-gray-500 border-b border-gray-100">
                    <th className="py-2 font-medium w-1/4">Chỉ số</th>
                    <th className="py-2 font-medium">Kết quả</th>
                    <th className="py-2 font-medium">Tham chiếu</th>
                    <th className="py-2 font-medium w-2/5">Ý nghĩa lâm sàng</th>
                 </tr>
              </thead>
              <tbody>
                 {visibleItems.map(item => {
                    const meta = labClinicalMeta[item.name];
                    const isAbnormal = item.abnormal;
                    return (
                      <tr key={item.name} className="border-b border-gray-50 last:border-0 align-top">
                         <td className="py-3">
                           <strong className={isAbnormal ? 'text-gray-900' : 'text-gray-600 font-medium'}>{item.name}</strong>
                         </td>
                         <td className="py-3">
                           <span className={isAbnormal ? 'text-danger font-bold' : ''}>{item.value} {item.unit}</span>
                         </td>
                         <td className="py-3 text-gray-500">{item.refRange}</td>
                         <td className="py-3">
                            {isAbnormal && meta ? (
                               <div className="flex flex-col gap-1">
                                 <span className={`tag tag-${meta.severity} w-fit`}>{meta.label}</span>
                                 <span className="text-gray-500 text-xs">{meta.delta}</span>
                                 <span className="text-gray-800">{meta.interpretation}</span>
                               </div>
                            ) : (
                               <span className="text-gray-400 font-medium">Bình thường</span>
                            )}
                         </td>
                      </tr>
                    )
                 })}
              </tbody>
           </table>
           
           {!isExpanded && abnormalCount > 0 && (
             <button className="text-primary text-sm font-medium mt-3" onClick={() => setIsExpanded(true)}>
                + Xem tất cả chỉ số trong phiếu
             </button>
           )}
        </div>
      )}
    </article>
  );
}

export default function LabsTab({ showToast }) {
  const totalReports = labReportsMock.length;
  const abnormalTotal = labReportsMock.flatMap(r => r.items.filter(i => i.abnormal)).length;

  return (
    <div className="module-container">
      <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-100">
         <div className="flex flex-col">
            <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Tổng số phiếu</span>
            <strong className="text-xl">{totalReports}</strong>
         </div>
         <div className="flex flex-col">
            <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Chỉ số bất thường</span>
            <strong className="text-xl text-danger">{abnormalTotal}</strong>
         </div>
      </div>

      <div className="lab-panels-wrapper">
         {labReportsMock.map(report => (
            <LabPanelCard key={report.id} report={report} showToast={showToast} />
         ))}
      </div>
    </div>
  );
}
