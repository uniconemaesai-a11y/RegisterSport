
import React from 'react';

const PrintListView = ({ data, showSignature = true }) => {
  if (!data || data.length === 0) return null;
  const schoolName = "โรงเรียนเทศบาล 1 วัดพรหมวิหาร";

  return (
    <div className="p-8 bg-white text-black w-[210mm] mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">บัญชีรายชื่อนักกีฬา</h2>
      <table className="w-full border-collapse border border-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-2">ลำดับ</th>
            <th className="border border-black p-2">ชื่อ-นามสกุล</th>
            <th className="border border-black p-2">โรงเรียน</th>
            <th className="border border-black p-2">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a, i) => (
            <tr key={i}>
              <td className="border border-black p-2 text-center">{i + 1}</td>
              <td className="border border-black p-2">{a.name}</td>
              <td className="border border-black p-2">{a.school}</td>
              <td className="border border-black p-2"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintListView;
