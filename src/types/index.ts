// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Plant {
  id: string;
  userId: string;
  name: string;
  location: string;
  mqttTopicId: string; // Ex: 'plant_123'
}
