import { useState } from 'react';

export default function useForm(initialValues = {}, validators = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Validate a single field
  const validateField = (name, value) => {
    if (validators[name]) {
      const errorMessage = validators[name](value);
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
      return !errorMessage;
    }
    return true;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Validate entire form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(validators).forEach((key) => {
      const msg = validators[key](values[key]);
      if (msg) {
        isValid = false;
        newErrors[key] = msg;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Reset form
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    handleChange,
    validateForm,
    validateField,
    resetForm,
  };
}
