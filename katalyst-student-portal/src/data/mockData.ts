import { EventInfo, FAQItem, StudentRegistrationData, ApplicationFormData } from '../types';

export const MOCK_EVENTS: EventInfo[] = [
  {
    id: 'EVT-MIT-2026-001',
    code: 'EVT-MIT-2026-001',
    title: 'Katalyst STEM Career Awareness & Leadership Outreach 2026',
    collegeName: 'MIT World Peace University (MIT-WPU)',
    city: 'Pune',
    state: 'Maharashtra',
    date: '20 August 2026',
    time: '11:00 AM – 01:30 PM IST',
    venue: 'Swami Vivekananda Auditorium, Central Campus',
    coordinatorName: 'Pooja Kulkarni',
    coordinatorPhone: '+91 98200 45678',
    coordinatorEmail: 'pooja.kulkarni@katalystindia.org',
    status: 'active',
    description: 'Interactive career orientation, introduction to the Katalyst 4-Year STEM Scholarship, laptop provision scheme, global mentorship model, and soft skills training.',
    eligibleBranches: ['Computer Science', 'Information Technology', 'AI & Data Science', 'Electronics & Comm.', 'Mechanical', 'Electrical', 'Civil', 'Biotechnology'],
    bannerSubtitle: 'Official College Outreach & On-Spot Registration'
  },
  {
    id: 'EVT-COEP-2026-002',
    code: 'EVT-COEP-2026-002',
    title: 'Katalyst Women in Technology & Engineering Induction',
    collegeName: 'COEP Technological University (College of Engineering Pune)',
    city: 'Pune',
    state: 'Maharashtra',
    date: '24 August 2026',
    time: '02:00 PM – 04:30 PM IST',
    venue: 'Main Auditorium, North Wing',
    coordinatorName: 'Rohit Deshmukh',
    coordinatorPhone: '+91 98200 78901',
    coordinatorEmail: 'rohit.deshmukh@katalystindia.org',
    status: 'active',
    description: 'Special technical empowerment and scholarship guidance session for first and second year engineering female scholars.',
    eligibleBranches: ['All Engineering Branches', 'Applied Sciences', 'B.Tech/M.Tech Integrated'],
    bannerSubtitle: 'Premier Engineering Campus Chapter'
  },
  {
    id: 'EVT-CUMMINS-2026-003',
    code: 'EVT-CUMMINS-2026-003',
    title: 'Empowering Future Women Leaders in Engineering',
    collegeName: "MKSSS's Cummins College of Engineering for Women",
    city: 'Pune',
    state: 'Maharashtra',
    date: '28 August 2026',
    time: '10:00 AM – 12:30 PM IST',
    venue: 'Mechanical Seminar Hall, Karve Nagar Campus',
    coordinatorName: 'Snehal Patil',
    coordinatorPhone: '+91 98200 22334',
    coordinatorEmail: 'snehal.patil@katalystindia.org',
    status: 'active',
    description: 'Exclusive session focusing on core engineering disciplines, industry corporate mentors from Cummins, Boeing, and Google.',
    eligibleBranches: ['Computer Science', 'IT', 'Mechanical', 'Instrumentation', 'E&TC'],
    bannerSubtitle: 'Women-only Engineering Institute Special Drive'
  },
  {
    id: 'EVT-VJTI-2026-004',
    code: 'EVT-VJTI-2026-004',
    title: 'Mumbai Regional STEM Empowerment & Scholarship Briefing',
    collegeName: 'Veermata Jijabai Technological Institute (VJTI)',
    city: 'Mumbai',
    state: 'Maharashtra',
    date: '02 September 2026',
    time: '03:00 PM – 05:00 PM IST',
    venue: 'Kranti Jyoti Savitribai Phule Hall, Matunga',
    coordinatorName: 'Deepa Sawant',
    coordinatorPhone: '+91 98200 99887',
    coordinatorEmail: 'deepa.sawant@katalystindia.org',
    status: 'active',
    description: 'Outreach and registration session for young women pursuing STEM careers across Mumbai universities.',
    eligibleBranches: ['All Engineering Streams', 'Computer Applications'],
    bannerSubtitle: 'Mumbai Metro Chapter Drive'
  },
  {
    id: 'EVT-IITB-2026-EXPIRED',
    code: 'EVT-IITB-2026-EXPIRED',
    title: 'IIT Bombay Tech Connect & Katalyst Briefing',
    collegeName: 'Indian Institute of Technology Bombay (IIT-B)',
    city: 'Mumbai',
    state: 'Maharashtra',
    date: '10 August 2026',
    time: '11:00 AM – 01:00 PM IST',
    venue: 'FC Kohli Auditorium, Powai',
    coordinatorName: 'Vikram Joshi',
    coordinatorPhone: '+91 98200 11223',
    coordinatorEmail: 'vikram.joshi@katalystindia.org',
    status: 'expired',
    description: 'This college event has concluded. Registrations for this specific drive are closed.',
    eligibleBranches: ['Engineering', 'Sciences'],
    bannerSubtitle: 'Completed Session'
  },
  {
    id: 'EVT-INACTIVE-999',
    code: 'EVT-INACTIVE-999',
    title: 'Scheduled Regional Outreach (Pending Admin Confirmation)',
    collegeName: 'Government College of Engineering, Aurangabad',
    city: 'Chhatrapati Sambhaji Nagar',
    state: 'Maharashtra',
    date: '15 September 2026',
    time: 'To be announced',
    venue: 'Campus Main Hall',
    coordinatorName: 'Support Team',
    coordinatorPhone: '+91 22 2490 0012',
    coordinatorEmail: 'help@katalystindia.org',
    status: 'inactive',
    description: 'This event schedule is currently pending confirmation.',
    eligibleBranches: ['All STEM Disciplines']
  }
];

export const POPULAR_COLLEGES = [
  'MIT World Peace University (MIT-WPU), Pune',
  'COEP Technological University (College of Engineering Pune)',
  "MKSSS's Cummins College of Engineering for Women, Pune",
  'Veermata Jijabai Technological Institute (VJTI), Mumbai',
  'Pune Institute of Computer Technology (PICT), Pune',
  'Sardar Patel Institute of Technology (SPIT), Mumbai',
  'Vishwakarma Institute of Technology (VIT), Pune',
  'Dwarkadas J. Sanghvi College of Engineering (DJSCE), Mumbai',
  'Government College of Engineering, Karad',
  'Walchand College of Engineering, Sangli',
  'BMS College of Engineering, Bengaluru',
  'RV College of Engineering, Bengaluru',
  'Indira Gandhi Delhi Technical University for Women (IGDTUW), Delhi',
  'Netaji Subhas University of Technology (NSUT), Delhi',
  'Other / College Not Listed Above'
];

export const MOCK_STUDENTS: StudentRegistrationData[] = [
  {
    trackingId: 'STU-2026-000184',
    eventId: 'EVT-MIT-2026-001',
    eventCode: 'EVT-MIT-2026-001',
    eventName: 'MIT Pune STEM Outreach',
    fullName: 'Ananya Ramesh Sharma',
    email: 'ananya.sharma@mitwpu.edu.in',
    phone: '9876543210',
    dob: '2006-04-14',
    gender: 'Female',
    college: 'MIT World Peace University (MIT-WPU), Pune',
    yearOfStudy: '1st Year',
    fieldOfStudy: 'Computer Science / IT',
    cgpaPercentage: '8.8 CGPA',
    consentDataProcessing: true,
    consentFutureComms: true,
    registeredAt: '2026-08-20 11:35 AM',
    status: 'APPLICATION_IN_PROGRESS',
    personalizedLink: '/apply/STU-2026-000184'
  },
  {
    trackingId: 'STU-2026-000185',
    eventId: 'EVT-MIT-2026-001',
    eventCode: 'EVT-MIT-2026-001',
    eventName: 'MIT Pune STEM Outreach',
    fullName: 'Pooja Sanjay Sawant',
    email: 'pooja.sawant@gmail.com',
    phone: '9822334455',
    dob: '2005-11-22',
    gender: 'Female',
    college: 'MIT World Peace University (MIT-WPU), Pune',
    yearOfStudy: '2nd Year',
    fieldOfStudy: 'Electronics & Telecommunication',
    cgpaPercentage: '8.2 CGPA',
    consentDataProcessing: true,
    consentFutureComms: true,
    registeredAt: '2026-08-20 11:42 AM',
    status: 'APPLICATION_SUBMITTED',
    personalizedLink: '/apply/STU-2026-000185'
  },
  {
    trackingId: 'STU-2026-000142',
    eventId: 'EVT-COEP-2026-002',
    eventCode: 'EVT-COEP-2026-002',
    eventName: 'COEP Pune Outreach',
    fullName: 'Tanvi Dilip Kulkarni',
    email: 'kulkarni.tanvi@coep.ac.in',
    phone: '9988776655',
    dob: '2006-02-18',
    gender: 'Female',
    college: 'COEP Technological University (College of Engineering Pune)',
    yearOfStudy: '1st Year',
    fieldOfStudy: 'Mechanical Engineering',
    cgpaPercentage: '9.1 CGPA',
    consentDataProcessing: true,
    consentFutureComms: true,
    registeredAt: '2026-08-18 02:15 PM',
    status: 'INTERVIEW_SCHEDULED',
    personalizedLink: '/apply/STU-2026-000142'
  },
  {
    trackingId: 'STU-2026-000099',
    eventId: 'EVT-VJTI-2026-004',
    eventCode: 'EVT-VJTI-2026-004',
    eventName: 'VJTI Mumbai Drive',
    fullName: 'Sneha Mohan Jadhav',
    email: 'sneha.jadhav@vjti.ac.in',
    phone: '9766554433',
    dob: '2005-09-05',
    gender: 'Female',
    college: 'Veermata Jijabai Technological Institute (VJTI), Mumbai',
    yearOfStudy: '2nd Year',
    fieldOfStudy: 'AI / Data Science / ML',
    cgpaPercentage: '9.4 CGPA',
    consentDataProcessing: true,
    consentFutureComms: true,
    registeredAt: '2026-08-15 10:00 AM',
    status: 'SELECTED',
    personalizedLink: '/apply/STU-2026-000099'
  }
];

export const INITIAL_APPLICATION_DRAFT: ApplicationFormData = {
  // Step 1: Personal
  fullName: 'Ananya Ramesh Sharma',
  email: 'ananya.sharma@mitwpu.edu.in',
  phone: '9876543210',
  alternatePhone: '9876543211',
  dob: '2006-04-14',
  gender: 'Female',
  category: 'General (EWS)',
  isFirstGenGraduate: true,
  currentAddress: 'Flat 302, Sai Shraddha Residency, Paud Road, Kothrud',
  permanentAddress: 'House No. 45, Shivaji Chowk, Taluka Shirur',
  pincode: '411038',
  city: 'Pune',
  state: 'Maharashtra',

  // Step 2: Academic
  collegeName: 'MIT World Peace University (MIT-WPU), Pune',
  degree: 'B.Tech (Bachelor of Technology)',
  branch: 'Computer Science and Engineering',
  yearOfStudy: '1st Year',
  tenthPercentage: '93.60%',
  tenthBoard: 'Maharashtra State Board (SSC)',
  twelfthPercentage: '89.40%',
  twelfthBoard: 'Maharashtra State Board (HSC)',
  currentSemesterCgpa: '8.80',
  entranceExamType: 'MHT-CET',
  entranceExamPercentile: '96.85 Percentile',
  academicAchievements: 'School topper in Mathematics, 2nd prize in State Science Talent Search 2024.',

  // Step 3: Family & Background
  annualFamilyIncome: '₹ 1,80,000 / year (Under ₹ 2.5 Lakhs)',
  fatherName: 'Ramesh Sharma',
  fatherOccupation: 'Small grocery store assistant',
  motherName: 'Sunita Sharma',
  motherOccupation: 'Homemaker / Part-time tailoring',
  numberOfSiblings: '1 younger sister (Class 9)',
  familyMembersCount: '4',
  houseType: 'Rented (Single room kitchen)',
  hasLaptop: false,
  hasInternetAtHome: true,
  hasReceivedOtherScholarship: false,
  otherScholarshipDetails: '',

  // Step 4: Aspirations & Goals
  careerGoal: 'Software Architect & Machine Learning Researcher',
  whyKatalyst: 'Coming from a modest background where higher technical education is challenging, Katalyst will provide me with a laptop, 1-on-1 industry mentorship from leading tech companies, and professional communication skills to lift my entire family.',
  greatestChallengeOvercome: 'Managing commute and sharing a single smartphone with my sister for high school board preparation during power outages, while consistently staying at the top of the class.',
  hobbiesAndInterests: 'Python coding, open-source tutorials, reading biographies of women scientists, solving logic puzzles.',
  mentorshipExpectations: 'Guidance on choosing high-impact software specializations, mock interviews, corporate culture awareness, and guidance for international technical internships.',

  // Step 5: Documents
  documents: [
    {
      id: 'doc-1',
      name: 'College_ID_Ananya_MIT.pdf',
      type: 'college_id',
      label: 'College ID Card / Bonafide Certificate',
      fileSize: '1.2 MB',
      uploadedAt: 'Today, 11:45 AM',
      status: 'uploaded',
      previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=60',
      required: true
    },
    {
      id: 'doc-2',
      name: '10th_SSC_Marksheet_93.6.pdf',
      type: 'tenth_marksheet',
      label: '10th Standard (SSC/CBSE) Marksheet',
      fileSize: '2.1 MB',
      uploadedAt: 'Today, 11:46 AM',
      status: 'uploaded',
      previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&auto=format&fit=crop&q=60',
      required: true
    },
    {
      id: 'doc-3',
      name: '12th_HSC_Marksheet_89.4.pdf',
      type: 'twelfth_marksheet',
      label: '12th Standard (HSC/CBSE) Marksheet',
      fileSize: '1.8 MB',
      uploadedAt: 'Today, 11:48 AM',
      status: 'uploaded',
      previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&auto=format&fit=crop&q=60',
      required: true
    },
    {
      id: 'doc-4',
      name: 'Tahsildar_Income_Certificate_2025-26.pdf',
      type: 'income_proof',
      label: 'Family Income Certificate (Tahsildar / Form 16 / Ration Card)',
      fileSize: '3.4 MB',
      uploadedAt: 'Today, 11:50 AM',
      status: 'uploaded',
      previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=60',
      required: true
    },
    {
      id: 'doc-5',
      name: 'Passport_Photo_Ananya.jpg',
      type: 'applicant_photo',
      label: 'Recent Passport Size Photograph',
      fileSize: '650 KB',
      uploadedAt: 'Today, 11:51 AM',
      status: 'uploaded',
      previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      required: true
    }
  ],

  // Step 6: Review & Final
  finalDeclarationAccepted: true,
  parentConsentConfirmed: true,
  digitalSignatureUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><path d="M 20 60 Q 60 20 100 50 T 180 40 T 260 60" fill="none" stroke="%238B1538" stroke-width="3"/></svg>',
  signatureDate: '20 August 2026',
  trackingId: 'STU-2026-000184',
  lastSavedAt: 'Saved just now',
  completedSteps: [1, 2, 3, 4],
  isSubmitted: false
};

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: {
      en: 'What is Katalyst and what support does a selected scholar receive?',
      hi: 'कैटालिस्ट क्या है और चयनित छात्रा को क्या सहायता मिलती है?',
      mr: 'कॅटालिस्ट काय आहे आणि निवडलेल्या विद्यार्थिनीला काय सहाय्य मिळते?'
    },
    answer: {
      en: 'Katalyst is an award-winning initiative of Third Sector Partners that empowers meritorious young women from low-income communities pursuing STEM degrees. Selected scholars receive financial scholarships for tuition, a branded personal laptop, medical/health insurance, 600+ hours of executive & tech skill training, 1-on-1 mentorship from top corporate leaders, and placement preparation assistance throughout their 4 years of college.',
      hi: 'कैटालिस्ट कम आय वर्ग की मेधावी छात्राओं को 4 साल की पूरी इंजीनियरिंग के दौरान ट्यूशन छात्रवृत्ति, व्यक्तिगत लैपटॉप, मेडिकल बीमा, 600+ घंटे का कौशल प्रशिक्षण और बहुराष्ट्रीय कंपनियों के वरिष्ठ लीडर्स से व्यक्तिगत मेंटरशिप प्रदान करता है।',
      mr: 'कॅटालिस्ट आर्थिक दुर्बल घटकातील गुणवंत विद्यार्थिनींना संपूर्ण ४ वर्षांच्या पदवी दरम्यान शैक्षणिक शिष्यवृत्ती, ब्रँडेड लॅपटॉप, वैद्यकीय विमा, ६००+ तासांचे कौशल्य प्रशिक्षण आणि कॉर्पोरेट लीडर्सचे वैयक्तिक मार्गदर्शन मोफत पुरवते.'
    }
  },
  {
    id: 'faq-2',
    category: 'eligibility',
    question: {
      en: 'Who is eligible to apply for the Katalyst STEM Scholarship?',
      hi: 'कैटालिस्ट छात्रवृत्ति के लिए कौन आवेदन कर सकता है?',
      mr: 'कॅटालिस्ट शिष्यवृत्तीसाठी कोण पात्र आहे?'
    },
    answer: {
      en: 'Eligibility criteria: (1) Female students enrolled in 1st or 2nd year of professional STEM undergraduate degree (B.Tech, B.E., Integrated M.Tech, Data Science). (2) Combined annual family income below ₹3.5 Lakhs. (3) Good academic track record (minimum 65-70% in 10th/12th / Diploma). (4) Passionate about building a technical career.',
      hi: 'पात्रता: (1) बी.टेक/बी.ई. या STEM डिग्री के प्रथम या द्वितीय वर्ष की छात्राएं। (2) कुल वार्षिक पारिवारिक आय ₹3.5 लाख से कम। (3) 10वीं/12वीं में न्यूनतम 65-70% अंक। (4) तकनीकी करियर के प्रति समर्पण।',
      mr: 'पात्रता: (१) इंजिनिअरिंग किंवा STEM पदवीच्या प्रथम किंवा द्वितीय वर्षातील विद्यार्थिनी. (२) एकूण कौटुंबिक वार्षिक उत्पन्न ₹३.५ लाखांपेक्षा कमी. (३) १०वी/१२वी मध्ये किमान ६५-७०% गुण. (४) तंत्रज्ञान क्षेत्रात करिअर करण्याची आवड.'
    }
  },
  {
    id: 'faq-3',
    category: 'registration',
    question: {
      en: 'How do I register at a college outreach event?',
      hi: 'कॉलेज आउटरीच इवेंट में पंजीकरण कैसे करें?',
      mr: 'कॉलेज इव्हेंटमध्ये नोंदणी कशी करावी?'
    },
    answer: {
      en: 'Simply scan the QR code displayed at your college event or open the unique event link. Your college event details will be automatically filled. Enter your name, email, phone number, and college branch, then draw your digital signature. Upon submitting, you instantly get a Tracking ID and personalized link to continue your application.',
      hi: 'अपने कॉलेज में प्रदर्शित क्यूआर कोड को स्कैन करें। आपके इवेंट की जानकारी अपने आप भर जाएगी। अपना नाम, ईमेल, फोन नंबर और शाखा दर्ज करें और डिजिटल हस्ताक्षर करें। आपको तुरंत ट्रैकिंग आईडी प्राप्त हो जाएगी।',
      mr: 'तुमच्या कॉलेजमधील क्यूआर कोड स्कॅन करा. इव्हेंटची माहिती आपोआप दिसेल. तुमचे नाव, ईमेल, मोबाईल आणि शाखा भरून डिजिटल सही करा. तुम्हाला लगेच ट्रॅकिंग आयडी आणि अर्जाची लिंक मिळेल.'
    }
  },
  {
    id: 'faq-4',
    category: 'application',
    question: {
      en: 'Can I complete my application later in multiple sittings?',
      hi: 'क्या मैं अपना आवेदन बाद में कई बार में पूरा कर सकती हूँ?',
      mr: 'मी माझा अर्ज नंतर टप्प्याटप्प्याने भरू शकते का?'
    },
    answer: {
      en: 'Yes, absolutely! The application auto-saves every field as you type. You can click "Save & Continue Later" at any time and use your unique tracking link or Tracking ID to resume whenever you are ready.',
      hi: 'हाँ, बिल्कुल! फॉर्म भरते समय आपका डेटा अपने आप सहेज लिया जाता है। आप कभी भी "सहेजें और बाद में भरें" पर क्लिक कर सकती हैं और अपनी ट्रैकिंग आईडी से दोबारा शुरू कर सकती हैं।',
      mr: 'हो, नक्कीच! तुम्ही माहिती भरताना ती आपोआप सेव्ह होते. तुम्ही "सेव्ह करून नंतर भरा" वर क्लिक करून कधीही ट्रॅकिंग आयडीने पुन्हा अर्ज भरू शकता.'
    }
  },
  {
    id: 'faq-5',
    category: 'documents',
    question: {
      en: 'What documents are required to submit with the application?',
      hi: 'आवेदन के साथ कौन से दस्तावेज़ अपलोड करने आवश्यक हैं?',
      mr: 'अर्जासोबत कोणती कागदपत्रे अपलोड करावी लागतील?'
    },
    answer: {
      en: 'You will need clear PDF/JPG copies of: (1) College Student ID or Bonafide letter, (2) 10th Standard Marksheet, (3) 12th Standard or Diploma Marksheet, (4) Government Income Certificate / Tahsildar letter / Ration Card / BPL card, and (5) Recent passport-size photograph.',
      hi: 'आवश्यक दस्तावेज़: (1) कॉलेज आईडी कार्ड या बोनाफाइड, (2) 10वीं की अंकतालिका, (3) 12वीं या डिप्लोमा अंकतालिका, (4) सक्षम अधिकारी द्वारा जारी आय प्रमाण पत्र/राशन कार्ड, और (5) पासपोर्ट साइज फोटो।',
      mr: 'आवश्यक कागदपत्रे: (१) कॉलेज आयडी कार्ड किंवा बोनाफाईड, (२) १० वी गुणपत्रिका, (३) १२ वी किंवा डिप्लोमा गुणपत्रिका, (४) तहसीलदारांचा उत्पन्न दाखला / रेशन कार्ड, आणि (५) पासपोर्ट फोटो.'
    }
  },
  {
    id: 'faq-6',
    category: 'selection',
    question: {
      en: 'What happens after I submit my application?',
      hi: 'आवेदन जमा करने के बाद क्या प्रक्रिया होती है?',
      mr: 'अर्ज सबमिट केल्यानंतर पुढे काय प्रक्रिया असते?'
    },
    answer: {
      en: 'Our selection process is fully transparent: (1) Document & eligibility screening by Katalyst panel. (2) Shortlisted candidates are invited for an in-person or online interactive conversation with senior panel members. (3) Final selection announcement and official scholarship induction ceremony with your parents.',
      hi: 'चयन प्रक्रिया: (1) दस्तावेज़ और पात्रता की जांच। (2) शॉर्टलिस्ट की गई छात्राओं का वरिष्ठ विशेषज्ञों के साथ व्यक्तिगत साक्षात्कार। (3) अंतिम चयन घोषणा और माता-पिता के साथ इंडक्शन समारोह।',
      mr: 'निवड प्रक्रिया: (१) कागदपत्रे व पात्रता पडताळणी. (२) निवडक विद्यार्थिनींची तज्ज्ञ पॅनेलसोबत मुलाखत. (३) अंतिम निवड आणि पालकांसोबत अधिकृत सन्मान सोहळा.'
    }
  },
  {
    id: 'faq-7',
    category: 'registration',
    question: {
      en: 'I lost my application link or Tracking ID. What should I do?',
      hi: 'मेरी आवेदन लिंक या ट्रैकिंग आईडी खो गई है। मुझे क्या करना चाहिए?',
      mr: 'माझी अर्ज लिंक किंवा ट्रॅकिंग आयडी हरवला आहे, मी काय करावे?'
    },
    answer: {
      en: 'No worries! Go to the "Track Status" or "Help & FAQs" tab, enter your registered mobile number or email in the "Lost Tracking ID" recovery box, and your tracking ID with your direct application link will be retrieved immediately.',
      hi: 'चिंता न करें! "Track Status" या "Help" पेज पर जाएं, अपना पंजीकृत मोबाइल नंबर दर्ज करें और अपना विवरण तुरंत वापस पाएं।',
      mr: 'काळजी करू नका! "Track Status" किंवा "Help" वर जाऊन तुमचा नोंदणीकृत मोबाईल नंबर टाका, तुम्हाला तुमचा ट्रॅकिंग आयडी आणि लिंक लगेच मिळेल.'
    }
  }
];

export const ALUMNI_STORIES = [
  {
    name: 'Priyanka Shinde',
    role: 'Senior Cloud Engineer, Microsoft',
    college: 'COEP Pune (Class of 2021)',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    quote: 'My father was an auto-rickshaw driver. Katalyst did not just provide a scholarship; my mentor helped me clear global cloud certifications and interview at Microsoft.'
  },
  {
    name: 'Aishwarya Patil',
    role: 'Quantitative Developer, Barclays',
    college: 'VJTI Mumbai (Class of 2022)',
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80',
    quote: 'The 600+ hours of communication and technical grooming transformed me from a shy college girl into a confident tech lead.'
  },
  {
    name: 'Neha Chawla',
    role: 'Machine Learning Specialist, Google',
    college: 'IGDTUW Delhi (Class of 2023)',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    quote: 'Having a dedicated personal laptop and an industry mentor during college completely changed the trajectory of my entire family.'
  }
];

export const CORPORATE_PARTNERS = [
  'Google', 'Microsoft', 'Barclays', 'Morgan Stanley', 'Cummins', 'Boeing', 'Mastercard', 'Siemens', 'Tata Consultancy Services', 'Infosys'
];
