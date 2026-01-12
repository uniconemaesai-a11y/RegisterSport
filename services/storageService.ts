import { Athlete } from '../types.ts';

declare const google: any;

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby8X548o8oa4rxHJNBa4yuVDakvlg4gMT0JQ_IhG8v5ByX0ZWfgcQk3gtfZBPpWAHn7aQ/exec";

async function fetchFromAppsScript(action: string, extraParams: any = {}): Promise<any> {
  try {
    const payload = JSON.stringify({ action, ...extraParams });
    const response = await fetch(`${SCRIPT_URL}`, {
      method: "POST",
      mode: "cors", 
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: payload
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error(`Fetch to GAS failed for action ${action}:`, err);
    return null;
  }
}

export const storageService = {
  saveBulkAthletes: async (athletes: any[]): Promise<{ success: boolean; count?: number; error?: string }> => {
    return new Promise(async (resolve) => {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler((res: any) => resolve(res))
          .withFailureHandler((err: any) => resolve({ success: false, error: err.toString() }))
          .saveBulkAthleteData(athletes);
        return;
      }

      const res = await fetchFromAppsScript('save', { data: athletes });
      if (res) {
        resolve(res);
      } else {
        resolve({ 
          success: false, 
          error: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (CORS Error) กรุณาตรวจสอบว่า Publish Web App เป็น 'Anyone' แล้ว" 
        });
      }
    });
  },

  updateAthlete: async (id: string, data: any): Promise<{ success: boolean; error?: string }> => {
    return new Promise(async (resolve) => {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler((res: any) => resolve(res))
          .withFailureHandler((err: any) => resolve({ success: false, error: err.toString() }))
          .updateAthleteData(id, data);
        return;
      }

      const res = await fetchFromAppsScript('update', { id, data });
      if (res) resolve(res);
      else resolve({ success: false, error: "ไม่สามารถส่งข้อมูลแก้ไขได้" });
    });
  },

  getAllAthletes: async (): Promise<Athlete[]> => {
    return new Promise(async (resolve) => {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler((data: Athlete[]) => resolve(data))
          .withFailureHandler(() => resolve([]))
          .getAthletes();
        return;
      }

      const data = await fetchFromAppsScript('get');
      if (data && Array.isArray(data)) {
        resolve(data);
      } else {
        resolve([]);
      }
    });
  },

  deleteAthlete: async (id: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler((res: boolean) => resolve(res))
          .withFailureHandler(() => resolve(false))
          .deleteAthleteRow(id);
        return;
      }

      const res = await fetchFromAppsScript('delete', { id });
      if (res) resolve(res.success);
      else resolve(false);
    });
  }
};