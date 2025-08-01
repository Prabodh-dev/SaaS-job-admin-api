import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireUser = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "unauthorized" });
  next();
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role != "ADMIN")
    return res.status(403).json({ error: "Admin access only" });
  next();
};
