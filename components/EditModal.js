
import React, { useState } from 'react';

const EditModal = ({ athlete, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({ ...athlete });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(athlete.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md border-4 border-yellow-400">
        <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูล</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="ชื่อ-นามสกุล" />
          <input type="text" value={formData.coach} onChange={(e) => setFormData({ ...formData, coach: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="ครูผู้ควบคุม" />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-xl">ยกเลิก</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-green-500 text-white rounded-xl font-bold">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
