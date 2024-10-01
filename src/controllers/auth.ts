import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../utils/query";
import dotenv from "dotenv";
import { IUserModel } from "../models/userModel";
import { IModuleModel } from "../models/moduleModel";

dotenv.config();

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const [user]: IUserModel[] = await query(
      `SELECT id, fullname, username, password FROM users WHERE username = ?`,
      [username]
    );

    if (!user) {
      return res.status(400).json({ message: "Username not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const permissions: IModuleModel[] = await query(
      `SELECT m.uuid AS moduleId, p.can_read as canRead, p.can_create as canCreate, 
              p.can_update as canUpdate, p.can_delete as canDelete 
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       LEFT JOIN permissions p ON p.role_id = r.id
       LEFT JOIN modules m ON m.id = p.module_id
       LEFT JOIN category_module cm ON cm.id = m.category_id
       WHERE u.id = ?
       ORDER BY cm.order ASC, m.order ASC`,
      [user.id]
    );

    const listModuleAccess = permissions.map((item) => ({
      moduleId: item.moduleId,
      canRead: item.canRead,
      canCreate: item.canCreate,
      canUpdate: item.canUpdate,
      canDelete: item.canDelete,
    }));

    const payload = {
      id: user.id,
      username: user.username,
      name: user.fullname,
      listModuleAccess,
    };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .cookie("token", token, { httpOnly: true, maxAge: 24 * 3600 * 1000 })
      .json({
        status: 200,
        message: "Login success",
        token,
      });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Something went wrong!" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ status: 200, message: "Logout success" });
  } catch (error) {
    return res
      .status(400)
      .json({ status: 400, message: "Smothing went wrong !" });
  }
};
