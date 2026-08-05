const API_BASE_URL = '/api';

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
    return res.json();
  },

  getEnseignants: async () => {
    const res = await fetch(`${API_BASE_URL}/enseignants`);
    if (!res.ok) throw new Error('Failed to load teachers');
    return res.json();
  },

  getInspections: async () => {
    const res = await fetch(`${API_BASE_URL}/inspections`);
    if (!res.ok) throw new Error('Failed to load inspections');
    return res.json();
  },

  getRecentInspections: async () => {
    const res = await fetch(`${API_BASE_URL}/inspections/recent`);
    if (!res.ok) throw new Error('Failed to load recent inspections');
    return res.json();
  },

  getInspectionDetails: async (id) => {
    const res = await fetch(`${API_BASE_URL}/inspections/${id}`);
    if (!res.ok) throw new Error('Failed to load inspection details');
    const inspection = await res.json();

    // fetch evaluations and pieces as well
    const evsRes = await fetch(`${API_BASE_URL}/inspections/${id}/evaluations`);
    const evs = evsRes.ok ? await evsRes.json() : [];

    const piecesRes = await fetch(`${API_BASE_URL}/inspections/${id}/pieces`);
    const pieces = piecesRes.ok ? await piecesRes.json() : [];

    return { ...inspection, evaluations: evs, pieces };
  },

  createInspection: async (dto) => {
    const res = await fetch(`${API_BASE_URL}/inspections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to create inspection');
    return res.json();
  },

  updateInspection: async (id, dto) => {
    const res = await fetch(`${API_BASE_URL}/inspections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to update inspection');
    return res.json();
  },

  deleteInspection: async (id) => {
    const res = await fetch(`${API_BASE_URL}/inspections/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to delete inspection');
    return true;
  },

  uploadPieceJointe: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/inspections/${id}/pieces`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to upload piece jointe');
    return res.json();
  }
};
