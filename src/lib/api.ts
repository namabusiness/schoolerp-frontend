const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit & { demoRole?: string; schoolId?: string } = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const activeRole = typeof window !== 'undefined' ? localStorage.getItem('demo_role') : options.demoRole;
  let activeSchoolId = typeof window !== 'undefined' ? localStorage.getItem('school_id') : options.schoolId;
  if (activeSchoolId === 'greenwood-high') {
    activeSchoolId = 'school-greenwood-high';
  }

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
  setupPassword: (userId: string, password: string) =>
    fetchApi('/auth/setup-password', { method: 'POST', body: JSON.stringify({ userId, password }) }),

  // Super Admin Platform
  getPlatformStats: () => fetchApi('/super-admin/stats'),
  getSchools: (status?: string, search?: string) =>
    fetchApi(`/super-admin/schools?${new URLSearchParams({ ...(status && { status }), ...(search && { search }) })}`),
  createSchool: (data: any) => fetchApi('/super-admin/schools', { method: 'POST', body: JSON.stringify(data) }),
  getSchoolAdmins: () => fetchApi('/super-admin/administrators'),
  getPlatformUsers: (role?: string, schoolId?: string) =>
    fetchApi(`/super-admin/users?${new URLSearchParams({ ...(role && { role }), ...(schoolId && { schoolId }) })}`),
  setupUserAccess: (data: any) => fetchApi('/super-admin/users/setup-access', { method: 'POST', body: JSON.stringify(data) }),
  toggleUserStatus: (id: string, isActive: boolean) =>
    fetchApi(`/super-admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  createSupportSession: (schoolId: string, reason: string) =>
    fetchApi('/super-admin/support-session', { method: 'POST', body: JSON.stringify({ schoolId, reason }) }),
  getAuditLogs: (params?: any) => fetchApi('/super-admin/audit-logs', { method: 'GET' }),
  getPlans: () => fetchApi('/super-admin/plans'),


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
  getMonthlyAttendanceMatrix: (sectionId: string, year?: number, month?: number) => {
    const params = new URLSearchParams();
    params.set('sectionId', sectionId);
    if (year) params.set('year', year.toString());
    if (month) params.set('month', month.toString());
    return fetchApi(`/attendance/monthly-matrix?${params.toString()}`);
  },

  // Homework
  getHomeworks: (params?: { classId?: string; sectionId?: string; subjectId?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return fetchApi(`/homework${query}`);
  },
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
  getQuestionPapers: (params?: { classId?: string; subjectId?: string; teacherId?: string; category?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return fetchApi(`/examinations/question-papers${query}`);
  },
  createQuestionPaper: (data: any) =>
    fetchApi('/examinations/question-papers', { method: 'POST', body: JSON.stringify(data) }),
  deleteQuestionPaper: (id: string) =>
    fetchApi(`/examinations/question-papers/${id}`, { method: 'DELETE' }),
  enrollClassMarks: (data: any) =>
    fetchApi('/examinations/enroll-marks', { method: 'POST', body: JSON.stringify(data) }),


  // Fees & Finance
  getFinanceSummary: () => fetchApi('/fees/summary'),
  getInvoices: () => fetchApi('/fees/invoices'),
  recordFeePayment: (data: any) => fetchApi('/fees/payments', { method: 'POST', body: JSON.stringify(data) }),

  // Transport & Fleet Management
  getDrivers: () => fetchApi('/transport/drivers'),
  createDriver: (data: any) => fetchApi('/transport/drivers', { method: 'POST', body: JSON.stringify(data) }),
  deleteDriver: (id: string) => fetchApi(`/transport/drivers/${id}`, { method: 'DELETE' }),
  getVehicles: () => fetchApi('/transport/vehicles'),
  createVehicle: (data: any) => fetchApi('/transport/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  deleteVehicle: (id: string) => fetchApi(`/transport/vehicles/${id}`, { method: 'DELETE' }),
  getRoutes: () => fetchApi('/transport/routes'),
  createRoute: (data: any) => fetchApi('/transport/routes', { method: 'POST', body: JSON.stringify(data) }),
  deleteRoute: (id: string) => fetchApi(`/transport/routes/${id}`, { method: 'DELETE' }),
  addRouteStop: (routeId: string, data: any) =>
    fetchApi(`/transport/routes/${routeId}/stops`, { method: 'POST', body: JSON.stringify(data) }),
  deleteRouteStop: (routeId: string, stopId: string) =>
    fetchApi(`/transport/routes/${routeId}/stops/${stopId}`, { method: 'DELETE' }),
  assignStudent: (data: { studentId: string; routeId: string; stopId: string }) =>
    fetchApi('/transport/assign-student', { method: 'POST', body: JSON.stringify(data) }),
  unassignStudent: (studentId: string) =>
    fetchApi(`/transport/unassign-student/${studentId}`, { method: 'DELETE' }),
  updateRouteIncharge: (routeId: string, inchargeStaffId: string | null) =>
    fetchApi(`/transport/routes/${routeId}/incharge`, { method: 'PATCH', body: JSON.stringify({ inchargeStaffId }) }),
  getTrips: () => fetchApi('/transport/trips'),
  logTrip: (data: any) => fetchApi('/transport/trips', { method: 'POST', body: JSON.stringify(data) }),

  // HR & Staff / Faculty
  getStaff: (departmentId?: string) => fetchApi(`/hr/staff${departmentId ? `?departmentId=${departmentId}` : ''}`),
  addStaff: (data: any) => fetchApi('/hr/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id: string, data: any) => fetchApi(`/hr/staff/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteStaff: (id: string) => fetchApi(`/hr/staff/${id}`, { method: 'DELETE' }),
  getDepartments: () => fetchApi('/hr/departments'),
  createDepartment: (name: string) => fetchApi('/hr/departments', { method: 'POST', body: JSON.stringify({ name }) }),
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

  // Academics, Classes, Teachers & Student Roster
  getAcademicYears: () => fetchApi('/academics/years'),
  createAcademicYear: (data: any) => fetchApi('/academics/years', { method: 'POST', body: JSON.stringify(data) }),
  getClasses: () => fetchApi('/academics/classes'),
  createClass: (data: { name: string; code: string; classTeacherId?: string; initialSections?: string[] }) =>
    fetchApi('/academics/classes', { method: 'POST', body: JSON.stringify(data) }),
  deleteClass: (id: string) => fetchApi(`/academics/classes/${id}`, { method: 'DELETE' }),
  createSection: (classId: string, data: { name: string; capacity?: number; classTeacherId?: string }) =>
    fetchApi(`/academics/classes/${classId}/sections`, { method: 'POST', body: JSON.stringify(data) }),
  deleteSection: (classId: string, sectionId: string) =>
    fetchApi(`/academics/classes/${classId}/sections/${sectionId}`, { method: 'DELETE' }),
  assignClassTeacher: (classId: string, teacherId: string | null) =>
    fetchApi(`/academics/classes/${classId}/teacher`, { method: 'PATCH', body: JSON.stringify({ teacherId }) }),
  assignSectionTeacher: (sectionId: string, teacherId: string | null) =>
    fetchApi(`/academics/sections/${sectionId}/teacher`, { method: 'PATCH', body: JSON.stringify({ teacherId }) }),
  getClassStudents: (classId: string, sectionId?: string) =>
    fetchApi(`/academics/classes/${classId}/students${sectionId && sectionId !== 'ALL' ? `?sectionId=${sectionId}` : ''}`),
  getUnassignedStudents: () =>
    fetchApi('/academics/unassigned-students'),
  assignStudentToClass: (data: { studentId: string; classId: string; sectionId: string; rollNumber?: string }) =>
    fetchApi('/academics/assign-student', { method: 'POST', body: JSON.stringify(data) }),
  unassignStudentFromClass: (studentId: string) =>
    fetchApi(`/academics/unassign-student/${studentId}`, { method: 'POST' }),
  getSubjects: (classId?: string) =>
    fetchApi(`/academics/subjects${classId ? `?classId=${classId}` : ''}`),
  createSubject: (data: any) =>
    fetchApi('/academics/subjects', { method: 'POST', body: JSON.stringify(data) }),
  assignSubjectTeacher: (subjectId: string, teacherId: string | null) =>
    fetchApi(`/academics/subjects/${subjectId}/teacher`, { method: 'PATCH', body: JSON.stringify({ teacherId }) }),
  deleteSubject: (subjectId: string) =>
    fetchApi(`/academics/subjects/${subjectId}`, { method: 'DELETE' }),
  getTimetable: (params: any) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/academics/timetable?${query}`);
  },
  createTimetableSlot: (data: any) =>
    fetchApi('/academics/timetable', { method: 'POST', body: JSON.stringify(data) }),
  generateTimetable: (data: any) =>
    fetchApi('/academics/timetable/generate', { method: 'POST', body: JSON.stringify(data) }),
  approveTimetable: (data: { classId: string; sectionId?: string }) =>
    fetchApi('/academics/timetable/approve', { method: 'POST', body: JSON.stringify(data) }),
  getFacultyTimetable: (teacherId: string) =>
    fetchApi(`/academics/timetable/faculty/${teacherId}`),
  updateTimetableSlot: (id: string, data: any) =>
    fetchApi(`/academics/timetable/slot/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  resetClassTimetable: (classId: string, sectionId?: string) =>
    fetchApi(`/academics/timetable/class/${classId}${sectionId && sectionId !== 'ALL' ? `?sectionId=${sectionId}` : ''}`, { method: 'DELETE' }),
};
