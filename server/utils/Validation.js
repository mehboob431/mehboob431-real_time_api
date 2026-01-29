import { createError } from "../Utils/Error.js";
import { body, validationResult } from "express-validator";

// Validation middleware for registration
export const validateInput = (validationRules) => {
  return [
    validationRules(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(400, "Validation error", errors.array()));
      }
      next();
    },
  ];
};

// Validation rules for registration
export const registrationRules = () => {
  return [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("username").notEmpty().withMessage("Username is required"),
    // body("role").notEmpty().withMessage("Role is required"),
    body("address").optional().isString(),
    body("phoneNumber")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
    body("dateOfBirth").optional().isISO8601().toDate(),
    body("email")
      .isEmail()
      .withMessage("Invalid email address")
      .notEmpty()
      .withMessage("Email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .withMessage(
        "Password must include at least one uppercase letter, one lowercase letter, one special character, and one number"
      ),
  ];
};

export const loginRules = () => {
  return [
    body("userIdentifier")
      .notEmpty()
      .withMessage("Email, username, or phone number is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];
};
