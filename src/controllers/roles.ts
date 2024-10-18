import { query } from "../utils/query";
import { date, uuid } from "../utils/tools";

export const getRoles = async (req: any, res: any) => {
  try {
    const data = await query(
      `SELECT id, name FROM roles WHERE is_deleted = ?`,
      [0]
    );
    return res
      .status(200)
      .json({ status: 200, message: "get data roles success", data: data });
  } catch (err) {
    return res
      .status(400)
      .json({ status: 400, message: "Smothing went wrong !" });
  }
};

export const addRoles = async (req: any, res: any) => {
  const { name } = req.body;
  const { id: idUser } = req.user;
  try {
    if (!name) {
      return res.status(400).json("All fields are required");
    }
    const roleExists = await query(
      `SELECT name FROM roles WHERE name = ? and is_deleted = ?`,
      [name, 0]
    );
    if (roleExists.length > 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Role already exists" });
    }

    await query(
      `INSERT INTO roles 
      (id, name, is_deleted, created_by, created_at, updated_by, updated_at) VALUES 
      (?, ?, ?, ?, ?, ?, ?)`,
      [uuid(), name, 0, idUser, date(), idUser, date()]
    );
    return res.status(200).json({ status: 201, message: "Add role success" });
  } catch (err) {
    return res.status(400).json("Smothing went wrong !");
  }
};

export const updateRoles = async (req: any, res: any) => {
  const { id } = req.params;
  const { name } = req.body;
  const { id: idUser } = req.user;
  try {
    if (!name) {
      return res.status(400).json("All fields are required");
    }

    const roleExists = await query(
      `SELECT name FROM roles WHERE name = ? and is_deleted = ?`,
      [name, 0]
    );

    if (roleExists.length == 0) {
      return res.status(404).json({ status: 404, message: "Role not found" });
    }

    if (roleExists.length > 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Role already exists" });
    }

    await query(
      `UPDATE roles SET name = ?, updated_by = ?, updated_at = ? WHERE id = ?`,
      [name, idUser, date(), id]
    );
    return res
      .status(200)
      .json({ status: 201, message: "Update role success" });
  } catch (err) {
    return res.status(400).json("Smothing went wrong !");
  }
};

export const deleteRoles = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const cekRoles = await query(`SELECT id FROM users WHERE role_id = ?`, [
      id,
    ]);

    if (cekRoles.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Role cannot find",
      });
    }

    await query(`UPDATE roles SET is_deleted = 1 WHERE id = ?`, [id]);
    return res
      .status(200)
      .json({ status: 200, message: "Delete role success" });
  } catch (err) {
    return res.status(400).json("Smothing went wrong !");
  }
};
