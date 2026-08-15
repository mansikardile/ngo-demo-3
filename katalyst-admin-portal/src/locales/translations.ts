import { Language } from '../types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_events: 'Events',
    nav_leads: 'Leads',
    nav_applications: 'Applications',
    nav_analytics: 'Analytics',
    nav_exports: 'Exports',
    nav_notifications: 'Notifications',
    nav_settings: 'Settings',
    nav_help: 'Help & Documentation',
    nav_team: 'Team Management',
    nav_integrations: 'Integrations',
    
    // Topbar
    search_placeholder: 'Search leads, events, colleges, tracking IDs...',
    live_indicator: 'Live',
    new_registrations_last_hour: '12 new registrations in the last hour',
    create_event_cta: 'Create Event',
    export_cta: 'Export CSV',
    
    // Dashboard KPIs
    kpi_total_events: 'Total Events',
    kpi_total_registrations: 'Total Registrations',
    kpi_applications_started: 'Applications Started',
    kpi_applications_completed: 'Applications Completed',
    kpi_conversion_rate: 'Overall Conversion Rate',
    
    // Funnel
    funnel_registered: 'Registered',
    funnel_started: 'Started',
    funnel_completed: 'Completed',
    funnel_dropoff: 'Drop-off',
    
    // Headings
    dashboard_greeting: 'Good morning',
    dashboard_subtitle: "Here's how your outreach program is performing.",
    top_events: 'Top Performing Events',
    recent_leads: 'Recent Leads Feed',
    view_all_leads: 'View All Leads',
    view_event: 'View Event',
    
    // Filters & Actions
    filter_all: 'All',
    filter_active: 'Active',
    filter_upcoming: 'Upcoming',
    filter_completed: 'Completed',
    filter_archived: 'Archived',
    date_today: 'Today',
    date_7days: 'Last 7 Days',
    date_30days: 'Last 30 Days',
    date_quarter: 'This Quarter',
    date_custom: 'Custom Range',
    
    // Security
    secure_badge: 'Katalyst 256-bit Encrypted Portal',
    mask_toggle_show: 'Show PII',
    mask_toggle_hide: 'Mask Sensitive Data',
    
    // Statuses
    status_registered: 'Registered',
    status_started: 'Started',
    status_in_progress: 'In Progress',
    status_completed: 'Completed',
  },
  hi: {
    // Navigation
    nav_dashboard: 'डैशबोर्ड',
    nav_events: 'आउटरीच कार्यक्रम',
    nav_leads: 'छात्र लीड्स',
    nav_applications: 'आवेदन ट्रैकिंग',
    nav_analytics: 'एनालिटिक्स',
    nav_exports: 'डेटा निर्यात',
    nav_notifications: 'सूचनाएं',
    nav_settings: 'सेटिंग्स',
    nav_help: 'सहायता एवं निर्देश',
    nav_team: 'टीम प्रबंधन',
    nav_integrations: 'इंटीग्रेशन',
    
    // Topbar
    search_placeholder: 'छात्र का नाम, कॉलेज, ट्रैकिंग आईडी खोजें...',
    live_indicator: 'सक्रिय (Live)',
    new_registrations_last_hour: 'पिछले 1 घंटे में 12 नए पंजीकरण',
    create_event_cta: 'नया कार्यक्रम बनाएं',
    export_cta: 'CSV निर्यात करें',
    
    // Dashboard KPIs
    kpi_total_events: 'कुल कार्यक्रम',
    kpi_total_registrations: 'कुल पंजीकरण',
    kpi_applications_started: 'प्रारंभिक आवेदन',
    kpi_applications_completed: 'पूर्ण आवेदन',
    kpi_conversion_rate: 'कुल रूपांतरण दर (Conversion)',
    
    // Funnel
    funnel_registered: 'पंजीकृत',
    funnel_started: 'शुरू किया',
    funnel_completed: 'पूर्ण हुआ',
    funnel_dropoff: 'ड्रॉप-ऑफ',
    
    // Headings
    dashboard_greeting: 'नमस्ते',
    dashboard_subtitle: 'आपके कैटालिस्ट आउटरीच अभियान की वर्तमान स्थिति।',
    top_events: 'शीर्ष प्रदर्शन वाले कार्यक्रम',
    recent_leads: 'हाल ही में आए छात्र लीड्स',
    view_all_leads: 'सभी लीड्स देखें',
    view_event: 'कार्यक्रम देखें',
    
    // Filters & Actions
    filter_all: 'सभी',
    filter_active: 'सक्रिय',
    filter_upcoming: 'आगामी',
    filter_completed: 'समाप्त',
    filter_archived: 'संग्रहीत',
    date_today: 'आज',
    date_7days: 'पिछले 7 दिन',
    date_30days: 'पिछले 30 दिन',
    date_quarter: 'यह तिमाही',
    date_custom: 'कस्टम अवधि',
    
    // Security
    secure_badge: 'कैटालिस्ट 256-बिट सुरक्षित पोर्टल',
    mask_toggle_show: 'डेटा दिखाएं',
    mask_toggle_hide: 'संवेदनशील डेटा छुपाएं',
    
    // Statuses
    status_registered: 'पंजीकृत',
    status_started: 'प्रारंभिक',
    status_in_progress: 'प्रगति पर',
    status_completed: 'पूर्ण',
  },
  mr: {
    // Navigation
    nav_dashboard: 'डॅशबोर्ड',
    nav_events: 'आउटरीच कार्यक्रम',
    nav_leads: 'विद्यार्थी लीड्स',
    nav_applications: 'अर्ज ट्रॅकिंग',
    nav_analytics: 'अॅनालिटिक्स',
    nav_exports: 'डेटा निर्यात',
    nav_notifications: 'सूचना',
    nav_settings: 'सेटिंग्ज',
    nav_help: 'मदत व मार्गदर्शन',
    nav_team: 'प्रशासक संघ',
    nav_integrations: 'इंटेग्रेशन्स',
    
    // Topbar
    search_placeholder: 'विद्यार्थी, कॉलेज, ट्रॅकिंग आयडी शोधा...',
    live_indicator: 'थेट (Live)',
    new_registrations_last_hour: 'मागील एका तासात १२ नवीन नोंदणी',
    create_event_cta: 'नवीन कार्यक्रम जोडा',
    export_cta: 'CSV डाउनलोड करा',
    
    // Dashboard KPIs
    kpi_total_events: 'एकूण कार्यक्रम',
    kpi_total_registrations: 'एकूण नोंदणी',
    kpi_applications_started: 'सुरु केलेले अर्ज',
    kpi_applications_completed: 'पूर्ण झालेले अर्ज',
    kpi_conversion_rate: 'एकूण रूपांतरण दर (Conversion)',
    
    // Funnel
    funnel_registered: 'नोंदणीकृत',
    funnel_started: 'सुरु केले',
    funnel_completed: 'पूर्ण केले',
    funnel_dropoff: 'गळती (Drop-off)',
    
    // Headings
    dashboard_greeting: 'शुभ प्रभात',
    dashboard_subtitle: 'तुमच्या कॅटालिस्ट आउटरीच मोहिमेची अद्ययावत माहिती.',
    top_events: 'उत्कृष्ट कामगिरी केलेले कार्यक्रम',
    recent_leads: 'नुकतेच नोंदणी झालेले विद्यार्थी',
    view_all_leads: 'सर्व विद्यार्थी पहा',
    view_event: 'कार्यक्रम पहा',
    
    // Filters & Actions
    filter_all: 'सर्व',
    filter_active: 'सक्रिय',
    filter_upcoming: 'आगामी',
    filter_completed: 'पूर्ण झालेले',
    filter_archived: 'संग्रहित',
    date_today: 'आज',
    date_7days: 'मागील ७ दिवस',
    date_30days: 'मागील ३० दिवस',
    date_quarter: 'चालू तिमाही',
    date_custom: 'सानुकूल कालावधी',
    
    // Security
    secure_badge: 'कॅटालिस्ट २५६-बिट सुरक्षित पोर्टल',
    mask_toggle_show: 'डेटा दाखवा',
    mask_toggle_hide: 'संवेदनशील माहिती लपवा',
    
    // Statuses
    status_registered: 'नोंदणीकृत',
    status_started: 'सुरु केले',
    status_in_progress: 'प्रगतीपथावर',
    status_completed: 'पूर्ण',
  }
};
