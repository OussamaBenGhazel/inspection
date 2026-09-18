const API_BASE_URL = '/api';

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = options.headers ? { ...options.headers } : {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, {
    ...options,
    headers
  });
};

export const apiService = {
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      throw new Error(await res.text() || 'خطأ في تسجيل الدخول');
    }
    const data = await res.json();

    // Record login audit event with token asynchronously (fire-and-forget) to speed up login process
    fetch(`${API_BASE_URL}/audit-logs?action=تسجيل الدخول&message=قام المستخدم بالولوج إلى لوحة التحكم الرئيسية نجاح&username=${username}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${data.token}` }
    }).catch(err => console.warn('Async audit logging failed:', err));

    return data;
  },

  getEnseignants: async () => {
    const res = await authFetch(`${API_BASE_URL}/enseignants`);
    if (!res.ok) throw new Error('Failed to load teachers');
    return res.json();
  },

  createEnseignant: async (data) => {
    const res = await authFetch(`${API_BASE_URL}/enseignants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create teacher');
    return res.json();
  },

  updateEnseignant: async (id, data) => {
    const res = await authFetch(`${API_BASE_URL}/enseignants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update teacher');
    return res.json();
  },

  deleteEnseignant: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/enseignants/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete teacher');
    return true;
  },

  getInspections: async () => {
    const res = await authFetch(`${API_BASE_URL}/inspections`);
    if (!res.ok) throw new Error('Failed to load inspections');
    return res.json();
  },

  getRecentInspections: async () => {
    const res = await authFetch(`${API_BASE_URL}/inspections/recent`);
    if (!res.ok) throw new Error('Failed to load recent inspections');
    return res.json();
  },

  getInspectionDetails: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/inspections/${id}`);
    if (!res.ok) throw new Error('Failed to load inspection details');
    const inspection = await res.json();

    // fetch evaluations and pieces as well
    const evsRes = await authFetch(`${API_BASE_URL}/inspections/${id}/evaluations`);
    const evs = evsRes.ok ? await evsRes.json() : [];

    const piecesRes = await authFetch(`${API_BASE_URL}/inspections/${id}/pieces`);
    const pieces = piecesRes.ok ? await piecesRes.json() : [];

    return { ...inspection, evaluations: evs, pieces };
  },

  createInspection: async (dto) => {
    const res = await authFetch(`${API_BASE_URL}/inspections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to create inspection');
    return res.json();
  },

  updateInspection: async (id, dto) => {
    const res = await authFetch(`${API_BASE_URL}/inspections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to update inspection');
    return res.json();
  },

  deleteInspection: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/inspections/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to delete inspection');
    return true;
  },

  uploadPieceJointe: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await authFetch(`${API_BASE_URL}/inspections/${id}/pieces`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to upload piece jointe');
    return res.json();
  },

  getAuditLogs: async () => {
    const res = await authFetch(`${API_BASE_URL}/audit-logs`);
    if (!res.ok) throw new Error('Failed to load audit logs');
    return res.json();
  },

  getDashboardStats: async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/dashboard/stats`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Dashboard stats fallback:', e);
    }
    const resFallback = await authFetch(`${API_BASE_URL}/inspections/dashboard-stats`);
    if (!resFallback.ok) throw new Error('Failed to load dashboard statistics');
    return resFallback.json();
  },

  getTeacherProfile: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/enseignants/${id}/profile`);
    if (!res.ok) throw new Error('Failed to load teacher profile');
    return res.json();
  },

  getPedagogyCompetencies: async (inspectionId = null) => {
    const query = inspectionId ? `?inspectionId=${inspectionId}` : '';
    const res = await authFetch(`${API_BASE_URL}/pedagogy/competencies${query}`);
    if (!res.ok) throw new Error('Failed to load competencies');
    return res.json();
  },

  getPedagogyRecommendations: async (teacherId = null) => {
    const query = teacherId ? `?enseignantId=${teacherId}` : '';
    const res = await authFetch(`${API_BASE_URL}/pedagogy/recommendations${query}`);
    if (!res.ok) throw new Error('Failed to load recommendations');
    return res.json();
  },

  getPedagogyIndicators: async (teacherId = null) => {
    const query = teacherId ? `?enseignantId=${teacherId}` : '';
    const res = await authFetch(`${API_BASE_URL}/pedagogy/indicators${query}`);
    if (!res.ok) throw new Error('Failed to load indicators');
    return res.json();
  },

  getPedagogyGrowthPlans: async (teacherId = null) => {
    const query = teacherId ? `?enseignantId=${teacherId}` : '';
    const res = await authFetch(`${API_BASE_URL}/pedagogy/growth-plans${query}`);
    if (!res.ok) throw new Error('Failed to load growth plans');
    return res.json();
  },

  getPedagogyDiagnostic: async (inspectionId = null) => {
    const query = inspectionId ? `?inspectionId=${inspectionId}` : '';
    const res = await authFetch(`${API_BASE_URL}/pedagogy/diagnostic${query}`);
    if (!res.ok) throw new Error('Failed to load diagnostic');
    return res.json();
  },

  getNotifications: async () => {
    const res = await authFetch(`${API_BASE_URL}/notifications`);
    if (!res.ok) throw new Error('Failed to load notifications');
    return res.json();
  },

  getUnreadNotificationsCount: async () => {
    const res = await authFetch(`${API_BASE_URL}/notifications/unread/count`);
    if (!res.ok) throw new Error('Failed to load unread count');
    return res.json();
  },

  markNotificationAsRead: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to mark notification as read');
    return res.json();
  },

  updateIndicator: async (id, data) => {
    const res = await authFetch(`${API_BASE_URL}/pedagogy/indicators/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update indicator');
    return res.json();
  },

  updateRecommendation: async (id, data) => {
    const res = await authFetch(`${API_BASE_URL}/pedagogy/recommendations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update recommendation');
    return res.json();
  },

  saveDiagnostic: async (data) => {
    const res = await authFetch(`${API_BASE_URL}/pedagogy/diagnostic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save diagnostic');
    return res.json();
  },

  saveGrowthPlan: async (data) => {
    const res = await authFetch(`${API_BASE_URL}/pedagogy/growth-plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save growth plan');
    return res.json();
  },

  getSystemUsers: async () => {
    const res = await authFetch(`${API_BASE_URL}/audit-logs/users`);
    if (!res.ok) throw new Error('Failed to load system users');
    return res.json();
  },

  getRolesSummary: async () => {
    const res = await authFetch(`${API_BASE_URL}/audit-logs/roles-summary`);
    if (!res.ok) throw new Error('Failed to load roles summary');
    return res.json();
  },

  downloadInspectionPdf: async (id, filename) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/inspections/${id}/report`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('فشل في توليد تقرير PDF المعتمد');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `rapport-inspection-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      a.remove();
    }, 1500);
  },

  downloadInspectionExcel: async (id, filename) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/inspections/${id}/excel`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('فشل في تصدير جدول Excel المعتمد');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `rapport-inspection-${id}.xlsx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      a.remove();
    }, 1500);
  }
};

