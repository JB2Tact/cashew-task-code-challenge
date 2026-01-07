export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

// Mock users for testing
export const MOCK_USERS = {
  alice: { id: '1', name: 'Alice', email: 'alice@example.com', avatar: '/avatars/alice.svg' },
  bob: { id: '2', name: 'Bob', email: 'bob@example.com', avatar: '/avatars/bob.svg' },
  charlie: { id: '3', name: 'Charlie', email: 'charlie@example.com', avatar: '/avatars/charlie.svg' },
  diana: { id: '4', name: 'Diana', email: 'diana@example.com', avatar: '/avatars/diana.svg' },
} as const;

export type MockUserKey = keyof typeof MOCK_USERS;

