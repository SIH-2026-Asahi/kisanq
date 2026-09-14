import type { Lang } from "./types";

type Dict = Record<string, Partial<Record<Lang, string>>>;

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिन्दी", short: "हि" },
  { code: "mr", label: "मराठी", short: "मरा" },
  { code: "ta", label: "தமிழ்", short: "தமி" },
  { code: "te", label: "తెలుగు", short: "తె" },
  { code: "gu", label: "ગુજરાતી", short: "ગુ" },
  { code: "pa", label: "ਪੰਜਾਬੀ", short: "ਪੰ" },
];

export const dict: Dict = {
  appName: { en: "KisanQ", hi: "किसानQ", pa: "ਕਿਸਾਨQ" },
  tagline: {
    en: "Book your mandi slot. Skip the queue.",
    hi: "मंडी स्लॉट बुक करें। कतार से बचें।",
    pa: "ਮੰਡੀ ਸਲਾਟ ਬੁੱਕ ਕਰੋ। ਕਤਾਰ ਤੋਂ ਬਚੋ।",
  },
  farmer: { en: "Farmer", hi: "किसान", pa: "ਕਿਸਾਨ" },
  admin: { en: "Center Admin", hi: "केंद्र प्रबंधक", pa: "ਕੇਂਦਰ ਪ੍ਰਬੰਧਕ" },
  login: { en: "Login with phone", hi: "फ़ोन से लॉगिन", pa: "ਫ਼ੋਨ ਨਾਲ ਲਾਗਇਨ" },
  phone: { en: "Mobile number", hi: "मोबाइल नंबर", pa: "ਮੋਬਾਈਲ ਨੰਬਰ" },
  sendOtp: { en: "Send OTP", hi: "OTP भेजें", pa: "OTP ਭੇਜੋ" },
  enterOtp: { en: "Enter 4-digit OTP", hi: "4 अंकों का OTP डालें", pa: "4 ਅੰਕਾਂ ਦਾ OTP ਭਰੋ" },
  demoOtp: { en: "Demo OTP auto-filled", hi: "डेमो OTP स्वतः भरा", pa: "ਡੈਮੋ OTP ਆਪਣੇ-ਆਪ ਭਰਿਆ" },
  verify: { en: "Verify & continue", hi: "सत्यापित करें", pa: "ਪੁਸ਼ਟੀ ਕਰੋ" },
  yourName: { en: "Your name", hi: "आपका नाम", pa: "ਤੁਹਾਡਾ ਨਾਮ" },
  step: { en: "Step", hi: "चरण", pa: "ਪੜਾਅ" },
  chooseMandi: { en: "Choose a nearby Mandi", hi: "नज़दीकी मंडी चुनें", pa: "ਨੇੜਲੀ ਮੰਡੀ ਚੁਣੋ" },
  searchMandi: { en: "Search mandi or district", hi: "मंडी या ज़िला खोजें", pa: "ਮੰਡੀ ਜਾਂ ਜ਼ਿਲ੍ਹਾ ਲੱਭੋ" },
  chooseSlot: { en: "Pick date & time", hi: "तारीख़ व समय चुनें", pa: "ਤਾਰੀਖ਼ ਤੇ ਸਮਾਂ ਚੁਣੋ" },
  cropDetails: { en: "Crop details", hi: "फ़सल विवरण", pa: "ਫ਼ਸਲ ਵੇਰਵਾ" },
  cropType: { en: "Crop type", hi: "फ़सल", pa: "ਫ਼ਸਲ" },
  quintals: { en: "Estimated quintals", hi: "अनुमानित क्विंटल", pa: "ਅੰਦਾਜ਼ਨ ਕੁਇੰਟਲ" },
  confirmBooking: { en: "Confirm booking", hi: "बुकिंग पक्की करें", pa: "ਬੁਕਿੰਗ ਪੱਕੀ ਕਰੋ" },
  yourToken: { en: "Your digital token", hi: "आपका डिजिटल टोकन", pa: "ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਟੋਕਨ" },
  showQr: { en: "Show this QR at the gate", hi: "गेट पर यह QR दिखाएँ", pa: "ਗੇਟ ਤੇ ਇਹ QR ਦਿਖਾਓ" },
  scheduled: { en: "Scheduled", hi: "निर्धारित", pa: "ਤੈਅ" },
  weighed: { en: "Weighed", hi: "तौल हुआ", pa: "ਤੋਲਿਆ" },
  approved: { en: "Approved", hi: "स्वीकृत", pa: "ਮਨਜ਼ੂਰ" },
  paid: { en: "Paid", hi: "भुगतान", pa: "ਭੁਗਤਾਨ" },
  high: { en: "Plenty of space", hi: "ज़्यादा जगह", pa: "ਬਹੁਤ ਥਾਂ" },
  moderate: { en: "Filling up", hi: "भर रहा है", pa: "ਭਰ ਰਿਹਾ" },
  congested: { en: "Very busy", hi: "बहुत भीड़", pa: "ਬਹੁਤ ਭੀੜ" },
  speak: { en: "Tap to speak", hi: "बोलने के लिए दबाएँ", pa: "ਬੋਲਣ ਲਈ ਦਬਾਓ" },
  listening: { en: "Listening…", hi: "सुन रहे हैं…", pa: "ਸੁਣ ਰਹੇ ਹਾਂ…" },
  back: { en: "Back", hi: "पीछे", pa: "ਪਿੱਛੇ" },
  newBooking: { en: "New booking", hi: "नई बुकिंग", pa: "ਨਵੀਂ ਬੁਕਿੰਗ" },
  myTokens: { en: "My tokens", hi: "मेरे टोकन", pa: "ਮੇਰੇ ਟੋਕਨ" },
  whatsapp: { en: "WhatsApp booking", hi: "व्हाट्सएप बुकिंग", pa: "ਵਟਸਐਪ ਬੁਕਿੰਗ" },
  km: { en: "km away", hi: "कि.मी. दूर", pa: "ਕਿ.ਮੀ. ਦੂਰ" },
  mandi: { en: "Mandi", hi: "मंडी", pa: "ਮੰਡੀ" },
  slot: { en: "Slot", hi: "समय", pa: "ਸਮਾਂ" },
  logout: { en: "Log out", hi: "लॉग आउट", pa: "ਲਾਗ ਆਉਟ" },
  helpline: { en: "Kisan helpline", hi: "किसान हेल्पलाइन", pa: "ਕਿਸਾਨ ਹੈਲਪਲਾਈਨ" },
  callbackCta: { en: "Request callback / IVR help", hi: "कॉलबैक / IVR सहायता", pa: "ਕਾਲਬੈਕ / IVR ਮਦਦ" },
  demoOnly: { en: "Demo simulation — no real call is placed", hi: "डेमो सिमुलेशन — कोई असली कॉल नहीं", pa: "ਡੈਮੋ ਸਿਮੂਲੇਸ਼ਨ — ਅਸਲ ਕਾਲ ਨਹੀਂ" },
  chooseLanguage: { en: "Choose language for the call", hi: "कॉल की भाषा चुनें", pa: "ਕਾਲ ਦੀ ਭਾਸ਼ਾ ਚੁਣੋ" },
  connecting: { en: "Connecting your call…", hi: "कॉल जोड़ी जा रही है…", pa: "ਕਾਲ ਜੋੜੀ ਜਾ ਰਹੀ ਹੈ…" },
  ivrMenu: { en: "IVR menu", hi: "IVR मेन्यू", pa: "IVR ਮੇਨੂ" },
  ivrPress: { en: "Press", hi: "दबाएँ", pa: "ਦਬਾਓ" },
  ivrBookingStatus: { en: "Booking status", hi: "बुकिंग स्थिति", pa: "ਬੁਕਿੰਗ ਸਥਿਤੀ" },
  ivrSlotHelp: { en: "Slot booking help", hi: "स्लॉट बुकिंग सहायता", pa: "ਸਲਾਟ ਬੁਕਿੰਗ ਮਦਦ" },
  ivrPayment: { en: "Token / payment support", hi: "टोकन / भुगतान सहायता", pa: "ਟੋਕਨ / ਭੁਗਤਾਨ ਮਦਦ" },
  ivrAgent: { en: "Speak to support", hi: "प्रतिनिधि से बात करें", pa: "ਸਹਾਇਕ ਨਾਲ ਗੱਲ ਕਰੋ" },
  ivrMain: { en: "Main menu", hi: "मुख्य मेन्यू", pa: "ਮੁੱਖ ਮੇਨੂ" },
  endCall: { en: "End call", hi: "कॉल समाप्त", pa: "ਕਾਲ ਬੰਦ" },
  callbackQueued: { en: "Callback requested. Our team will call you back.", hi: "कॉलबैक दर्ज। हमारी टीम कॉल करेगी।", pa: "ਕਾਲਬੈਕ ਦਰਜ। ਸਾਡੀ ਟੀਮ ਕਾਲ ਕਰੇਗੀ।" },
  tractorPool: { en: "Tractor pooling", hi: "ट्रैक्टर पूलिंग", pa: "ਟਰੈਕਟਰ ਪੂਲਿੰਗ" },
  poolSub: { en: "Share a tractor trip with farmers going to the same mandi", hi: "उसी मंडी जाने वाले किसानों के साथ ट्रैक्टर साझा करें", pa: "ਉਸੇ ਮੰਡੀ ਜਾਣ ਵਾਲੇ ਕਿਸਾਨਾਂ ਨਾਲ ਟਰੈਕਟਰ ਸਾਂਝਾ ਕਰੋ" },
  selectBooking: { en: "Select your booking", hi: "अपनी बुकिंग चुनें", pa: "ਆਪਣੀ ਬੁਕਿੰਗ ਚੁਣੋ" },
  availablePools: { en: "Available pools", hi: "उपलब्ध पूल", pa: "ਉਪਲਬਧ ਪੂਲ" },
  noPools: { en: "No pools yet for this mandi and date.", hi: "इस मंडी व तारीख़ के लिए कोई पूल नहीं।", pa: "ਇਸ ਮੰਡੀ ਤੇ ਤਾਰੀਖ਼ ਲਈ ਕੋਈ ਪੂਲ ਨਹੀਂ।" },
  joinPool: { en: "Join pool", hi: "पूल में शामिल हों", pa: "ਪੂਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ" },
  leavePool: { en: "Leave pool", hi: "पूल छोड़ें", pa: "ਪੂਲ ਛੱਡੋ" },
  createPool: { en: "Create a new pool", hi: "नया पूल बनाएँ", pa: "ਨਵਾਂ ਪੂਲ ਬਣਾਓ" },
  pickupArea: { en: "Pickup area", hi: "पिकअप जगह", pa: "ਪਿਕਅਪ ਥਾਂ" },
  pickupTime: { en: "Pickup time", hi: "पिकअप समय", pa: "ਪਿਕਅਪ ਸਮਾਂ" },
  seats: { en: "Seats", hi: "सीटें", pa: "ਸੀਟਾਂ" },
  tripCost: { en: "Trip cost", hi: "यात्रा लागत", pa: "ਸਫ਼ਰ ਲਾਗਤ" },
  yourShare: { en: "Your share", hi: "आपका हिस्सा", pa: "ਤੁਹਾਡਾ ਹਿੱਸਾ" },
  poolFull: { en: "Pool full", hi: "पूल भरा", pa: "ਪੂਲ ਭਰਿਆ" },
  joined: { en: "Joined", hi: "शामिल", pa: "ਸ਼ਾਮਲ" },
  poolConfirmed: { en: "You are in this pool!", hi: "आप इस पूल में हैं!", pa: "ਤੁਸੀਂ ਇਸ ਪੂਲ ਵਿੱਚ ਹੋ!" },
  needBooking: { en: "Book a mandi slot first to use tractor pooling.", hi: "पूलिंग के लिए पहले मंडी स्लॉट बुक करें।", pa: "ਪੂਲਿੰਗ ਲਈ ਪਹਿਲਾਂ ਮੰਡੀ ਸਲਾਟ ਬੁੱਕ ਕਰੋ।" },
  members: { en: "Farmers", hi: "किसान", pa: "ਕਿਸਾਨ" },
};

// Additional Indian-language translations used by the IVR and available to the
// rest of the app. Existing English/Hindi/Punjabi copy above is intentionally
// left unchanged; other screens fall back to English where a translation has
// not been supplied yet.
const EXTRA_TRANSLATIONS: Record<string, Partial<Record<Lang, string>>> = {
  selectState: {
    mr: "राज्य निवडा", ta: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்", te: "రాష్ట్రాన్ని ఎంచుకోండి", gu: "રાજ્ય પસંદ કરો",
  },
  selectCity: {
    mr: "शहर निवडा", ta: "நகரத்தைத் தேர்ந்தெடுக்கவும்", te: "నగరాన్ని ఎంచుకోండి", gu: "શહેર પસંદ કરો",
  },
  allIndia: {
    mr: "संपूर्ण भारत", ta: "முழு இந்தியா", te: "భారతదేశం முழுவதும்", gu: "સમગ્ર ભારત",
  },
  chooseLanguage: {
    mr: "कॉलसाठी भाषा निवडा", ta: "அழைப்புக்கான மொழியைத் தேர்ந்தெடுக்கவும்",
    te: "కాల్ కోసం భాషను ఎంచుకోండి", gu: "કૉલ માટે ભાષા પસંદ કરો",
  },
  connecting: {
    mr: "तुमचा कॉल जोडला जात आहे…", ta: "உங்கள் அழைப்பு இணைக்கப்படுகிறது…",
    te: "మీ కాల్ కనెక్ట్ అవుతోంది…", gu: "તમારો કૉલ જોડાઈ રહ્યો છે…",
  },
  ivrMenu: {
    mr: "IVR मेनू", ta: "IVR மெனு", te: "IVR మెనూ", gu: "IVR મેનુ",
  },
  ivrPress: {
    mr: "दाबा", ta: "அழுத்தவும்", te: "నొక్కండి", gu: "નંબરો દબાવો",
  },
  ivrBookingStatus: {
    mr: "बुकिंगची स्थिती", ta: "முன்பதிவு நிலை", te: "బుకింగ్ స్థితి", gu: "બુકિંગની સ્થિતિ",
  },
  ivrSlotHelp: {
    mr: "स्लॉट बुकिंग मदत", ta: "ஸ்லாட் முன்பதிவு உதவி", te: "స్లాట్ బుకింగ్ సహాయం", gu: "સ્લોટ બુકિંગ મદદ",
  },
  ivrPayment: {
    mr: "टोकन / पेमेंट मदत", ta: "டோக்கன் / பணம் செலுத்துதல் உதவி", te: "టోకెన్ / చెల్లింపు సహాయం", gu: "ટોકન / ચુકવણી સહાય",
  },
  ivrAgent: {
    mr: "सहाय्यकाशी बोला", ta: "ஆதரவு நபருடன் பேசவும்", te: "సపోర్ట్‌తో మాట్లాడండి", gu: "સહાય સાથે વાત કરો",
  },
  ivrMain: {
    mr: "मुख्य मेनू", ta: "முதன்மை மெனு", te: "ప్రధాన మెనూ", gu: "મુખ્ય મેનુ",
  },
  endCall: {
    mr: "कॉल समाप्त करा", ta: "அழைப்பை முடிக்கவும்", te: "కాల్ ముగించండి", gu: "કૉલ સમાપ્ત કરો",
  },
  callbackQueued: {
    mr: "कॉलबॅकची विनंती नोंदवली. आमची टीम परत कॉल करेल.",
    ta: "திரும்ப அழைப்புக்கான கோரிக்கை பதிவு செய்யப்பட்டது. எங்கள் குழு அழைக்கும்.",
    te: "కాల్‌బ్యాక్ అభ్యర్థన నమోదు చేయబడింది. మా బృందం తిరిగి కాల్ చేస్తుంది.",
    gu: "કૉલબૅકની વિનંતી નોંધાઈ. અમારી ટીમ તમને પાછો કૉલ કરશે.",
  },
  helpline: {
    mr: "किसान हेल्पलाइन", ta: "விவசாயி உதவி எண்", te: "రైతు హెల్ప్‌లైన్", gu: "ખેડૂત હેલ્પલાઇન",
  },
  demoOnly: {
    mr: "डेमो सिम्युलेशन — प्रत्यक्ष कॉल केला जात नाही",
    ta: "டெமோ — உண்மையான அழைப்பு செய்யப்படாது",
    te: "డెమో సిమ్యులేషన్ — నిజమైన కాల్ చేయబడదు",
    gu: "ડેમો સિમ્યુલેશન — વાસ્તવિક કૉલ કરવામાં આવતો નથી",
  },
  yourToken: {
    mr: "तुमचा डिजिटल टोकन", ta: "உங்கள் டிஜிட்டல் டோக்கன்",
    te: "మీ డిజిటల్ టోకెన్", gu: "તમારો ડિજિટલ ટોકન",
  },
  mandi: {
    mr: "मंडी", ta: "மண்டி", te: "మండి", gu: "મંડી",
  },
  slot: {
    mr: "स्लॉट", ta: "நேர இடைவேளை", te: "స్లాట్", gu: "స్లాట్",
  },
  scheduled: {
    mr: "नियोजित", ta: "திட்டமிடப்பட்டது", te: "షెడ్యూల్ చేయబడింది", gu: "નક્કી કરેલ",
  },
  weighed: {
    mr: "वजन झाले", ta: "எடை போடப்பட்டது", te: "తూకం వేయబడింది", gu: "વજન થયું",
  },
  approved: {
    mr: "मंजूर", ta: "அங்கீகரிக்கப்பட்டது", te: "ఆమోదించబడింది", gu: "મંજૂર",
  },
  paid: {
    mr: "पैसे दिले", ta: "பணம் செலுத்தப்பட்டது", te: "చెల్లించబడింది", gu: "ચૂકવણી થઈ",
  },
  needBooking: {
    mr: "IVR मदत वापरण्यासाठी आधी मंडी स्लॉट बुक करा.",
    ta: "IVR உதவியைப் பயன்படுத்த முதலில் மண்டி ஸ்லாட்டை முன்பதிவு செய்யவும்.",
    te: "IVR సహాయం కోసం ముందుగా మండి స్లాట్ బుక్ చేయండి.",
    gu: "IVR મદદ માટે પહેલા મંડી સ્લોટ બુક કરો.",
  },
};

export function t(key: keyof typeof dict | string, lang: Lang): string {
  const extra = EXTRA_TRANSLATIONS[key]?.[lang];
  if (extra) return extra;
  const entry = dict[key];
  return entry?.[lang as "en" | "hi" | "pa"] ?? entry?.en ?? key;
}
