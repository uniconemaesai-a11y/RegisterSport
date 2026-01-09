
import React, { useState } from 'react';
import { Athlete, Level } from '../types';

interface AthleteTableProps {
  athletes: Athlete[];
  onDelete: (id: string) => void;
  onEdit: (athlete: Athlete) => void;
  onPrint: (athlete: Athlete) => void;
  onPrintAll: (filtered: Athlete[]) => void;
}

type SortKey = 'name' | 'sportType' | 'school';
type SortDirection = 'asc' | 'desc';

const AthleteTable: React.FC<AthleteTableProps> = ({ athletes, onDelete, onEdit, onPrint, onPrintAll }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [sportFilter, setSportFilter] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <svg className="w-3 h-3 text-gray-300 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
        </svg>
      );
    }
    if (sortConfig.direction === 'asc') {
      return (
        <svg className="w-3 h-3 text-blue-600 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
        </svg>
      );
    }
    return (
      <svg className="w-3 h-3 text-blue-600 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    );
  };

  const filteredAthletes = athletes.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'All' || a.level === levelFilter;
    const matchesSport = sportFilter === 'All' || a.sportType === sportFilter;
    return matchesSearch && matchesLevel && matchesSport;
  });

  const sortedAthletes = [...filteredAthletes].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = (a[sortConfig.key] || '').toLowerCase();
    const bValue = (b[sortConfig.key] || '').toLowerCase();
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const uniqueSports = Array.from(new Set(athletes.map(a => a.sportType)));

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-blue-200">
      <div className="p-6 bg-blue-700 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              ข้อมูลนักกีฬาในระบบ
            </h2>
            <p className="text-blue-200 text-sm">กรองตามประเภทเพื่อพิมพ์ "แผงรูปนักกีฬา"</p>
          </div>
          <button 
            onClick={() => onPrintAll(sortedAthletes)}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            พิมพ์แผงรูป ( {sortedAthletes.length} คน )
          </button>
        </div>
      </div>

      <div className="p-6 bg-blue-50 border-b-2 border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <span className="absolute left-3 top-3.5 text-blue-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรือ สังกัด..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none bg-white"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none bg-white font-medium"
        >
          <option value="All">ทุกระดับชั้น</option>
          {Object.values(Level).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none bg-white font-medium"
        >
          <option value="All">ทุกชนิดกีฬา</option>
          {uniqueSports.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-blue-50 text-blue-900 font-bold uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4">ลำดับ</th>
              <th className="p-4">รูป</th>
              <th 
                className="p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center">
                  ชื่อ-นามสกุล
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => requestSort('sportType')}
              >
                <div className="flex items-center">
                  ประเภทกีฬา / รุ่น
                  {getSortIcon('sportType')}
                </div>
              </th>
              <th 
                className="p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => requestSort('school')}
              >
                <div className="flex items-center">
                  โรงเรียน
                  {getSortIcon('school')}
                </div>
              </th>
              <th className="p-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {sortedAthletes.length > 0 ? sortedAthletes.map((athlete, idx) => (
              <tr key={athlete.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="p-4 text-gray-400 font-mono text-sm">{idx + 1}</td>
                <td className="p-4">
                  <img src={athlete.imageUrl} alt={athlete.name} className="w-12 h-14 rounded-lg object-cover border-2 border-blue-100 shadow-sm" />
                </td>
                <td className="p-4">
                  <div className="font-bold text-blue-900">{athlete.name}</div>
                  <div className="text-[10px] text-blue-500 font-bold">{athlete.gender}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-gray-700">{athlete.sportType}</div>
                  <div className="text-xs text-gray-400">{athlete.age} ปี / {athlete.level}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 font-medium">{athlete.school}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(athlete)}
                      className="p-2 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-500 hover:text-white transition-all"
                      title="แก้ไขข้อมูล"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button
                      onClick={() => onPrint(athlete)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                      title="พิมพ์บัตรรายบุคคล"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(athlete.id)}
                      className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      title="ลบข้อมูล"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="font-bold text-lg">ไม่พบข้อมูลนักกีฬาในตัวเลือกนี้</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Helper for the delete confirmation logic if needed locally, though it's passed from parent
  function handleDelete(id: string) {
    onDelete(id);
  }
};

export default AthleteTable;
