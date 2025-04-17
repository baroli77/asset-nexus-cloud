
import { User } from "../components/users/UserTable";
import { v4 as uuidv4 } from 'uuid';

// Initial mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    dateCreated: "2024-03-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
    status: "Active",
    dateCreated: "2024-03-20",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
    dateCreated: "2024-04-01",
  },
];

// Helper to simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Load users from localStorage or use mock data if none exists
export const getUsers = async (): Promise<User[]> => {
  await delay(500); // Simulate network request
  
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  
  // Initialize with mock data if no users exist
  localStorage.setItem('users', JSON.stringify(mockUsers));
  return mockUsers;
};

// Create a new user
export const createUser = async (userData: Omit<User, "id" | "dateCreated">): Promise<User> => {
  await delay(500); // Simulate network request
  
  const storedUsers = localStorage.getItem('users');
  const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
  
  const newUser: User = {
    ...userData,
    id: uuidv4(),
    dateCreated: new Date().toISOString().split('T')[0],
  };
  
  const updatedUsers = [...users, newUser];
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  return newUser;
};

// Update an existing user
export const updateUser = async (userId: string, userData: Omit<User, "id" | "dateCreated">): Promise<User> => {
  await delay(500); // Simulate network request
  
  const storedUsers = localStorage.getItem('users');
  const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
  
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  const updatedUser: User = {
    ...users[userIndex],
    ...userData,
  };
  
  users[userIndex] = updatedUser;
  localStorage.setItem('users', JSON.stringify(users));
  
  return updatedUser;
};

// Delete a user
export const deleteUser = async (userId: string): Promise<void> => {
  await delay(500); // Simulate network request
  
  const storedUsers = localStorage.getItem('users');
  const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
  
  const updatedUsers = users.filter(user => user.id !== userId);
  localStorage.setItem('users', JSON.stringify(updatedUsers));
};
