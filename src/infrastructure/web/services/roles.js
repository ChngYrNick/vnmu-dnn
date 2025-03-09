class RolesService {
  checkPermission(allowedRoles, roles) {
    return allowedRoles.some((role) => roles.includes(role));
  }
}

export { RolesService };
