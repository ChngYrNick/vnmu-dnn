const ROLES = { admin: 1, user: 2 };

const checkPermission = (allowedRoles, roles) => {
  return allowedRoles.some((role) => roles.includes(role));
};

export { ROLES, checkPermission };
