export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const users: User[] = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    password: "password123",
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
    password: "secretBob",
  },
  {
    id: "3",
    name: "Charlie",
    email: "charlie@example.com",
    password: "charliePass",
  },
];

export const addUser = (user: User) => {
  // Look for an existing user
  const existingUser = findUserByEmailPassword(user.email, user.password);
  if (!existingUser) {
    users.push(user);
  }
};
export const findUser = (id: string) => {
  return users.find((u) => u.id === id);
};
export const findUserByEmailPassword = (email: string, password: string) => {
  return users.find((u) => u.email === email && u.password === password);
};
export const deleteUser = (userId: string) => {
  const index = users.findIndex((u) => u.id === userId);
  if (index > -1) {
    users.splice(index, 1);
  }
};
