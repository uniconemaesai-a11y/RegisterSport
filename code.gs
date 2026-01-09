
const SPREADSHEET_ID = "1DTdZs6Mxcs1I3hBWWpVuUsTWkVJy-JRnWuhcqLTfH5A";
const FOLDER_ID = "1uTxKgk4Y8mVj9EAbHDYPeO5KjzPI3LhA";
const SHEET_NAME = "AthleteData";

function doGet() {
  const template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('ระบบบันทึกข้อมูลนักกีฬา - แม่จันเกมส์')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setFaviconUrl('https://www.google.com/images/icons/material/system_gm/1x/sports_kabaddi_black_24dp.png');
}

function doPost(e) {
  let result;
  try {
    // GAS parses both application/json and text/plain if the content is valid JSON
    const params = JSON.parse(e.postData.contents);
    const action = params.action;

    if (action === 'save') {
      result = saveBulkAthleteData(params.data);
    } else if (action === 'get') {
      result = getAthletes();
    } else if (action === 'delete') {
      result = { success: deleteAthleteRow(params.id) };
    } else if (action === 'update') {
      result = updateAthleteData(params.id, params.data);
    } else {
      result = { success: false, error: 'Invalid action: ' + action };
    }
  } catch (err) {
    result = { success: false, error: "Server Error: " + err.toString() };
  }

  // Use ContentService to return JSON. This correctly handles the 302 redirect for CORS.
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        "Timestamp", "ระดับการแข่งขัน", "ประเภทกีฬา", "รายการย่อย", 
        "อายุ (ปี)", "วันเดือนปีเกิด", "เพศ", "ชื่อนักกีฬา", 
        "โรงเรียน / ทีม", "ครูผู้ควบคุม", "รูปนักกีฬา (URL)", "หมายเหตุ"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
      sheet.setFrozenRows(1);
    }
    return sheet;
  } catch (e) {
    throw new Error("ไม่สามารถเข้าถึง Spreadsheet ได้: " + e.message);
  }
}

function uploadImage(base64Data, fileName) {
  if (!base64Data || !base64Data.includes(',')) return "";
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const splitData = base64Data.split(',');
    const contentType = splitData[0].split(':')[1].split(';')[0];
    const bytes = Utilities.base64Decode(splitData[1]);
    const blob = Utilities.newBlob(bytes, contentType, fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w1000`;
  } catch (e) {
    return "";
  }
}

function saveBulkAthleteData(athletes) {
  try {
    const sheet = getOrCreateSheet();
    const timestamp = new Date();
    const rows = athletes.map(data => {
      let finalImageUrl = "";
      const imageSource = data.imageBlob || data.imageUrl;
      if (imageSource && imageSource.startsWith('data:')) {
        const timestampLabel = Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmm-ss");
        const fileName = `${data.sportType}_${data.name}_${data.age}_${data.gender}_${timestampLabel}.jpg`;
        finalImageUrl = uploadImage(imageSource, fileName);
      } else {
        finalImageUrl = data.imageUrl || "";
      }
      return [
        timestamp, 
        data.level, 
        data.sportType, 
        data.subCategory, 
        data.age, 
        data.birthDate,
        data.gender, 
        data.name, 
        data.school, 
        data.coach, 
        finalImageUrl, 
        data.note
      ];
    });
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    return { success: true, count: rows.length };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function updateAthleteData(id, data) {
  try {
    const sheet = getOrCreateSheet();
    const rowIndex = parseInt(id.replace("row-", ""));
    if (isNaN(rowIndex)) return { success: false, error: "ID รูปแบบไม่ถูกต้อง" };
    
    let finalImageUrl = data.imageUrl;
    if (data.imageBlob && data.imageBlob.startsWith('data:')) {
      const timestampLabel = Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmm-ss");
      const fileName = `${data.sportType}_${data.name}_${data.age}_${data.gender}_${timestampLabel}.jpg`;
      finalImageUrl = uploadImage(data.imageBlob, fileName);
    }

    const rowData = [
      new Date(),
      data.level,
      data.sportType,
      data.subCategory || "ทั่วไป",
      data.age,
      data.birthDate,
      data.gender,
      data.name,
      data.school,
      data.coach,
      finalImageUrl,
      data.note || ""
    ];
    
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function getAthletes() {
  try {
    const sheet = getOrCreateSheet();
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return [];
    const rows = values.slice(1);
    const mapped = rows.map((row, index) => {
      let imageUrl = row[10] || "";
      if (imageUrl.includes("drive.google.com") && !imageUrl.includes("thumbnail")) {
        let fileId = "";
        if (imageUrl.includes("id=")) fileId = imageUrl.split("id=")[1].split("&")[0];
        else if (imageUrl.includes("/d/")) fileId = imageUrl.split("/d/")[1].split("/")[0];
        if (fileId) imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      }
      return {
        id: "row-" + (index + 2),
        timestamp: row[0] ? (row[0] instanceof Date ? row[0].toISOString() : row[0]) : "",
        level: row[1],
        sportType: row[2],
        subCategory: row[3],
        age: row[4] ? row[4].toString() : "",
        birthDate: row[5] ? (row[5] instanceof Date ? Utilities.formatDate(row[5], "GMT+7", "yyyy-MM-dd") : row[5]) : "",
        gender: row[6],
        name: row[7],
        school: row[8],
        coach: row[9],
        imageUrl: imageUrl,
        note: row[11]
      };
    });
    return mapped.reverse();
  } catch (e) {
    return [];
  }
}

function deleteAthleteRow(id) {
  try {
    const sheet = getOrCreateSheet();
    const rowIndex = parseInt(id.replace("row-", ""));
    if (isNaN(rowIndex)) return false;
    sheet.deleteRow(rowIndex);
    return true;
  } catch (e) {
    return false;
  }
}
