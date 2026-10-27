import { LanguageCode } from '../types';

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Brand & App
    appName: 'MK Plastics Operations',
    tagline: 'Beads Bazaar · Bhiwandi',
    materialJourney: 'Material Journey Board',
    allUnits: 'All Factory Units',
    mouldingUnit: 'Moulding Unit',
    pearlUnit: 'Pearl Unit',
    metalizingUnit: 'Metalizing Unit',
    threadingWork: 'Threading (Karigar)',
    warehouse: 'Warehouse & Sales',

    // Stages
    stageRaw: '1. Raw Material',
    stagePlain: '2. Plain Beads (Moulding)',
    stageTransferred: '3. Transferred to Coating',
    stageCoated: '4. Coated Beads',
    stageAtKarigar: '5. At Karigar (Threading)',
    stageFinished: '6. Finished Stock & Dispatched',

    // Navigation
    navDashboard: 'Dashboard',
    navProduction: 'Production',
    navQuickEntry: 'Fast Entry',
    navStock: 'Stock Ledger',
    navTransfers: 'Transfers',
    navKarigar: 'Karigar Work',
    navCatalogue: 'Products',
    navOrders: 'Orders & Bills',
    navParties: 'Parties & CRM',
    navRawMaterials: 'Raw Materials',
    navExpenses: 'Expenses',
    navReports: 'Reports',
    navSettings: 'Settings',

    // Quick Stats
    todayProduction: "Today's Production",
    vsYesterday: 'vs yesterday',
    activeMachines: 'Active Machines',
    yieldPct: 'Yield %',
    wastePct: 'Waste %',
    karigarPending: 'Material Out at Karigar',
    overdueWarning: 'Overdue > 15 days',
    receivables: 'Total Receivables',
    lowStockAlerts: 'Low Stock Alerts',
    waitingOrders: 'Orders Waiting for Stock',
    grossProfit: 'Estimated Gross Profit',

    // Common Actions
    save: 'Save Record',
    saving: 'Saving...',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    reverse: 'Reverse Movement',
    filter: 'Filter',
    search: 'Search...',
    exportExcel: 'Export Excel',
    exportPdf: 'Export PDF',
    printSlip: 'Print Slip',
    shareWhatsApp: 'Share on WhatsApp',
    confirm: 'Confirm',
    offlineNotice: 'Offline Mode — Entries queued in device outbox',
    syncPending: 'Sync Pending',
    syncNow: 'Sync Now',

    // Roles
    roleAdmin: 'Owner / Admin',
    roleManager: 'Unit Manager',
    roleStaff: 'Machine Operator (Staff)',

    // Fast entry mode
    fastEntryBanner: 'Operator Fast-Entry Mode: 1-Tap Machine Log under 30 Seconds',
    selectMachine: 'Select Machine',
    gppsUsed: 'GPPS Used (KG)',
    goodBeads: 'Good Beads (KG)',
    wasteKg: 'Waste (KG)',
    regrindKg: 'Regrind Reused (KG)',
    bagsPacked: 'Bags Packed (25kg)',

    // Karigar
    sendToKarigar: 'Send to Karigar',
    receiveFromKarigar: 'Receive from Karigar',
    bunchesReturned: 'Bunches Returned',
    looseReturned: 'Loose Returned (KG)',
    scrapWastage: 'Wastage (KG)',
    daysOut: 'Days Out',

    // Orders & Billing
    newOrder: 'New Order',
    generateInvoice: 'Generate Invoice',
    gstTaxInvoice: 'GST Tax Invoice',
    kachchaBill: 'Kachcha Bill (Estimate)',
    dispatchItems: 'Dispatch Items',
    recordPayment: 'Record Payment',
    creditLimitWarning: 'Credit limit exceeded! Admin confirmation required.'
  },
  hi: {
    // Brand & App
    appName: 'एमके प्लास्टिक्स ऑपरेशन्स',
    tagline: 'बीड्स बाज़ार · भिवंडी',
    materialJourney: 'मटेरियल यात्रा बोर्ड',
    allUnits: 'सभी फैक्ट्री यूनिट्स',
    mouldingUnit: 'मोल्डिंग यूनिट',
    pearlUnit: 'पर्ल यूनिट',
    metalizingUnit: 'मेटलाइजिंग यूनिट',
    threadingWork: 'थ्रेडिंग (कारीगर काम)',
    warehouse: 'गोदाम एवं बिक्री',

    // Stages
    stageRaw: '१. कच्चा माल (GPPS)',
    stagePlain: '२. सादे मोती (मोल्डिंग)',
    stageTransferred: '३. कोटिंग को भेजा',
    stageCoated: '४. कोटेड मोती',
    stageAtKarigar: '५. कारीगर के पास (थ्रेडिंग)',
    stageFinished: '६. तैयार स्टॉक एवं बिक्री',

    // Navigation
    navDashboard: 'डैशबोर्ड',
    navProduction: 'उत्पादन',
    navQuickEntry: 'त्वरित एंट्री',
    navStock: 'स्टॉक लेजर',
    navTransfers: 'यूनिट ट्रांसफर',
    navKarigar: 'कारीगर काम',
    navCatalogue: 'उत्पाद सूची',
    navOrders: 'ऑर्डर व बिल',
    navParties: 'पार्टी एवं ग्राहक',
    navRawMaterials: 'कच्चा माल',
    navExpenses: 'खर्चे',
    navReports: 'रिपोर्ट्स',
    navSettings: 'सेटिंग्स',

    // Quick Stats
    todayProduction: 'आज का उत्पादन',
    vsYesterday: 'कल की तुलना में',
    activeMachines: 'सक्रिय मशीनें',
    yieldPct: 'उपज (Yield) %',
    wastePct: 'कचरा (Waste) %',
    karigarPending: 'कारीगर के पास माल',
    overdueWarning: '१५ दिन से अधिक बकाया',
    receivables: 'कुल बकाया राशि',
    lowStockAlerts: 'कम स्टॉक चेतावनी',
    waitingOrders: 'स्टॉक की प्रतीक्षा में ऑर्डर',
    grossProfit: 'अनुमानित सकल लाभ',

    // Common Actions
    save: 'सेव करें',
    saving: 'सेव हो रहा है...',
    cancel: 'रद्द करें',
    edit: 'बदलें',
    delete: 'हटाएं',
    reverse: 'वापस लें (Reverse)',
    filter: 'फ़िल्टर',
    search: 'खोजें...',
    exportExcel: 'एक्सेल निकालें',
    exportPdf: 'पीडीएफ निकालें',
    printSlip: 'पर्ची प्रिंट करें',
    shareWhatsApp: 'व्हाट्सएप पर भेजें',
    confirm: 'पुष्टि करें',
    offlineNotice: 'ऑफ़लाइन मोड — एंट्री फोन में सुरक्षित है',
    syncPending: 'सिंक बकाया',
    syncNow: 'अभी सिंक करें',

    // Roles
    roleAdmin: 'मालिक / एडमिन',
    roleManager: 'यूनिट मैनेजर',
    roleStaff: 'मशीन ऑपरेटर (स्टाफ)',

    // Fast entry mode
    fastEntryBanner: 'ऑपरेटर त्वरित एंट्री: ३० सेकंड में मशीन का हिसाब दर्ज करें',
    selectMachine: 'मशीन चुनें',
    gppsUsed: 'GPPS उपयोग (किलो)',
    goodBeads: 'बढ़िया मोती (किलो)',
    wasteKg: 'कचरा (किलो)',
    regrindKg: 'रीग्राइंड उपयोग (किलो)',
    bagsPacked: 'पैक्ड बोरियां (२५ किलो)',

    // Karigar
    sendToKarigar: 'कारीगर को माल भेजें',
    receiveFromKarigar: 'कारीगर से माल प्राप्त करें',
    bunchesReturned: 'प्राप्त गुच्छे (Bunches)',
    looseReturned: 'खुले मोती (किलो)',
    scrapWastage: 'कचरा / वेस्टेज (किलो)',
    daysOut: 'दिन हुए',

    // Orders & Billing
    newOrder: 'नया ऑर्डर',
    generateInvoice: 'बिल बनाएं',
    gstTaxInvoice: 'जीएसटी टैक्स इनवॉइस',
    kachchaBill: 'कच्चा बिल (एस्टीमेट)',
    dispatchItems: 'माल डिस्पैच करें',
    recordPayment: 'पेमेंट दर्ज करें',
    creditLimitWarning: 'क्रेडिट सीमा पार हो गई! एडमिन मंजूरी आवश्यक है।'
  },
  hinglish: {
    // Brand & App
    appName: 'MK Plastics Operations',
    tagline: 'Beads Bazaar · Bhiwandi',
    materialJourney: 'Material Flow Board',
    allUnits: 'Saare Factory Units',
    mouldingUnit: 'Moulding Unit',
    pearlUnit: 'Pearl Unit',
    metalizingUnit: 'Metalizing Unit',
    threadingWork: 'Threading (Karigar Kaam)',
    warehouse: 'Warehouse & Sales',

    // Stages
    stageRaw: '1. Raw Material (GPPS)',
    stagePlain: '2. Plain Beads (Moulding)',
    stageTransferred: '3. Transfer to Coating',
    stageCoated: '4. Coated Beads',
    stageAtKarigar: '5. Karigar ke Paas (Threading)',
    stageFinished: '6. Ready Stock & Dispatched',

    // Navigation
    navDashboard: 'Dashboard',
    navProduction: 'Production',
    navQuickEntry: 'Fast Entry (30s)',
    navStock: 'Stock Ledger',
    navTransfers: 'Transfers',
    navKarigar: 'Karigar Kaam',
    navCatalogue: 'Products (Brochure)',
    navOrders: 'Orders & Bills',
    navParties: 'Parties & CRM',
    navRawMaterials: 'Raw Material',
    navExpenses: 'Expenses',
    navReports: 'Reports',
    navSettings: 'Settings',

    // Quick Stats
    todayProduction: 'Aaj ka Production',
    vsYesterday: 'kal se comparison',
    activeMachines: 'Chalu Machines',
    yieldPct: 'Yield %',
    wastePct: 'Waste %',
    karigarPending: 'Karigar ke paas maal',
    overdueWarning: '15 din se zyada pending',
    receivables: 'Total Lena Baaki',
    lowStockAlerts: 'Low Stock Warning',
    waitingOrders: 'Stock ke intezaar mein Orders',
    grossProfit: 'Gross Munafa (Profit)',

    // Common Actions
    save: 'Save Karein',
    saving: 'Save ho raha hai...',
    cancel: 'Cancel',
    edit: 'Edit Karein',
    delete: 'Delete',
    reverse: 'Reverse Movement',
    filter: 'Filter',
    search: 'Dhoondein...',
    exportExcel: 'Excel Download',
    exportPdf: 'PDF Download',
    printSlip: 'Slip Print',
    shareWhatsApp: 'WhatsApp pe bhejein',
    confirm: 'Confirm Karein',
    offlineNotice: 'Offline Mode — Entries phone mein safe hain',
    syncPending: 'Sync Pending',
    syncNow: 'Sync Karein',

    // Roles
    roleAdmin: 'Maalik / Admin',
    roleManager: 'Unit Manager',
    roleStaff: 'Machine Operator (Staff)',

    // Fast entry mode
    fastEntryBanner: 'Operator Fast-Entry: 30 second mein machine ka hisaab dalein',
    selectMachine: 'Machine Select Karein',
    gppsUsed: 'GPPS Used (KG)',
    goodBeads: 'Good Beads (KG)',
    wasteKg: 'Waste (KG)',
    regrindKg: 'Regrind Reused (KG)',
    bagsPacked: 'Bags Packed (25kg)',

    // Karigar
    sendToKarigar: 'Karigar ko maal bhejein',
    receiveFromKarigar: 'Karigar se maal receive karein',
    bunchesReturned: 'Bunches Wapas Aaye',
    looseReturned: 'Loose Wapas Aaya (KG)',
    scrapWastage: 'Waste (KG)',
    daysOut: 'Kitne Din Huye',

    // Orders & Billing
    newOrder: 'Naya Order',
    generateInvoice: 'Bill Banayein',
    gstTaxInvoice: 'GST Tax Invoice',
    kachchaBill: 'Kachcha Bill (Estimate)',
    dispatchItems: 'Maal Dispatch Karein',
    recordPayment: 'Payment Jama Karein',
    creditLimitWarning: 'Party ka credit limit cross ho gaya! Admin approval chahiye.'
  }
};
