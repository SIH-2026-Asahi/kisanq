import type { Mandi, Pool, Slot, Token } from "./types";

export const MANDIS: Mandi[] = [
  {
    id: "m1",
    name: { en: "Khanna Grain Market", hi: "खन्ना अनाज मंडी", mr: "खन्ना धान्य बाजार", ta: "கன்னா தானிய சந்தை", te: "ఖన్నా ధాన్య మార్కెట్", gu: "ખન્ના અનાજ બજાર", pa: "ਖੰਨਾ ਅਨਾਜ ਮੰਡੀ" },
    district: { en: "Ludhiana", hi: "लुधियाना", mr: "लुधियाना", ta: "லூதியானா", te: "లూధియానా", gu: "લુધિયાણા", pa: "ਲੁਧਿਆਣਾ" },
    distanceKm: 4.2,
    dailyCapacity: 320,
    state: "Punjab",
    city: "Khanna",
  },
  {
    id: "m2",
    name: { en: "Rajpura Procurement Centre", hi: "राजपुरा खरीद केंद्र", mr: "राजपुरा खरेदी केंद्र", ta: "ராஜ்புரா கொள்முதல் மையம்", te: "రాజ్‌పురా కొనుగోలు కేంద్రం", gu: "રાજપુરા ખરીદી કેન્દ્ર", pa: "ਰਾਜਪੁਰਾ ਖਰੀਦ ਕੇਂਦਰ" },
    district: { en: "Patiala", hi: "पटियाला", mr: "पटियाला", ta: "பாட்டியாலா", te: "పాటియాలా", gu: "પટિયાલા", pa: "ਪਟਿਆਲਾ" },
    distanceKm: 11.8,
    dailyCapacity: 210,
    state: "Punjab",
    city: "Rajpura",
  },
  {
    id: "m3",
    name: { en: "Moga Sabzi Mandi", hi: "मोगा सब्ज़ी मंडी", mr: "मोगा भाजी बाजार", ta: "மோகா காய்கறி சந்தை", te: "మోగా కూరగాయల మార్కెట్", gu: "મોગા શાકભાજી મંડી", pa: "ਮੋਗਾ ਸਬਜ਼ੀ ਮੰਡੀ" },
    district: { en: "Moga", hi: "मोगा", mr: "मोगा", ta: "மோகா", te: "మోగా", gu: "મોગા", pa: "ਮੋਗਾ" },
    distanceKm: 18.5,
    dailyCapacity: 160,
    state: "Punjab",
    city: "Moga",
  },
  {
    id: "m4",
    name: { en: "Karnal Anaj Mandi", hi: "करनाल अनाज मंडी", mr: "करनाल धान्य बाजार", ta: "கர்னால் தானிய சந்தை", te: "కర్నాల్ ధాన్య మార్కెట్", gu: "કરનાલ અનાજ બજાર", pa: "ਕਰਨਾਲ ਅਨਾਜ ਮੰਡੀ" },
    district: { en: "Karnal", hi: "करनाल", mr: "करनाल", ta: "கர்னால்", te: "కర్నాల్", gu: "કરનાલ", pa: "ਕਰਨਾਲ" },
    distanceKm: 26.0,
    dailyCapacity: 400,
    state: "Haryana",
    city: "Karnal",
  },
];


/**
 * India-wide location coverage for the farmer booking search.
 * Every state/UT is represented with its capital and major cities.
 */
export const INDIA_STATES_AND_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Amaravati", "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", "Kurnool", "Rajahmundry", "Kadapa"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Tawang", "Pasighat", "Bomdila"],
  "Assam": ["Dispur", "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur", "Nagaon"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Ara", "Begusarai"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Durg", "Bilaspur", "Korba", "Jagdalpur", "Ambikapur"],
  "Goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa", "Ponda"],
  "Gujarat": ["Gandhinagar", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Bharuch", "Mehsana"],
  "Haryana": ["Chandigarh", "Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Rohtak", "Karnal", "Sonipat", "Sirsa", "Kurukshetra", "Rajpura"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu", "Manali", "Bilaspur", "Hamirpur", "Una"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Dharwad", "Belagavi", "Kalaburagi", "Shivamogga", "Tumakuru", "Ballari", "Udupi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha", "Palakkad", "Kottayam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna", "Ratlam", "Dewas"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Kolhapur", "Solapur", "Amravati", "Nanded", "Sangli", "Satara", "Jalgaon", "Ahmednagar"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Kolasib"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Balasore", "Puri", "Baripada"],
  "Punjab": ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Moga", "Khanna", "Rajpura", "Pathankot", "Sangrur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sikar", "Sri Ganganagar"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Thanjavur", "Dindigul", "Hosur"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Nalgonda", "Adilabad", "Suryapet"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Meerut", "Ghaziabad", "Noida", "Bareilly", "Aligarh", "Moradabad", "Gorakhpur", "Jhansi", "Mathura", "Ayodhya"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Rishikesh", "Roorkee", "Nainital", "Almora", "Kashipur"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Malda", "Kharagpur", "Bardhaman"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa", "Diu"],
  "Delhi": ["New Delhi", "Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Udhampur"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
};

const EXTRA_INDIA_MANDIS: Mandi[] = Object.entries(INDIA_STATES_AND_CITIES)
  .flatMap(([state, cities], stateIndex) =>
    cities.map((city, cityIndex) => ({
      id: `india-${stateIndex}-${cityIndex}`,
      name: {
        en: `${city} Mandi`,
        hi: `${city} मंडी`,
        mr: `${city} मंडी`,
        ta: `${city} மண்டி`,
        te: `${city} మండి`,
        gu: `${city} મંડી`,
        pa: `${city} ਮੰਡੀ`,
      },
      district: {
        en: state, hi: state, mr: state, ta: state, te: state, gu: state, pa: state,
      },
      distanceKm: 5 + ((stateIndex * 7 + cityIndex * 3) % 30),
      dailyCapacity: 180 + ((stateIndex * 31 + cityIndex * 17) % 260),
      state,
      city,
    })),
  );

export const ALL_INDIA_MANDIS: Mandi[] = [...MANDIS, ...EXTRA_INDIA_MANDIS];
export const CROPS = [
  { id: "wheat", en: "Wheat", hi: "गेहूँ", mr: "Wheat", ta: "Wheat", te: "Wheat", gu: "Wheat", pa: "ਕਣਕ", emoji: "🌾" },
  { id: "paddy", en: "Paddy", hi: "धान", mr: "Paddy", ta: "Paddy", te: "Paddy", gu: "Paddy", pa: "ਝੋਨਾ", emoji: "🍚" },
  { id: "maize", en: "Maize", hi: "मक्का", mr: "Maize", ta: "Maize", te: "Maize", gu: "Maize", pa: "ਮੱਕੀ", emoji: "🌽" },
  { id: "mustard", en: "Mustard", hi: "सरसों", mr: "Mustard", ta: "Mustard", te: "Mustard", gu: "Mustard", pa: "ਸਰ੍ਹੋਂ", emoji: "🌻" },
  { id: "cotton", en: "Cotton", hi: "कपास", mr: "Cotton", ta: "Cotton", te: "Cotton", gu: "Cotton", pa: "ਕਪਾਹ", emoji: "☁️" },
  { id: "potato", en: "Potato", hi: "आलू", mr: "Potato", ta: "Potato", te: "Potato", gu: "Potato", pa: "ਆਲੂ", emoji: "🥔" },
];

export const TIMES = [
  "07:00 - 08:30",
  "08:30 - 10:00",
  "10:00 - 11:30",
  "11:30 - 13:00",
  "14:00 - 15:30",
  "15:30 - 17:00",
];

export function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

// Deterministic pseudo-random so demo data is stable across reloads.
function seeded(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export function buildSlots(mandiId: string): Slot[] {
  const out: Slot[] = [];
  for (let d = 0; d < 5; d++) {
    const date = isoDate(d);
    for (const time of TIMES) {
      const capacity = 20 + Math.round(seeded(mandiId + date + time) * 20);
      const booked = Math.round(seeded(time + date + mandiId) * capacity);
      out.push({ id: `${mandiId}|${date}|${time}`, date, time, booked, capacity });
    }
  }
  return out;
}

export function makeCode(): string {
  const n = Math.floor(1000 + Math.random() * 8999);
  return `KQ-${n}`;
}

const DEMO_NAMES = [
  "Gurpreet Singh",
  "Ramesh Yadav",
  "Sukhwinder Kaur",
  "Mahesh Patil",
  "Balbir Singh",
  "Anita Devi",
];

export function demoTokens(): Token[] {
  const today = isoDate(0);
  const statuses = ["scheduled", "scheduled", "weighed", "approved", "paid", "scheduled"] as const;
  return DEMO_NAMES.map((farmerName, i) => {
    const base: Token = {
      id: `demo-${i}`,
      code: `KQ-${2100 + i * 37}`,
      farmerName,
      phone: `9${800000000 + i * 111111}`,
      mandiId: "m1",
      date: today,
      time: TIMES[i % TIMES.length]!,
      crop: CROPS[i % CROPS.length]!.id,
      quintals: 12 + i * 7,
      status: statuses[i] ?? "scheduled",
      createdAt: Date.now() - (i + 1) * 900000,
      channel: i === 5 ? "whatsapp" : "app",
    };
    return i < 4 ? { ...base, checkedInAt: Date.now() - (i + 1) * 600000 } : base;
  });
}

export const PICKUP_AREAS = ["Village Chowk", "Bus Stand", "Canal Road", "Petrol Pump"];

export function demoPools(): Pool[] {
  const today = isoDate(0);
  const tomorrow = isoDate(1);
  return [
    {
      id: "pool-1",
      mandiId: "m1",
      date: today,
      ownerName: "Balbir Singh",
      pickupArea: "Village Chowk, Samrala",
      pickupTime: "06:30",
      seats: 4,
      tripCost: 1600,
      members: [
        { name: "Balbir Singh", phone: "9800000004", crop: "wheat", quintals: 30 },
        { name: "Anita Devi", phone: "9800000005", crop: "paddy", quintals: 18 },
      ],
    },
    {
      id: "pool-2",
      mandiId: "m1",
      date: today,
      ownerName: "Gurpreet Singh",
      pickupArea: "Canal Road, Khanna",
      pickupTime: "08:00",
      seats: 3,
      tripCost: 1200,
      members: [{ name: "Gurpreet Singh", phone: "9800000000", crop: "maize", quintals: 22 }],
    },
    {
      id: "pool-3",
      mandiId: "m2",
      date: tomorrow,
      ownerName: "Ramesh Yadav",
      pickupArea: "Bus Stand, Rajpura",
      pickupTime: "07:15",
      seats: 5,
      tripCost: 2000,
      members: [
        { name: "Ramesh Yadav", phone: "9800000001", crop: "mustard", quintals: 26 },
        { name: "Mahesh Patil", phone: "9800000003", crop: "cotton", quintals: 14 },
        { name: "Sukhwinder Kaur", phone: "9800000002", crop: "potato", quintals: 20 },
      ],
    },
  ];
}
