
import React, { useState } from 'react';
import { Level } from '../types.js';

const AthleteTable = ({ athletes, onDelete, onEdit, onPrint, onPrintAll }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [sportFilter, setSportFilter] = useState('All');

  const filteredAthletes = athletes.filter(a => {
    const matchesSearch = (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (a.school || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'All' || a.level === levelFilter;
    const matchesSport = sportFilter === 'All' || a.sportType === sportFilter;
    return matchesSearch && matchesLevel && matchesSport;
  });

  const uniqueSports = Array.from(new Set(athletes.map(a => a.sportType)));

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-blue-200">
      <div className="p-6 bg-blue-700 text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">รายชื่อนักกีฬาในระบบ</h2>
        <button onClick={() => onPrintAll(filteredAthletes)} className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-xl font-bold">พิมพ์แผงรูป ({filteredAthletes.length})</button>
      </div>

      <div className="p-4 bg-blue-50 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="ค้นหาชื่อ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 rounded-lg border" />
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="p-2 rounded-lg border">
          <option value="All">ทุกระดับ</option>
          {Object.values(Level).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} className="p-2 rounded-lg border">
          <option value="All">ทุกกีฬา</option>
          {uniqueSports.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-bold">
            <tr>
              <th className="p-4">รูป</th>
              <th className="p-4">ชื่อ-นามสกุล</th>
              <th className="p-4">ประเภท/รุ่น</th>
              <th className="p-4">โรงเรียน</th>
              <th className="p-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredAthletes.map((athlete) => (
              <tr key={athlete.id} className="border-t hover:bg-gray-50">
                <td className="p-2"><img src={athlete.imageUrl} className="w-10 h-12 rounded object-cover border" /></td>
                <td className="p-4 font-bold">{athlete.name}</td>
                <td className="p-4">{athlete.sportType} ({athlete.age} ปี)</td>
                <td className="p-4 text-gray-500">{athlete.school}</td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => onEdit(athlete)} className="p-2 text-yellow-600 bg-yellow-50 rounded-lg">แก้ไข</button>
                  <button onClick={() => onDelete(athlete.id)} className="p-2 text-red-600 bg-red-50 rounded-lg">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AthleteTable;
