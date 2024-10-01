import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from "../utils/query";

export const privateRoutes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    const [user] = await query(
      `SELECT id, username, fullname FROM users WHERE id = ?`,
      [decoded.id]
    );

    req.user = user;

    next();
  } catch (err) {
    return next(err);
  }
};
