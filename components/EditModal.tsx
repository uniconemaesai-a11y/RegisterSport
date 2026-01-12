import React, { useState, useEffect } from 'react';
import { Athlete, Level } from '../types.ts';
import { SPORTS_CONFIG } from '../constants.ts';

interface EditModalProps {
  athlete: Athlete;
  onClose: () => void;
  onSave: (id: string, updatedData: any) => void;
  loading: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ athlete, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState<any>({ ...athlete, imageBlob: null });
  
  const availableSports = SPORTS_CONFIG[formData.level as Level] || [];
  const selectedSport = availableSports.find(s => s.name === formData.sportType);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageBlob: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(athlete.id, formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-400">
        <div className="p-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            แก้ไขข้อมูลนักกีฬา
          </h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="w-32 h-40 rounded-2xl border-4 border-blue-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                {formData.imageBlob ? (
                  <img src={formData.imageBlob} className="w-full h-full object-cover" />
                ) : formData.imageUrl ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-300">ไม่มีรูป</span>
                )}
              </div>
              <label className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">ชื่อ-นามสกุล</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>
            
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">วันเดือนปีเกิด</label>
              <input type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">ระดับชั้น</label>
              <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full p-3 rounded-xl border outline-none">
                {Object.values(Level).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">กีฬา</label>
              <select value={formData.sportType} onChange={(e) => setFormData({ ...formData, sportType: e.target.value })} className="w-full p-3 rounded-xl border outline-none">
                {availableSports.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">รุ่นอายุ</label>
              <select value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full p-3 rounded-xl border outline-none">
                {selectedSport?.ages.map(a => <option key={a} value={a}>{a} ปี</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">เพศ</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full p-3 rounded-xl border outline-none">
                {selectedSport?.genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">ครูผู้ควบคุม</label>
              <input type="text" value={formData.coach} onChange={(e) => setFormData({ ...formData, coach: e.target.value })} className="w-full p-3 rounded-xl border outline-none" />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
              ยกเลิก
            </button>
            <button type="submit" disabled={loading} className="flex-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
              ) : 'บันทึกการแก้ไข ✨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;