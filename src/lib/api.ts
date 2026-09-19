const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit & { demoRole?: string; schoolId?: string } = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const activeRole = typeof window !== 'undefined' ? localStorage.getItem('demo_role') : options.demoRole;
  const activeSchoolId = typeof window !== 'undefined' ? localStorage.getItem('school_id') : options.schoolId;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (activeRole) {
    headers['x-demo-role'] = activeRole;
  }
  if (activeSchoolId) {
    headers['x-school-id'] = activeSchoolId;
    headers['x-demo-school-id'] = activeSchoolId;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'API request failed');
    }

    return res.json();
  } catch (error: any) {
    console.warn(`[API Notice] ${endpoint} fetch error (${error.message}).`);
    throw error;
  }
}

// -------------------------------------------------------------
// TYPED API CLIENT FOR ALL 30 ERP FLOWS
// -------------------------------------------------------------

export const erpApi = {
  // Auth & Session
  login: (email: string, password?: string, demoRole?: string) =>
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, demoRole }) }),
  getProfile: () => fetchApi('/auth/me'),

  // Super Admin Platform
  getPlatformStats: () => fetchApi('/super-admin/stats'),
  getSchools: (status?: string, search?: string) =>
    fetchApi(`/super-admin/schools?${new URLSearchParams({ ...(status && { status }), ...(search && { search }) })}`),
  createSchool: (data: any) => fetchApi('/super-admin/schools', { method: 'POST', body: JSON.stringify(data) }),
  getSchoolAdmins: () => fetchApi('/super-admin/administrators'),
  createSupportSession: (schoolId: string, reason: string) =>
    fetchApi('/super-admin/support-session', { method: 'POST', body: JSON.stringify({ schoolId, reason }) }),
  getAuditLogs: (params?: any) => fetchApi('/super-admin/audit-logs', { method: 'GET' }),
  getPlans: () => fetchApi('/super-admin/plans'),

  // Academics
  getClasses: () => fetchApi('/academics/classes'),
  createClass: (data: any) => fetchApi('/academics/classes', { method: 'POST', body: JSON.stringify(data) }),
  getTimetable: (params?: any) => fetchApi(`/academics/timetable?${new URLSearchParams(params || {})}`),

  // Admissions
  getEnquiries: () => fetchApi('/admissions/enquiries'),
  createEnquiry: (data: any) => fetchApi('/admissions/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  getApplications: () => fetchApi('/admissions/applications'),
  getApplication: (id: string) => fetchApi(`/admissions/applications/${id}`),
  submitApplication: (data: any) => fetchApi('/admissions/applications', { method: 'POST', body: JSON.stringify(data) }),
  uploadApplicationDocument: (id: string, data: any) =>
    fetchApi(`/admissions/applications/${id}/documents`, { method: 'POST', body: JSON.stringify(data) }),
  decideAdmission: (id: string, decision: string, enrollmentData?: any) =>
    fetchApi(`/admissions/applications/${id}/decision`, { method: 'POST', body: JSON.stringify({ decision, enrollmentData }) }),

  // Students 360
  getStudents: (params?: any) => fetchApi(`/students?${new URLSearchParams(params || {})}`),
  getStudent360: (studentId: string) => fetchApi(`/students/${studentId}/360`),
  uploadStudentDocument: (studentId: string, data: any) =>
    fetchApi(`/students/${studentId}/documents`, { method: 'POST', body: JSON.stringify(data) }),

  // Daily Ops & Attendance
  getDailyOverview: () => fetchApi('/daily-ops/overview'),
  createSubstitution: (data: any) => fetchApi('/daily-ops/substitutions', { method: 'POST', body: JSON.stringify(data) }),
  getAttendanceSession: (sectionId: string, date: string) =>
    fetchApi(`/attendance/session?sectionId=${sectionId}&date=${date}`),
  submitAttendance: (sessionId: string, records: any[], lockSession?: boolean) =>
    fetchApi('/attendance/submit', { method: 'POST', body: JSON.stringify({ sessionId, records, lockSession }) }),

  // Homework
  getHomeworks: () => fetchApi('/homework'),
  createHomework: (data: any) => fetchApi('/homework', { method: 'POST', body: JSON.stringify(data) }),
  submitHomework: (id: string, data: any) => fetchApi(`/homework/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  gradeHomework: (submissionId: string, grade: string, feedback: string) =>
    fetchApi(`/homework/submissions/${submissionId}/grade`, { method: 'PATCH', body: JSON.stringify({ grade, feedback }) }),

  // Examinations
  getExams: () => fetchApi('/examinations'),
  createExam: (data: any) => fetchApi('/examinations', { method: 'POST', body: JSON.stringify(data) }),
  submitExamMarks: (scheduleId: string, marks: any[]) =>
    fetchApi(`/examinations/schedules/${scheduleId}/marks`, { method: 'POST', body: JSON.stringify({ marks }) }),
  generateReportCards: (examId: string, classId: string) =>
    fetchApi(`/examinations/${examId}/generate-report-cards`, { method: 'POST', body: JSON.stringify({ classId }) }),
  getReportCard: (studentId: string, examId: string) =>
    fetchApi(`/examinations/report-card/${studentId}?examId=${examId}`),

  // Fees & Finance
  getFinanceSummary: () => fetchApi('/fees/summary'),
  getInvoices: () => fetchApi('/fees/invoices'),
  recordFeePayment: (data: any) => fetchApi('/fees/payments', { method: 'POST', body: JSON.stringify(data) }),

  // Transport
  getVehicles: () => fetchApi('/transport/vehicles'),
  getRoutes: () => fetchApi('/transport/routes'),
  getTrips: () => fetchApi('/transport/trips'),

  // Library
  getBooks: (search?: string) => fetchApi(`/library/catalogue${search ? `?search=${search}` : ''}`),
  getLoans: () => fetchApi('/library/loans'),
  issueBook: (data: any) => fetchApi('/library/issue', { method: 'POST', body: JSON.stringify(data) }),
  returnBook: (loanId: string) => fetchApi(`/library/loans/${loanId}/return`, { method: 'POST' }),

  // Communication
  getAnnouncements: () => fetchApi('/communication/announcements'),
  createAnnouncement: (data: any) => fetchApi('/communication/announcements', { method: 'POST', body: JSON.stringify(data) }),

  // HR & Staff
  getStaff: () => fetchApi('/hr/staff'),
  getLeaves: () => fetchApi('/hr/leaves'),
  applyLeave: (data: any) => fetchApi('/hr/leaves', { method: 'POST', body: JSON.stringify(data) }),
  runPayroll: (month: number, year: number) =>
    fetchApi('/hr/payrolls/run', { method: 'POST', body: JSON.stringify({ month, year }) }),

  // Inventory
  getAssets: () => fetchApi('/inventory/assets'),
  getPurchaseRequests: () => fetchApi('/inventory/requests'),

  // Events
  getEvents: () => fetchApi('/events'),
  createEvent: (data: any) => fetchApi('/events', { method: 'POST', body: JSON.stringify(data) }),

  // Health & Incidents
  getIncidents: () => fetchApi('/health/incidents'),
  logIncident: (data: any) => fetchApi('/health/incidents', { method: 'POST', body: JSON.stringify(data) }),

  // Certificates
  getCertificates: () => fetchApi('/certificates'),
  issueCertificate: (data: any) => fetchApi('/certificates/issue', { method: 'POST', body: JSON.stringify(data) }),

  // Promotion
  getClearance: (studentId: string) => fetchApi(`/promotion/clearance/${studentId}`),
  processPromotion: (data: any) => fetchApi('/promotion/process', { method: 'POST', body: JSON.stringify(data) }),
};
