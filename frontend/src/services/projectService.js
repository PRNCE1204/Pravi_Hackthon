import api from './api';

export const getProjects = async () => {
  const res = await api.get('/projects');
  return res.data;
};

export const createProject = async (data) => {
  const res = await api.post('/projects', data);
  return res.data;
};

export const uploadTender = async (id, formData) => {
  const res = await api.put(`/projects/${id}/tender-submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const approveTender = async (id) => {
  const res = await api.put(`/projects/${id}/tender-approve`);
  return res.data;
};

export const submitBid = async (id, formData) => {
  const res = await api.post(`/projects/${id}/bids`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const selectBid = async (projectId, bidId) => {
  const res = await api.put(`/projects/${projectId}/bids/${bidId}/select`);
  return res.data;
};

export const approveContractor = async (projectId, bidId) => {
  const res = await api.put(`/projects/${projectId}/bids/${bidId}/approve`);
  return res.data;
};
