import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { query } from "../utils/query";
import { date, uuid } from "../utils/tools";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const data = await query(
      `SELECT u.id, u.username, r.name AS role FROM users u 
      INNER JOIN roles r on u.role_id = r.id
      WHERE u.is_deleted = 0`
    );
    return res
      .status(200)
      .json({ status: 200, message: "get data users success", data: data });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: "Smothing went wrong !" });
  }
};

export const addUsers = async (req: Request, res: Response) => {
  const { username, password, fullname, email, phone, role_id } = req.body;
  const { id } = req.user as any;

  try {
    if (!username || !password || !role_id || !fullname || !email || !phone) {
      return res.status(400).json("All fields are required");
    }

    const userExists = await query(
      `SELECT username, fullname FROM users WHERE username = ?`,
      [username, fullname]
    );

    if (userExists.length > 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO users 
      (id, username, password, fullname, email, phone, is_deleted, created_by, created_at, updated_by, updated_at, role_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid(),
        username,
        hashedPassword,
        fullname,
        email,
        phone,
        0,
        id,
        date(),
        id,
        date(),
        role_id,
      ]
    );
    return res.status(201).json({ status: 201, message: "add user success" });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: "Smothing went wrong !" });
  }
};
