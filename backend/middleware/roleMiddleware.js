/**
 * Reusable Role-Based Access Control (RBAC) middleware
 * @param  {...string} roles - List of allowed roles
 */
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before verifying role access',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access denied for role '${req.user.role}'. Required: [${roles.join(', ')}]`,
      });
    }

    next();
  };
};

module.exports = { allowRoles };
