
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby8X548o8oa4rxHJNBa4yuVDakvlg4gMT0JQ_IhG8v5ByX0ZWfgcQk3gtfZBPpWAHn7aQ/exec";

async function fetchFromAppsScript(action, extraParams = {}) {
  try {
    const payload = JSON.stringify({ action, ...extraParams });
    const response = await fetch(`${SCRIPT_URL}`, {
      method: "POST",
      mode: "cors", 
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(`Fetch to GAS failed:`, err);
    return null;
  }
}

export const storageService = {
  saveBulkAthletes: async (athletes) => {
    const res = await fetchFromAppsScript('save', { data: athletes });
    return res || { success: false, error: "Connection Error" };
  },
  updateAthlete: async (id, data) => {
    const res = await fetchFromAppsScript('update', { id, data });
    return res || { success: false, error: "Connection Error" };
  },
  getAllAthletes: async () => {
    const data = await fetchFromAppsScript('get');
    return Array.isArray(data) ? data : [];
  },
  deleteAthlete: async (id) => {
    const res = await fetchFromAppsScript('delete', { id });
    return res ? res.success : false;
  }
};
