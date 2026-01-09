
export enum Level {
  EARLY = 'ปฐมวัย',
  PRIMARY = 'ประถม',
  ATHLETICS_NO_AGE = 'กรีฑา (ทั่วไป)',
  ATHLETICS_AGE = 'กรีฑา (ระบุอายุ)'
}

export interface SportOption {
  name: string;
  subCategories: string[];
  ages: string[];
  genders: string[];
}

export interface Athlete {
  id: string;
  timestamp: string;
  level: string;
  sportType: string;
  subCategory: string;
  age: string;
  birthDate: string; // Added field
  gender: string;
  name: string;
  school: string;
  coach: string;
  imageUrl: string;
  note: string;
}

export interface AppState {
  athletes: Athlete[];
  loading: boolean;
  activeTab: 'register' | 'list' | 'print';
}
