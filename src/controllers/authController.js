import { PrismaClient } from "@prisma/client/extension";
import { hashPassword, comparePassword } from "../utils/hash";
import { createToken } from "../utils/hash";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return res.status(400).json({ error: "Email already registered" });
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });
  const token = createToken(user);
  res.json({
    user: { id: user.id, email: user.email, role: user.role },
    token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const match = await comparePassword(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });
  const token = createToken(user);
  res.json({
    user: { id: user.id, email: user.email, role: user.role },
    token,
  });
};
