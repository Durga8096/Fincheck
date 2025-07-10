const API_BASE = '/api';

// --- Auth ---
export async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function apiRegister(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

// --- Profile ---
export async function apiGetProfile(token) {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function apiUpdateProfile(profile, token) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function apiUploadAvatar(avatar, token) {
  const res = await fetch(`${API_BASE}/profile/avatar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ avatar }),
  });
  if (!res.ok) throw new Error('Failed to upload avatar');
  return res.json();
}

// --- Transactions ---
export async function apiGetTransactions(token) {
  const res = await fetch(`${API_BASE}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function apiAddTransaction(data, token) {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add transaction');
  return res.json();
}

export async function apiUpdateTransaction(id, data, token) {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update transaction');
  return res.json();
}

export async function apiDeleteTransaction(id, token) {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete transaction');
  return res.json();
}

// --- Budgets ---
export async function apiGetBudgets(token) {
  const res = await fetch(`${API_BASE}/budgets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch budgets');
  return res.json();
}

export async function apiAddBudget(data, token) {
  const res = await fetch(`${API_BASE}/budgets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add budget');
  return res.json();
}

export async function apiUpdateBudget(id, data, token) {
  const res = await fetch(`${API_BASE}/budgets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update budget');
  return res.json();
}

export async function apiDeleteBudget(id, token) {
  const res = await fetch(`${API_BASE}/budgets/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete budget');
  return res.json();
} 