
import React from 'react';
import { Athlete } from '../types';

interface PrintViewProps {
  data: Athlete[] | Athlete | null;
  showSignature?: boolean;
}

const PrintView: React.FC<PrintViewProps> = ({ data, showSignature = true }) => {
  if (!data) return null;

  const athletes = Array.isArray(data) ? data : [data];
  
  // Group athletes by sport type, age, and gender
  const groupedAthletes = athletes.reduce((acc, athlete) => {
    const sport = athlete.sportType || "ทั่วไป";
    const age = athlete.age || "ไม่ระบุ";
    const gender = athlete.gender || "ไม่ระบุ";
    const key = `${sport}|${age}|${gender}`;
    
    if (!acc[key]) acc[key] = [];
    acc[key].push(athlete);
    return acc;
  }, {} as Record<string, Athlete[]>);

  const groupKeys = Object.keys(groupedAthletes).sort((a, b) => a.localeCompare(b, 'th'));

  return (
    <div className="bg-white text-black print:m-0 print:p-0 font-angsana">
      {groupKeys.map((key) => {
        const [sportType, age, gender] = key.split('|');
        return (
          <GroupedSection 
            key={key} 
            sportType={sportType} 
            age={age}
            gender={gender}
            athletes={groupedAthletes[key]} 
            showSignature={showSignature}
          />
        );
      })}

      <style>{`
        @font-face {
          font-family: 'Angsana New';
          src: local('Angsana New'), local('AngsanaNew');
        }

        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-page-container { 
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            page-break-after: always;
          }
          .no-print { display: none !important; }
        }

        .font-angsana {
          font-family: 'Angsana New', 'Sarabun', sans-serif;
        }

        /* Thai official font sizes for A4 Printing */
        .text-24pt { font-size: 24pt !important; line-height: 1; }
        .text-22pt { font-size: 22pt !important; line-height: 1; }
        .text-20pt { font-size: 20pt !important; line-height: 1; }
        .text-18pt { font-size: 18pt !important; line-height: 1.1; }
        .text-16pt { font-size: 16pt !important; line-height: 1.1; }
        .text-15pt { font-size: 15pt !important; line-height: 1.1; }
        .text-14pt { font-size: 14pt !important; line-height: 1.1; }
        
        .thai-dotted-line {
          border-bottom: 1px dotted black;
          display: inline-block;
          flex: 1;
          margin-left: 2px;
          min-height: 1.2em;
          position: relative;
          bottom: -2px;
        }

        .category-circle {
          display: inline-block;
          width: 12pt;
          height: 12pt;
          border: 1px solid black;
          border-radius: 50%;
          margin-right: 4px;
          vertical-align: middle;
          position: relative;
          top: -1px;
        }

        .category-circle.active {
          background-color: black;
          box-shadow: inset 0 0 0 2px white;
        }

        .leading-none { line-height: 1; }
        .leading-tight { line-height: 1.1; }
      `}</style>
    </div>
  );
};

interface GroupedSectionProps {
  sportType: string;
  age: string;
  gender: string;
  athletes: Athlete[];
  showSignature: boolean;
}

const GroupedSection: React.FC<GroupedSectionProps> = ({ sportType, age, gender, athletes, showSignature }) => {
  const schoolName = "โรงเรียนเทศบาล 1 วัดพรหมวิหาร";
  const logoUrl = "https://img2.pic.in.th/pic/Gemini_Generated_Image_u2dku8u2dku8u2dk.png";
  
  // 15 athletes per page (5 columns x 3 rows) as shown in the sample
  const pageSize = 15; 
  const pages = [];
  for (let i = 0; i < athletes.length; i += pageSize) {
    pages.push(athletes.slice(i, i + pageSize));
  }

  return (
    <>
      {pages.map((pageAthletes, pageIdx) => (
        <div 
          key={pageIdx} 
          className="print-page-container relative flex flex-col mx-auto bg-white overflow-hidden" 
          style={{ 
            width: '210mm', 
            height: '297mm', 
            padding: '12mm 15mm 10mm 15mm',
            boxSizing: 'border-box',
            pageBreakAfter: 'always',
          }}
        >
          {/* Header Section */}
          <div className="text-center relative flex flex-col mb-4">
             {/* Logo at Top Right */}
             <div className="absolute top-0 right-0">
                <div className="w-24 h-24 flex items-center justify-center">
                   <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
             </div>
             
             <div className="pt-2 font-angsana">
                <h1 className="text-22pt font-bold">แผงรูปนักกีฬา</h1>
                <p className="text-20pt">ทีม <span className="font-bold underline underline-offset-4 decoration-dotted">{schoolName}</span></p>
                <p className="text-18pt">การแข่งขันกีฬากลุ่มเคลือข่ายพัฒนาการศึกษาท้องถิ่นเชียงรายสุดถิ่นไทย “แม่จันเกมส์”</p>
                
                <div className="text-18pt flex items-center justify-center gap-1 mt-1">
                  <span>รายการ</span>
                  <div className="border-b border-dotted border-black w-[400px] font-bold min-h-[1.2em]">
                    {sportType}
                  </div>
                </div>

                <div className="flex justify-center gap-10 mt-1 text-18pt items-center">
                  <span>ประเภท</span>
                  <div className="flex items-center gap-1">
                    <div className={`category-circle ${age === '8' ? 'active' : ''}`}></div> 8 ปี
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`category-circle ${age === '10' ? 'active' : ''}`}></div> 10 ปี
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`category-circle ${age === '12' ? 'active' : ''}`}></div> 12 ปี
                  </div>
                </div>
             </div>
          </div>

          {/* Athlete Grid (5 columns x 3 rows = 15 athletes) */}
          <div className="grid grid-cols-5 gap-x-2 gap-y-6 flex-1 items-start content-start mt-4">
            {pageAthletes.map((athlete) => (
              <AthleteBox key={athlete?.id || Math.random()} athlete={athlete} />
            ))}
            
            {/* Fill empty slots */}
            {pageAthletes.length < pageSize && Array.from({ length: pageSize - pageAthletes.length }).map((_, i) => (
               <AthleteBox key={`empty-${i}`} athlete={null} />
            ))}
          </div>

          {/* Certification and Signature Footer */}
          <div className="mt-auto pt-4 font-angsana relative">
             <div className="text-center text-18pt mb-6 leading-tight">
                <p>ขอรับรองว่าตามรายชื่อและรูปถ่ายข้างบน เป็นนักเรียนโรงเรียนเทศบาล 1 วัดพรหมวิหาร จริง</p>
                <p>และขอรับรองว่า จะปฏิบัติตามหลักเกณฑ์การแข่งขันทุกประการ</p>
             </div>
             
             {showSignature && (
               <div className="w-full flex justify-end pr-10 pb-12">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-end mb-1">
                      <span className="text-18pt mr-2">ลงชื่อ</span>
                      <div className="border-b border-dotted border-black w-[70mm] mb-1.5"></div>
                    </div>
                    <p className="text-18pt leading-none mt-1">(นายประเทือง  เสนรังสี)</p>
                    <p className="text-18pt mt-1">ผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล 1 วัดพรหมวิหาร</p>
                  </div>
               </div>
             )}
          </div>

          <div className="absolute bottom-4 left-6 text-[8pt] text-gray-300 italic no-print">
            หน้า {pageIdx + 1} / {pages.length} — {sportType} {age}ปี {gender}
          </div>
        </div>
      ))}
    </>
  );
};

const AthleteBox: React.FC<{ athlete: Athlete | null }> = ({ athlete }) => {
  const nameParts = athlete?.name.split(' ') || ['', ''];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      let date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      let year = date.getFullYear();
      if (year < 2400) year += 543; // Buddhist Era
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col items-center leading-none">
      {/* Frame Size: Small as requested (approx 25mm x 32mm) */}
      <div className="w-[26mm] h-[32mm] border border-black bg-white overflow-hidden flex items-center justify-center relative mb-1 text-center">
        {athlete?.imageUrl ? (
          <img 
            src={athlete.imageUrl} 
            alt={athlete.name}
            className="w-full h-full object-cover" 
            loading="eager"
            onError={(e) => {
               e.currentTarget.style.display = 'none';
               const parent = e.currentTarget.parentElement;
               if (parent && !parent.querySelector('.img-label-placeholder')) {
                 const placeholder = document.createElement('div');
                 placeholder.className = "img-label-placeholder flex flex-col items-center justify-center h-full text-black text-[14pt] font-angsana leading-tight";
                 placeholder.innerHTML = "<span>ติดรูปถ่าย</span><span>นักกีฬา</span>";
                 parent.appendChild(placeholder);
               }
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-black text-[13pt] font-angsana leading-tight">
            <span>ติดรูปถ่าย</span>
            <span>นักกีฬา</span>
          </div>
        )}
      </div>

      {/* Athlete Data with Labels and Dotted Lines */}
      <div className="w-full space-y-0.5 font-angsana px-0.5">
        <div className="flex items-end overflow-hidden whitespace-nowrap text-14pt h-[1.3em]">
           <span className="shrink-0">ชื่อ</span> 
           <div className="thai-dotted-line truncate">
             {firstName || ''}
           </div>
        </div>
        <div className="flex items-end overflow-hidden whitespace-nowrap text-14pt h-[1.3em]">
           <span className="shrink-0">สกุล</span> 
           <div className="thai-dotted-line truncate">
             {lastName || ''}
           </div>
        </div>
        <div className="flex items-end overflow-hidden whitespace-nowrap text-14pt h-[1.3em]">
           <span className="shrink-0">ว/ด/ป</span> 
           <div className="thai-dotted-line text-center">
             {formatDate(athlete?.birthDate)}
           </div>
        </div>
      </div>
    </div>
  );
}

export default PrintView;
