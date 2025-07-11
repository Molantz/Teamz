// API utility functions for CRUD operations

const API_BASE = '/api'

// Generic fetch wrapper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }
  
  return response.json()
}

// Users API
export const usersApi = {
  getAll: () => apiRequest('/users'),
  create: (data: any) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
}

// Devices API
export const devicesApi = {
  getAll: () => apiRequest('/devices'),
  create: (data: any) => apiRequest('/devices', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/devices/${id}`, {
    method: 'DELETE',
  }),
}

// Incidents API
export const incidentsApi = {
  getAll: () => apiRequest('/incidents'),
  create: (data: any) => apiRequest('/incidents', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/incidents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/incidents/${id}`, {
    method: 'DELETE',
  }),
}

// Requests API
export const requestsApi = {
  getAll: () => apiRequest('/requests'),
  create: (data: any) => apiRequest('/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/requests/${id}`, {
    method: 'DELETE',
  }),
}

// Projects API
export const projectsApi = {
  getAll: () => apiRequest('/projects'),
  create: (data: any) => apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/projects/${id}`, {
    method: 'DELETE',
  }),
}

// Departments API
export const departmentsApi = {
  getAll: () => apiRequest('/departments'),
  create: (data: any) => apiRequest('/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/departments/${id}`, {
    method: 'DELETE',
  }),
} 