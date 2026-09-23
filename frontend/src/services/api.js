import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60 seconds for LLM calls
});

export async function queryDatabase(question) {
  const response = await api.post('/query', { question });
  return response.data;
}

export const executeRawSql = async (sql) => {
  const response = await api.post('/query/execute-sql', { sql });
  return response.data;
};

export const analyzeResearch = async (query) => {
  const response = await api.post('/research/analyze', { query });
  return response.data;
};

export const executeSearch = async (query, plan_steps = []) => {
  const response = await api.post('/research/execute', { query, plan_steps });
  return response.data;
};

export const getSchema = async () => {
  const response = await api.get('/schema');
  return response.data;
};

export async function getQueryHistory() {
  const response = await api.get('/history');
  return response.data;
}

export async function explainSQL(sql, question) {
  const response = await api.post('/explain', { sql, question });
  return response.data;
}

export async function getSuggestions() {
  const response = await api.get('/suggestions');
  return response.data;
}

export async function exportCSV(columns, rows, filename = 'query_results') {
  const response = await api.post('/export/csv', { columns, rows, filename }, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function clearHistory() {
  const response = await api.delete('/history');
  return response.data;
}

export default api;

