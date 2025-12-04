// Application-wide constants

export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  PATIENT: "patient",
};

export const PERMISSIONS = {
  MANAGE_USERS: "manage_users",
  MANAGE_PATIENTS: "manage_patients",
  MANAGE_BILLING: "manage_billing",
  VIEW_APPOINTMENTS: "view_appointments",
  MANAGE_APPOINTMENTS: "manage_appointments",
};

export const DEFAULT_ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_PATIENTS,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
  ],

  staff: [
    PERMISSIONS.MANAGE_PATIENTS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.MANAGE_BILLING,
  ],

  patient: [
    PERMISSIONS.VIEW_APPOINTMENTS,
  ],
};

// Appointment types
export const APPOINTMENT_TYPES = [
  {
    id: "clinic_visit",
    label: "Clinic Visit",
    price: 5000,
  },
  {
    id: "home_visit",
    label: "Home Visit",
    price: 12000,
  },
  {
    id: "ambulance",
    label: "Ambulance Emergency",
    price: 30000,
  },
  {
    id: "virtual",
    label: "Virtual Consultation",
    price: 2000,
  },
];
