const API_URL = import.meta.env.PROD 
  ? '/api/v1' 
  : 'http://localhost:8080/api/v1';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Event {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  date: string;
  location: string;
}

export interface Attendee {
  id: number;
  userId: number;
  eventId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  token: string;
}

// Helper function for making authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  
  const response = await fetch(`${API_URL}${url}`, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(error.error || 'An unknown error occurred');
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

// Authentication APIs
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to login' }));
    throw new Error(error.error || 'Failed to login');
  }
  
  return response.json();
};

export const registerUser = async (userData: RegisterRequest): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to register' }));
    throw new Error(error.error || 'Failed to register');
  }
  
  return response.json();
};

// Event APIs
export const getEvents = async (): Promise<Event[]> => {
  return authFetch('/events');
};

export const getEvent = async (id: number): Promise<Event> => {
  return authFetch(`/events/${id}`);
};

export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  return authFetch('/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });
};

export const updateEvent = async (id: number, event: Omit<Event, 'id'>): Promise<Event> => {
  return authFetch(`/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });
};

export const deleteEvent = async (id: number): Promise<void> => {
  return authFetch(`/events/${id}`, {
    method: 'DELETE'
  });
};

// Attendee APIs
export const getEventAttendees = async (eventId: number): Promise<User[]> => {
  return authFetch(`/events/${eventId}/attendees`);
};

export const addAttendeeToEvent = async (eventId: number, userId: number): Promise<Attendee> => {
  return authFetch(`/events/${eventId}/attendees/${userId}`, {
    method: 'POST'
  });
};

export const removeAttendeeFromEvent = async (eventId: number, userId: number): Promise<void> => {
  return authFetch(`/events/${eventId}/attendees/${userId}`, {
    method: 'DELETE'
  });
};

export const getUserEvents = async (userId: number): Promise<Event[]> => {
  return authFetch(`/attendees/${userId}/events`);
};
