import React from 'react';
import { Athlete } from '../types.ts';

interface PrintListViewProps {
  data: Athlete[];
  showSignature?: boolean;
}

const PrintListView: React.FC<PrintListViewProps> = ({ data, showSignature = true }) => {
  if (!data || data.length === 0) return null;

  const athletes = [...data].sort((a, b) => a.name.localeCompare(b.name, 'th'));
  const firstAthlete = athletes[0];
  const schoolName = "โรงเรียนเทศบาล 1 วัดพรหมวิหาร";
  const logoUrl = "https://img2.pic.in.th/pic/Gemini_Generated_Image_u2dku8u2dku8u2dk.png";

  const pageSize = 25;
  const pages = [];
  for (let i = 0; i < athletes.length; i += pageSize) {
    pages.push(athletes.slice(i, i + pageSize));
  }

  return (
    <div className="bg-white text-black print:m-0 print:p-0 font-angsana">
      {pages.map((pageAthletes, pageIdx) => (
        <div 
          key={pageIdx} 
          className="print-page-container relative flex flex-col mx-auto bg-white overflow-hidden" 
          style={{ 
            width: '210mm', 
            height: '297mm', 
            padding: '15mm 15mm 15mm 15mm',
            boxSizing: 'border-box',
            pageBreakAfter: 'always',
          }}
        >
          <div className="text-center relative flex flex-col mb-6">
             <div className="absolute top-0 right-0">
                <div className="w-20 h-20 flex items-center justify-center">
                   <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
             </div>
             
             <div className="pt-2 font-angsana">
                <h1 className="text-22pt font-bold">บัญชีรายชื่อนักกีฬา</h1>
                <p className="text-20pt">ทีม {schoolName}</p>
                <p className="text-18pt">การแข่งขันกีฬากลุ่มเคลือข่ายพัฒนาการศึกษาท้องถิ่นเชียงรายสุดถิ่นไทย “แม่จันเกมส์”</p>
                
                <div className="flex justify-center gap-4 mt-2 text-18pt font-bold border-y border-black py-1">
                  <span>รายการ: {firstAthlete.sportType}</span>
                  <span>|</span>
                  <span>รุ่นอายุ: {firstAthlete.age} ปี</span>
                  <span>|</span>
                  <span>ประเภท: {firstAthlete.gender}</span>
                </div>
             </div>
          </div>

          <div className="flex-1 mt-4">
            <table className="w-full border-collapse border border-black text-16pt">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-black p-2 w-[60px] text-center font-bold">ลำดับ</th>
                  <th className="border border-black p-2 text-center font-bold">ชื่อ - นามสกุล</th>
                  <th className="border border-black p-2 w-[150px] text-center font-bold">วัน/เดือน/ปีเกิด</th>
                  <th className="border border-black p-2 w-[150px] text-center font-bold">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {pageAthletes.map((athlete, idx) => {
                  return (
                    <tr key={athlete.id} className="h-[2.5em]">
                      <td className="border border-black p-2 text-center">{pageIdx * pageSize + idx + 1}</td>
                      <td className="border border-black p-2 px-6">{athlete.name}</td>
                      <td className="border border-black p-2 text-center">
                        {athlete.birthDate ? formatDateThai(athlete.birthDate) : '-'}
                      </td>
                      <td className="border border-black p-2 text-center"></td>
                    </tr>
                  );
                })}
                {pageAthletes.length < pageSize && Array.from({ length: pageSize - pageAthletes.length }).map((_, i) => (
                   <tr key={`empty-${i}`} className="h-[2.5em]">
                     <td className="border border-black p-2">&nbsp;</td>
                     <td className="border border-black p-2">&nbsp;</td>
                     <td className="border border-black p-2">&nbsp;</td>
                     <td className="border border-black p-2">&nbsp;</td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 font-angsana">
             <div className="text-center text-18pt mb-8">
                <p>ขอรับรองว่ารายชื่อข้างต้นเป็นนักเรียนในสังกัดโรงเรียน {schoolName} จริง</p>
             </div>
             
             {showSignature && (
               <div className="w-full flex justify-end pr-10 pb-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-end mb-1">
                      <span className="text-18pt mr-2">ลงชื่อ</span>
                      <div className="border-b border-dotted border-black w-[70mm] mb-1.5"></div>
                    </div>
                    <p className="text-18pt leading-none mt-1">(นายประเทือง  เสนรังสี)</p>
                    <p className="text-18pt mt-1">ผู้อำนวยการสถานศึกษา {schoolName}</p>
                  </div>
               </div>
             )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10pt] text-gray-400 no-print">
            หน้า {pageIdx + 1} / {pages.length}
          </div>
        </div>
      ))}

      <style>{`
        .text-22pt { font-size: 22pt !important; line-height: 1.1; }
        .text-20pt { font-size: 20pt !important; line-height: 1.1; }
        .text-18pt { font-size: 18pt !important; line-height: 1.2; }
        .text-16pt { font-size: 16pt !important; line-height: 1.2; }
      `}</style>
    </div>
  );
};

function formatDateThai(dateStr: string) {
  try {
    let date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    let year = date.getFullYear() + 543;
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${year}`;
  } catch (e) {
    return dateStr;
  }
}

export default PrintListView;