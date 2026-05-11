export const DEMO_STUDENTS = [
  { name:'Aisha Rahman',    email:'aisha@example.com',   package:'Course + Recordings', enrolled:'2 May 2025',  progress:72,  status:'active',    cert:false, certDate:'' },
  { name:'Omar Hassan',     email:'omar@example.com',    package:'Full Package',        enrolled:'1 May 2025',  progress:100, status:'completed', cert:false, certDate:'' },
  { name:'Fatima Al-Zahra', email:'fatima@example.com',  package:'Course Only',         enrolled:'30 Apr 2025', progress:100, status:'completed', cert:true,  certDate:'15 May 2025' },
  { name:'Ibrahim Malik',   email:'ibrahim@example.com', package:'Full Package',        enrolled:'28 Apr 2025', progress:45,  status:'active',    cert:false, certDate:'' },
  { name:'Zainab Yusuf',    email:'zainab@example.com',  package:'Course + Recordings', enrolled:'25 Apr 2025', progress:88,  status:'active',    cert:false, certDate:'' },
  { name:'Abdul Karim',     email:'abdul@example.com',   package:'Course Only',         enrolled:'20 Apr 2025', progress:10,  status:'pending',   cert:false, certDate:'' },
  { name:'Maryam Idris',    email:'maryam@example.com',  package:'Full Package',        enrolled:'18 Apr 2025', progress:100, status:'completed', cert:true,  certDate:'5 May 2025' },
  { name:'Yusuf Al-Amin',   email:'yusuf@example.com',   package:'Course + Recordings', enrolled:'15 Apr 2025', progress:60,  status:'active',    cert:false, certDate:'' },
  { name:'Khadija Osman',   email:'khadija@example.com', package:'Course Only',         enrolled:'10 Apr 2025', progress:100, status:'completed', cert:false, certDate:'' },
  { name:'Bilal Farooq',    email:'bilal@example.com',   package:'Full Package',        enrolled:'5 Apr 2025',  progress:35,  status:'active',    cert:false, certDate:'' },
];

const d = (daysAgo) => new Date(Date.now() - daysAgo * 86400000);
export const DEMO_PAYMENTS = [
  { name:'Aisha Rahman',    email:'aisha@example.com',   description:'Course + Recordings', amount:149, currency:'gbp', date:d(1),  status:'succeeded' },
  { name:'Omar Hassan',     email:'omar@example.com',    description:'Full Package',        amount:199, currency:'gbp', date:d(2),  status:'succeeded' },
  { name:'Fatima Al-Zahra', email:'fatima@example.com',  description:'Course Only',         amount:99,  currency:'gbp', date:d(3),  status:'succeeded' },
  { name:'Ibrahim Malik',   email:'ibrahim@example.com', description:'Full Package',        amount:199, currency:'gbp', date:d(5),  status:'succeeded' },
  { name:'Zainab Yusuf',    email:'zainab@example.com',  description:'Course + Recordings', amount:149, currency:'gbp', date:d(7),  status:'succeeded' },
  { name:'Abdul Karim',     email:'abdul@example.com',   description:'Course Only',         amount:99,  currency:'gbp', date:d(10), status:'succeeded' },
  { name:'Maryam Idris',    email:'maryam@example.com',  description:'Full Package',        amount:199, currency:'gbp', date:d(14), status:'succeeded' },
  { name:'Yusuf Al-Amin',   email:'yusuf@example.com',   description:'Course + Recordings', amount:149, currency:'gbp', date:d(18), status:'succeeded' },
  { name:'Khadija Osman',   email:'khadija@example.com', description:'Course Only',         amount:99,  currency:'gbp', date:d(22), status:'succeeded' },
  { name:'Bilal Farooq',    email:'bilal@example.com',   description:'Full Package',        amount:199, currency:'gbp', date:d(28), status:'succeeded' },
];

export const DEMO_MONTHLY = [
  { month:'Dec', amount:447 }, { month:'Jan', amount:795 },
  { month:'Feb', amount:1047 }, { month:'Mar', amount:844 },
  { month:'Apr', amount:1293 }, { month:'May', amount:794 },
];

export const DEMO_KIT = {
  totalSubscribers: 847,
  activeSubscribers: 712,
  recentSubscribers: [
    { name:'Hamza Tariq',     email:'hamza@example.com',    createdAt:d(1),  state:'active' },
    { name:'Ruqayyah Noor',   email:'ruqayyah@example.com', createdAt:d(2),  state:'active' },
    { name:'Khalid Mansour',  email:'khalid@example.com',   createdAt:d(3),  state:'active' },
    { name:'Aminah Siddiqui', email:'aminah@example.com',   createdAt:d(5),  state:'active' },
    { name:'Tariq Hassan',    email:'tariq@example.com',    createdAt:d(6),  state:'inactive' },
    { name:'Safiya Okafor',   email:'safiya@example.com',   createdAt:d(8),  state:'active' },
    { name:'Idris Kamara',    email:'idris@example.com',    createdAt:d(9),  state:'active' },
    { name:'Layla Al-Rashid', email:'layla@example.com',    createdAt:d(11), state:'active' },
    { name:'Sulayman Jallo',  email:'sulayman@example.com', createdAt:d(13), state:'active' },
    { name:'Nadia Benali',    email:'nadia@example.com',    createdAt:d(14), state:'active' },
  ],
  broadcasts: [
    { subject:'Islamic Finance Course — Cohort 3 Now Open', sentAt:d(3),  recipients:712, openRate:0.41, clickRate:0.12 },
    { subject:'What is Riba? A brief explainer',            sentAt:d(10), recipients:698, openRate:0.38, clickRate:0.09 },
    { subject:'New: Halal Mortgages Guide (free download)', sentAt:d(18), recipients:681, openRate:0.44, clickRate:0.17 },
    { subject:'Last chance — cohort 2 closes tonight',      sentAt:d(32), recipients:654, openRate:0.52, clickRate:0.21 },
    { subject:'Welcome to the AWSharia newsletter',         sentAt:d(60), recipients:512, openRate:0.61, clickRate:0.14 },
  ],
  sequences: [
    { name:'New subscriber welcome',    subscriberCount:847, status:'active' },
    { name:'Course nurture (5-day)',     subscriberCount:203, status:'active' },
    { name:'Post-purchase onboarding',  subscriberCount:89,  status:'active' },
    { name:'Re-engagement',             subscriberCount:135, status:'active' },
  ],
};
