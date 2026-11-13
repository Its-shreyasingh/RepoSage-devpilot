const API_BASE = '/api';

export async function getAuthMe() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch user auth profile (${res.status})`);
    }
    return await res.json();
  } catch (error) {
    console.error('getAuthMe error:', error);
    return {
      authenticated: false,
      demoMode: true,
      username: 'guest-developer',
      name: 'Guest Developer',
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
      email: 'guest@reposage.local',
    };
  }
}

export async function ingestRepo(payload) {
  const res = await fetch(`${API_BASE}/repos/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Ingest failed with status ${res.status}`);
  }
  return data;
}

export async function askQuestion(payload) {
  const res = await fetch(`${API_BASE}/repos/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Ask failed with status ${res.status}`);
  }
  return data;
}

export async function reviewCode(payload) {
  const res = await fetch(`${API_BASE}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Review failed with status ${res.status}`);
  }
  return data;
}

export async function getIndexedRepos() {
  try {
    const res = await fetch(`${API_BASE}/repos`, {
      credentials: 'include',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error('getIndexedRepos error:', e);
    return [];
  }
}

export async function deleteRepo(repoName) {
  const res = await fetch(`${API_BASE}/repos/${encodeURIComponent(repoName)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return await res.json();
}

export function getGitHubLoginUrl() {
  return '/oauth2/authorization/github';
}

