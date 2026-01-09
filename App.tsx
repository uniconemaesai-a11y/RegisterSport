
import React, { useState, useEffect, useMemo } from 'react';
import { Athlete, Level } from './types';
import { storageService } from './services/storageService';
import RegistrationForm from './components/RegistrationForm';
import AthleteTable from './components/AthleteTable';
import PrintView from './components/PrintView';
import EditModal from './components/EditModal';

const App: React.FC = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'register' | 'list'>('register');
  const [isPrintPreview, setIsPrintPreview] = useState(false);
  const [printData, setPrintData] = useState<Athlete[] | null>(null);
  const [showSignature, setShowSignature] = useState(true);
  const logoUrl = "https://img2.pic.in.th/pic/Gemini_Generated_Image_u2dku8u2dku8u2dk.png";
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setInitialLoading(true);
    const data = await storageService.getAllAthletes();
    setAthletes(data);
    setInitialLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const printCategories = useMemo(() => {
    const groups: Record<string, Athlete[]> = {};
    athletes.forEach(a => {
      const key = `${a.sportType}|${a.age}|${a.gender}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });
    return Object.entries(groups).map(([key, list]) => {
      const [sport, age, gender] = key.split('|');
      return { key, sport, age, gender, count: list.length, list };
    }).sort((a, b) => a.key.localeCompare(b.key, 'th'));
  }, [athletes]);

  const handleRegisterBulk = async (payload: any[]) => {
    setLoading(true);
    const result = await storageService.saveBulkAthletes(payload);
    if (result.success) {
      showToast(`บันทึกข้อมูลนักกีฬา ${result.count} คน เรียบร้อยแล้ว! 🏆`, 'success');
      await loadData();
      setActiveTab('list');
    } else {
      showToast('เกิดข้อผิดพลาด: ' + (result.error || 'ไม่ทราบสาเหตุ'), 'error');
    }
    setLoading(false);
  };

  const handleUpdateAthlete = async (id: string, updatedData: any) => {
    setLoading(true);
    const result = await storageService.updateAthlete(id, updatedData);
    if (result.success) {
      showToast('อัปเดตข้อมูลนักกีฬาเรียบร้อยแล้ว! ✨', 'success');
      setEditingAthlete(null);
      await loadData();
    } else {
      showToast('เกิดข้อผิดพลาดในการอัปเดต: ' + (result.error || 'ไม่ทราบสาเหตุ'), 'error');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      message: 'คุณแน่ใจหรือไม่ที่จะลบข้อมูลนักกีฬานี้ออกจากฐานข้อมูล?',
      onConfirm: async () => {
        setConfirmDialog(null);
        setLoading(true);
        const success = await storageService.deleteAthlete(id);
        if (success) {
          setAthletes(prev => prev.filter(a => a.id !== id));
          showToast('ลบข้อมูลเรียบร้อยแล้ว', 'info');
        } else {
          showToast('ไม่สามารถลบข้อมูลได้', 'error');
        }
        setLoading(false);
      }
    });
  };

  const openPrintView = (data: Athlete[] | Athlete) => {
    const dataArray = Array.isArray(data) ? data : [data];
    setPrintData(dataArray);
    setIsPrintPreview(true);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  const closePrintPreview = () => {
    setIsPrintPreview(false);
    setPrintData(null);
  };

  const handleNativePrint = () => {
    window.print();
  };

  if (isPrintPreview && printData) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="no-print sticky top-0 bg-white border-b-4 border-blue-600 p-4 flex flex-col md:flex-row justify-between items-center shadow-xl z-[200] gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={closePrintPreview}
              className="bg-gray-800 hover:bg-black text-white px-5 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg"
            >
              ← กลับไปหน้าหลัก
            </button>
            <div className="flex flex-col">
              <span className="text-blue-700 font-black text-lg">โหมดเตรียมพิมพ์ (Print Mode)</span>
              <span className="text-gray-500 text-xs italic">ตรวจสอบข้อมูลและรูปถ่ายให้เรียบร้อยก่อนกดสั่งพิมพ์</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={showSignature} 
                  onChange={(e) => setShowSignature(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <span className="text-sm font-bold text-gray-700">แสดงส่วนลงชื่อ</span>
            </label>

            <button 
              onClick={handleNativePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-2xl font-black shadow-xl transform active:scale-95 transition-all flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              สั่งพิมพ์แผงรูป (A4)
            </button>
          </div>
        </div>

        <div className="flex justify-center p-0 md:p-8">
          <div className="bg-white shadow-2xl overflow-hidden printable-area ring-8 ring-black/5">
            <PrintView data={printData} showSignature={showSignature} />
          </div>
        </div>
        
        <style>{`
          @media screen { 
            .printable-area { width: 210mm; min-height: 297mm; } 
          }
          @media print {
            .no-print { display: none !important; }
            body, html { background-color: white !important; margin: 0 !important; padding: 0 !important; }
            .printable-area { box-shadow: none !important; ring: 0 !important; margin: 0 !important; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all animate-bounce ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
        }`}>
          <span className="font-bold">{toast.message}</span>
        </div>
      )}

      {confirmDialog && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center border-4 border-red-100">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันการลบ?</h3>
            <p className="text-gray-500 mb-6">{confirmDialog.message}</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDialog(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">ยกเลิก</button>
              <button onClick={confirmDialog.onConfirm} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg transition-all">ยืนยันลบ</button>
            </div>
          </div>
        </div>
      )}

      {editingAthlete && (
        <EditModal 
          athlete={editingAthlete} 
          onClose={() => setEditingAthlete(null)} 
          onSave={handleUpdateAthlete}
          loading={loading}
        />
      )}

      <header className="no-print bg-gradient-to-r from-blue-700 via-blue-500 to-green-500 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full shadow-lg transform rotate-6 hover:rotate-0 transition-transform cursor-pointer w-16 h-16 flex items-center justify-center overflow-hidden">
               <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">ระบบบันทึกข้อมูลนักกีฬา</h1>
              <p className="text-blue-50 opacity-90 font-medium">แม่จันเกมส์ | ระบบแผงรูปนักกีฬามาตรฐาน</p>
            </div>
          </div>
          <div className="flex bg-white/10 p-1 rounded-2xl">
            <button onClick={() => setActiveTab('register')} className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'register' ? 'bg-white text-blue-700 shadow-lg scale-105' : 'hover:bg-white/10'}`}>ลงทะเบียนกลุ่ม</button>
            <button onClick={() => setActiveTab('list')} className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'list' ? 'bg-white text-blue-700 shadow-lg scale-105' : 'hover:bg-white/10'}`}>รายชื่อ / เมนูพิมพ์แผงรูป</button>
          </div>
        </div>
      </header>

      <main className="no-print max-w-6xl mx-auto px-4 mt-8">
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-blue-600">
            <div className="animate-spin mb-6 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="text-xl font-bold animate-pulse">กำลังโหลดข้อมูลนักกีฬา...</p>
          </div>
        ) : activeTab === 'register' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"><RegistrationForm onSuccess={handleRegisterBulk} loading={loading} /></div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border-4 border-blue-100 shadow-md">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><span className="text-2xl">💡</span> คำแนะนำ</h3>
                <p className="text-sm text-gray-600 mb-2">เมื่อลงทะเบียนเสร็จแล้ว สามารถไปที่เมนู <b>"รายชื่อ / พิมพ์แผงรูป"</b> เพื่อตรวจสอบและสั่งพิมพ์แยกตามประเภทกีฬาได้ทันที</p>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs text-blue-700">
                  ระบบจะแยกหน้าพิมพ์ให้อัตโนมัติตาม: <b>กีฬา > รุ่นอายุ > เพศ</b>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                 <div className="relative z-10">
                   <h3 className="text-lg font-bold opacity-80">สถิตินักกีฬา</h3>
                   <div className="text-5xl font-black my-2">{athletes.length}</div>
                   <p className="text-green-100 text-sm">คน ในฐานข้อมูล</p>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-green-200">
              <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                เมนูพิมพ์แผงรูป (แยกตามประเภท)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {printCategories.map(cat => (
                  <div key={cat.key} className="bg-green-50 p-4 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {cat.gender}
                        </span>
                        <span className="text-green-600 font-black text-lg">{cat.count} คน</span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-md truncate" title={cat.sport}>{cat.sport}</h3>
                      <p className="text-xs text-gray-500 font-medium">รุ่น {cat.age} ปี</p>
                    </div>
                    <button 
                      onClick={() => openPrintView(cat.list)}
                      className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all group-hover:scale-[1.02]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                      พิมพ์แผงรูป
                    </button>
                  </div>
                ))}
                {printCategories.length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-2xl">
                    ยังไม่มีข้อมูลนักกีฬาที่จะสร้างเมนูพิมพ์ได้
                  </div>
                )}
              </div>
            </div>

            <AthleteTable 
              athletes={athletes} 
              onDelete={handleDelete} 
              onEdit={setEditingAthlete}
              onPrint={openPrintView}
              onPrintAll={openPrintView}
            />
          </div>
        )}
      </main>

      <footer className="no-print mt-20 p-8 text-center text-gray-400 border-t border-gray-100">
        <p className="font-bold">ระบบรายงานผลและแผงรูปนักกีฬา "แม่จันเกมส์"</p>
        <p className="text-xs mt-1">พัฒนาระบบโดย Krukai@CopyRight 2026</p>
      </footer>
    </div>
  );
};

export default App;
