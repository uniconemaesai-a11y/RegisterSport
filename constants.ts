
import { Level, SportOption } from './types';

export const SPORTS_CONFIG: Record<Level, SportOption[]> = {
  [Level.EARLY]: [
    { name: 'จักรยานขาไถ', subCategories: ['ทั่วไป'], ages: ['5', '7'], genders: ['ชาย', 'หญิง'] },
    { name: 'โยนบอล', subCategories: ['ทั่วไป'], ages: ['6'], genders: ['ชาย', 'หญิง'] },
    { name: 'ฟุตบอล 7 คน', subCategories: ['ทั่วไป'], ages: ['6'], genders: ['ผสม'] },
    { name: 'เดินตัวหนอน', subCategories: ['ทั่วไป'], ages: ['6'], genders: ['ผสม'] },
    { name: 'ขว้างบอลไกล', subCategories: ['ทั่วไป'], ages: ['6'], genders: ['ชาย', 'หญิง'] },
    { name: 'วิ่งเปรี้ยว', subCategories: ['ทั่วไป'], ages: ['6'], genders: ['ชาย 3 - หญิง 3'] },
  ],
  [Level.PRIMARY]: [
    { name: 'ฟุตบอล 7 คน', subCategories: ['ทั่วไป'], ages: ['10', '12'], genders: ['ชาย'] },
    { name: 'แชร์บอล', subCategories: ['ทั่วไป'], ages: ['10'], genders: ['หญิง'] },
    { name: 'แฮนด์บอล', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['หญิง'] },
    { name: 'วอลเลย์บอล', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['ชาย', 'หญิง'] },
    { name: 'ตะกร้อ', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['ชาย', 'หญิง'] },
    { name: 'ฟุตซอล', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['ชาย'] },
    { name: 'เปตอง ทีม', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['ชาย', 'หญิง'] },
    { name: 'เทเบิลเทนนิส', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['ชาย', 'หญิง'] },
    { name: 'หมากรุก', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['ชาย', 'หญิง'] },
    { name: 'หมากฮอส', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['ชาย', 'หญิง'] },
    { name: 'ชักเยอ', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['ชาย', 'หญิง'] },
  ],
  [Level.ATHLETICS_NO_AGE]: [
    { name: 'วิ่ง 30 ม.', subCategories: ['ทั่วไป'], ages: ['ไม่ระบุ'], genders: ['ชาย', 'หญิง'] },
    { name: 'วิ่ง 40 ม.', subCategories: ['ทั่วไป'], ages: ['ไม่ระบุ'], genders: ['ชาย', 'หญิง'] },
    { name: 'วิ่ง 50 ม.', subCategories: ['ทั่วไป'], ages: ['ไม่ระบุ'], genders: ['ชาย', 'หญิง'] },
    { name: 'วิ่งผลัด 4×25 ม.', subCategories: ['ทั่วไป'], ages: ['ไม่ระบุ'], genders: ['ชาย', 'หญิง'] },
  ],
  [Level.ATHLETICS_AGE]: [
    { name: 'วิ่ง 60 ม.', subCategories: ['ทั่วไป'], ages: ['8'], genders: ['ชาย', 'หญิง'] },
    { name: 'วิ่ง 80 ม.', subCategories: ['ทั่วไป'], ages: ['10', '12'], genders: ['ชาย', 'หญิง'] },
    { name: 'วิ่ง 100 ม.', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['ชาย', 'หญิง'] },
    { name: 'วิ่งผลัด 8×50 ม.', subCategories: ['ทั่วไป'], ages: ['8'], genders: ['ชาย', 'หญิง'] },
    { name: 'วิ่งผลัด 4×100 ม.', subCategories: ['ทั่วไป'], ages: ['12'], genders: ['ชาย', 'หญิง'] },
  ]
};
