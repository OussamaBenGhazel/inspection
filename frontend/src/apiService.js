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

    // Record login audit event with token
    try {
      await fetch(`${API_BASE_URL}/audit-logs?action=تسجيل الدخول&message=قام المستخدم بالولوج إلى لوحة التحكم الرئيسية نجاح&username=${username}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
    } catch (e) {}

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
    const res = await authFetch(`${API_BASE_URL}/inspections/dashboard-stats`);
    if (!res.ok) throw new Error('Failed to load dashboard statistics');
    return res.json();
  }
};
