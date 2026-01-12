import React, { useState, useEffect } from 'react';
import { Level, Athlete } from '../types.ts';
import { SPORTS_CONFIG } from '../constants.ts';

interface RegistrationFormProps {
  onSuccess: (athletes: any[]) => void;
  loading: boolean;
}

interface BulkAthleteEntry {
  id: string;
  name: string;
  birthDate: string;
  imageBlob: string | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, loading }) => {
  const [level, setLevel] = useState<Level>(Level.EARLY);
  const [sportName, setSportName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const fixedSchool = 'โรงเรียนเทศบาล 1 วัดพรหมวิหาร';
  const [coach, setCoach] = useState('');
  
  const [entries, setEntries] = useState<BulkAthleteEntry[]>([
    { id: crypto.randomUUID(), name: '', birthDate: '', imageBlob: null }
  ]);

  const availableSports = SPORTS_CONFIG[level];
  const selectedSport = availableSports.find(s => s.name === sportName);

  useEffect(() => {
    if (availableSports.length > 0) {
      const firstSport = availableSports[0];
      setSportName(firstSport.name);
      setAge(firstSport.ages[0]);
      setGender(firstSport.genders[0]);
    }
  }, [level]);

  useEffect(() => {
    if (selectedSport) {
      setAge(selectedSport.ages[0]);
      setGender(selectedSport.genders[0]);
    }
  }, [sportName]);

  const addRow = () => {
    setEntries([...entries, { id: crypto.randomUUID(), name: '', birthDate: '', imageBlob: null }]);
  };

  const removeRow = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const updateEntry = (id: string, field: keyof BulkAthleteEntry, value: any) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateEntry(id, 'imageBlob', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validEntries = entries.filter(e => e.name.trim() !== '' && e.imageBlob !== null);
    
    if (validEntries.length === 0) {
      alert('กรุณากรอกชื่อและแนบรูปถ่ายอย่างน้อย 1 คน');
      return;
    }

    const payload = validEntries.map(e => ({
      level,
      sportType: sportName,
      subCategory: 'ทั่วไป',
      age,
      gender,
      name: e.name,
      birthDate: e.birthDate,
      school: fixedSchool,
      coach,
      imageBlob: e.imageBlob,
      imageUrl: "",
      note: ''
    }));

    onSuccess(payload);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-yellow-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-yellow-400 p-3 rounded-2xl">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-900">ลงทะเบียนนักกีฬา</h2>
          <p className="text-blue-600 font-medium">{fixedSchool}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-blue-700 uppercase">ระดับ</label>
            <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="w-full p-2 rounded-lg border focus:outline-none text-sm">
              {Object.values(Level).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-blue-700 uppercase">กีฬา</label>
            <select value={sportName} onChange={(e) => setSportName(e.target.value)} className="w-full p-2 rounded-lg border focus:outline-none text-sm">
              {availableSports.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-blue-700 uppercase">รุ่นอายุ</label>
            <select value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-2 rounded-lg border focus:outline-none text-sm">
              {selectedSport?.ages.map(a => <option key={a} value={a}>{a} ปี</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-blue-700 uppercase">เพศ</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2 rounded-lg border focus:outline-none text-sm">
              {selectedSport?.genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-bold text-blue-700 uppercase">ครูผู้ควบคุม</label>
            <input type="text" value={coach} onChange={(e) => setCoach(e.target.value)} placeholder="ระบุชื่อผู้ควบคุม" className="w-full p-2 rounded-lg border focus:outline-none text-sm" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-700">รายชื่อนักกีฬา</h3>
            <button type="button" onClick={addRow} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
              + เพิ่มแถว
            </button>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {entries.map((entry, index) => (
              <div key={entry.id} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-xs font-bold text-gray-400 w-6">{index + 1}.</span>
                <div className="w-12 h-12 rounded-lg border-2 border-dashed border-blue-200 bg-white flex items-center justify-center relative overflow-hidden shrink-0">
                  {entry.imageBlob ? (
                    <img src={entry.imageBlob} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(entry.id, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="flex-1 min-w-[150px] space-y-2">
                   <input 
                    type="text" 
                    required
                    value={entry.name} 
                    onChange={(e) => updateEntry(entry.id, 'name', e.target.value)} 
                    placeholder="ชื่อ-นามสกุลนักกีฬา" 
                    className="w-full p-2 rounded-lg border focus:outline-none text-sm" 
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400">วันเกิด:</span>
                    <input 
                      type="date"
                      value={entry.birthDate}
                      onChange={(e) => updateEntry(entry.id, 'birthDate', e.target.value)}
                      className="flex-1 p-1 text-xs border rounded-md outline-none"
                    />
                  </div>
                </div>
                <button type="button" onClick={() => removeRow(entry.id)} className="text-red-400 hover:text-red-600 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all transform hover:scale-[1.02] shadow-lg
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 active:bg-green-700'}`}
        >
          {loading ? 'กำลังส่งข้อมูลลง Google Sheet...' : `บันทึกนักกีฬา ${entries.filter(e => e.name.trim()).length} คน 🏅`}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;