// Email validation
export function validateEmail(value) {
  if (!value) return "Email is required";
  const regex = /\S+@\S+\.\S+/;
  return regex.test(value) ? "" : "Invalid email address";
}

// Password validation
export function validatePassword(value) {
  if (!value) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return "";
}

// Text validation
export function validateText(value, fieldName = "Field") {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return "";
}

// Phone validation
export function validatePhone(value) {
  if (!value) return "Phone number is required";
  if (value.length < 10) return "Phone number is too short";
  return "";
}

// Numeric fields (amount, age, price)
export function validateNumber(value, fieldName = "Value") {
  if (!value) return `${fieldName} is required`;
  if (Number(value) <= 0) return `${fieldName} must be greater than 0`;
  return "";
}

// Appointment type selection
export function validateAppointmentType(value) {
  if (!value) return "Please select appointment type";
  return "";
}
