import { Request, Response } from "express";
import { query } from "../utils/query";

export const getModuleByRole = async (req: Request, res: Response) => {
  const { roleId } = req.params;

  try {
    const [checkRole] = await query(`SELECT id FROM roles WHERE id = ?`, [
      roleId,
    ]);

    if (!checkRole) {
      return res.status(400).json({ message: "Invalid role ID!" });
    }

    let data: any[] = [];
    const getAllModule = await query(`
      SELECT 
        m.id, m.name,
        cm.id as categoryId, cm.name as categoryName
      FROM modules m
      LEFT JOIN category_module cm ON m.category_id = cm.id
      ORDER BY cm.order ASC, m.order ASC
    `);

    for (const { id, name, categoryId, categoryName } of getAllModule) {
      const [checkRoleModuleAccess] = await query(
        `
        SELECT 
          id, can_create as canCreate, can_read as canRead, 
          can_update as canUpdate, can_delete as canDelete 
        FROM permissions 
        WHERE role_id = ? AND module_id = ?
      `,
        [checkRole.id, id]
      );

      const canRead = checkRoleModuleAccess?.canRead ?? 0;
      const canCreate = checkRoleModuleAccess?.canCreate ?? 0;
      const canUpdate = checkRoleModuleAccess?.canUpdate ?? 0;
      const canDelete = checkRoleModuleAccess?.canDelete ?? 0;

      const index = data.findIndex((val) => val.categoryId === categoryId);

      if (index === -1) {
        data.push({
          categoryId,
          categoryName,
          listModules: [
            {
              id,
              name,
              canRead,
              canCreate,
              canUpdate,
              canDelete,
            },
          ],
        });
      } else {
        data[index].listModules.push({
          id,
          name,
          canRead,
          canCreate,
          canUpdate,
          canDelete,
        });
      }
    }

    return res
      .status(200)
      .json({ status: 200, message: "Get data success", data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const updateRoleModule = async (req: any, res: any) => {
  const { roleId } = req.params;
  const { listModules } = req.body;
  const userId = req.user.id;

  try {
    const [checkRole] = await query(`SELECT id FROM roles WHERE id = ?`, [
      roleId,
    ]);

    if (!checkRole) {
      return res.status(400).json({ message: "Invalid role ID!" });
    }

    for (const module of listModules) {
      const { id: moduleId, canRead, canCreate, canUpdate, canDelete } = module;

      const [checkRoleModule] = await query(
        `
          SELECT id 
          FROM permissions 
          WHERE role_id = ? AND module_id = ?
        `,
        [roleId, moduleId]
      );

      if (!checkRoleModule) {
        await query(
          `
            INSERT INTO permissions (
              can_read, can_create, can_update, can_delete,
              created_by, updated_by, role_id, module_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            canRead,
            canCreate,
            canUpdate,
            canDelete,
            userId,
            userId,
            roleId,
            moduleId,
          ]
        );
      } else {
        await query(
          `
            UPDATE permissions SET
              can_read = ?, can_create = ?, can_update = ?, can_delete = ?, 
              updated_by = ?
            WHERE role_id = ? AND module_id = ?
          `,
          [canRead, canCreate, canUpdate, canDelete, userId, roleId, moduleId]
        );
      }
    }

    return res
      .status(200)
      .json({ message: "Role access updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};
