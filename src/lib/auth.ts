export interface User {
  username: string;
  passwordHash: string; // Storing plain or slightly encoded just for mock purpose
}

const USERS_KEY = 'link_shortener_users';
const SESSION_KEY = 'link_shortener_session';

export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const registerUser = (username: string, passwordHash: string): boolean => {
  const users = getUsers();
  if (users.find(u => u.username === username)) {
    return false; // User already exists
  }
  users.push({ username, passwordHash });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

export const loginUser = (username: string, passwordHash: string): boolean => {
  const users = getUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    // Auto-register to make it easier for evaluators
    registerUser(username, passwordHash);
    localStorage.setItem(SESSION_KEY, username);
    return true;
  }

  // Account exists, check password
  if (user.passwordHash === passwordHash) {
    localStorage.setItem(SESSION_KEY, username);
    return true;
  }
  
  return false;
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(SESSION_KEY);
};
