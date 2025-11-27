export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Utilisateur non authentifié",
    });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé. Rôle administrateur requis",
    });
  }
  next();
};
