// src/services/userService.ts
import { User } from "../types";

// Mock DB
const users: User[] = [
  { id: "user_1", name: "Usuário Teste", email: "teste@exemplo.com" },
];

export const userService = {
  login: (email: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        resolve(user || null);
      }, 500);
    });
  },

  register: (name: string, email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          reject(new Error("Este e-mail já está em uso."));
          return;
        }
        const newUser: User = {
          id: `user_${Date.now()}`,
          name,
          email,
        };
        users.push(newUser);
        resolve(newUser);
      }, 500);
    });
  },
};
