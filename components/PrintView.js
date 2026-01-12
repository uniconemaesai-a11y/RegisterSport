
import React from 'react';

const PrintView = ({ data, showSignature = true }) => {
  if (!data) return null;
  const athletes = Array.isArray(data) ? data : [data];
  const schoolName = "โรงเรียนเทศบาล 1 วัดพรหมวิหาร";
  const logoUrl = "https://img2.pic.in.th/pic/Gemini_Generated_Image_u2dku8u2dku8u2dk.png";

  return (
    <div className="p-8 bg-white text-black font-angsana min-h-screen w-[210mm] mx-auto">
      <div className="text-center mb-8 relative">
        <img src={logoUrl} className="w-20 h-20 absolute top-0 right-0" />
        <h1 className="text-2xl font-bold">แผงรูปนักกีฬา</h1>
        <p className="text-xl">ทีม {schoolName}</p>
        <p>การแข่งขันกีฬา “แม่จันเกมส์”</p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {athletes.map((a, i) => (
          <div key={i} className="flex flex-col items-center border p-2 rounded">
            <div className="w-[24mm] h-[30mm] border border-black bg-gray-50 flex items-center justify-center overflow-hidden mb-1">
              {a.imageUrl ? <img src={a.imageUrl} className="w-full h-full object-cover" /> : <span className="text-xs">ไม่มีรูป</span>}
            </div>
            <div className="text-xs text-center leading-tight">
              <div className="font-bold truncate w-full">{a.name}</div>
              <div>{a.birthDate}</div>
            </div>
          </div>
        ))}
      </div>

      {showSignature && (
        <div className="mt-20 flex justify-end">
          <div className="text-center">
            <p>ลงชื่อ......................................................</p>
            <p>(นายประเทือง เสนรังสี)</p>
            <p>ผู้อำนวยการสถานศึกษา</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintView;
