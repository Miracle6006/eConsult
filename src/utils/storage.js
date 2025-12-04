import { STORAGE_KEY } from "./constants";

// Load all app data
export function loadStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initializeStorage();
    return JSON.parse(raw);
  } catch (err) {
    console.error("Storage load error:", err);
    return initializeStorage();
  }
}

// Save entire app data
export function saveStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Storage save error:", err);
  }
}

// Initialize structure if it doesn't exist
export function initializeStorage() {
  const defaultData = {
    users: [],
    patients: [],
    appointments: [],
    invoices: [],
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
}

// Update a specific key
export function updateStorageField(field, value) {
  const data = loadStorage();
  data[field] = value;
  saveStorage(data);
}

// Generate unique IDs
export function generateId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}
