
import React, { useState, useEffect } from 'react';
import { Level } from '../types.js';
import { SPORTS_CONFIG } from '../constants.js';

const RegistrationForm = ({ onSuccess, loading }) => {
  const [level, setLevel] = useState(Level.EARLY);
  const [sportName, setSportName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const fixedSchool = 'โรงเรียนเทศบาล 1 วัดพรหมวิหาร';
  const [coach, setCoach] = useState('');
  const [entries, setEntries] = useState([{ id: crypto.randomUUID(), name: '', birthDate: '', imageBlob: null }]);

  const availableSports = SPORTS_CONFIG[level] || [];
  const selectedSport = availableSports.find(s => s.name === sportName);

  useEffect(() => {
    if (availableSports.length > 0) {
      const firstSport = availableSports[0];
      setSportName(firstSport.name);
      setAge(firstSport.ages[0]);
      setGender(firstSport.genders[0]);
    }
  }, [level]);

  const addRow = () => setEntries([...entries, { id: crypto.randomUUID(), name: '', birthDate: '', imageBlob: null }]);
  const removeRow = (id) => entries.length > 1 && setEntries(entries.filter(e => e.id !== id));
  const updateEntry = (id, field, value) => setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));

  const handleImageChange = (id, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateEntry(id, 'imageBlob', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validEntries = entries.filter(e => e.name.trim() !== '' && e.imageBlob !== null);
    if (validEntries.length === 0) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    onSuccess(validEntries.map(e => ({
      level, sportType: sportName, subCategory: 'ทั่วไป', age, gender, name: e.name, birthDate: e.birthDate, school: fixedSchool, coach, imageBlob: e.imageBlob
    })));
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-yellow-300">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">ลงทะเบียนนักกีฬา</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="p-2 border rounded-lg text-sm">
            {Object.values(Level).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={sportName} onChange={(e) => setSportName(e.target.value)} className="p-2 border rounded-lg text-sm">
            {availableSports.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <select value={age} onChange={(e) => setAge(e.target.value)} className="p-2 border rounded-lg text-sm">
            {selectedSport?.ages.map(a => <option key={a} value={a}>{a} ปี</option>)}
          </select>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="p-2 border rounded-lg text-sm">
            {selectedSport?.genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <input type="text" value={coach} onChange={(e) => setCoach(e.target.value)} placeholder="ครูผู้ควบคุม" className="w-full p-2 border rounded-lg text-sm" />
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <div key={entry.id} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl">
              <span className="text-xs">{idx+1}.</span>
              <div className="w-10 h-10 border rounded overflow-hidden relative">
                {entry.imageBlob ? <img src={entry.imageBlob} className="w-full h-full object-cover" /> : <div className="text-[10px] text-center mt-2">รูป</div>}
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(entry.id, e)} className="absolute inset-0 opacity-0" />
              </div>
              <input type="text" value={entry.name} onChange={(e) => updateEntry(entry.id, 'name', e.target.value)} placeholder="ชื่อ-นามสกุล" className="flex-1 p-2 border rounded-lg text-sm" />
              <input type="date" value={entry.birthDate} onChange={(e) => updateEntry(entry.id, 'birthDate', e.target.value)} className="p-2 border rounded-lg text-xs" />
              <button type="button" onClick={() => removeRow(entry.id)} className="text-red-500">✕</button>
            </div>
          ))}
          <button type="button" onClick={addRow} className="text-blue-600 text-sm font-bold">+ เพิ่มแถว</button>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-green-500 text-white rounded-xl font-bold">{loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
