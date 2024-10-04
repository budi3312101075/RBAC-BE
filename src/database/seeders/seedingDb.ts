import { query } from "../../utils/query";

export const cekTableExist = async () => {
  const checkTableQuery = `
    SELECT * FROM information_schema.tables 
    WHERE table_schema = '${process.env.DB_NAME}' 
    AND table_name = 'users' 
    LIMIT 1;
  `;

  try {
    const result = await query(checkTableQuery);

    if (result.length === 0) {
      console.log("Table does not exist. Creating tables...");

      const createTablesQueries = [
        `CREATE TABLE IF NOT EXISTS category_module (
          id int NOT NULL AUTO_INCREMENT,
          uuid char(36) DEFAULT NULL,
          name varchar(100) DEFAULT NULL,
          \`order\` int DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,

        `CREATE TABLE IF NOT EXISTS modules (
          id int NOT NULL AUTO_INCREMENT,
          uuid char(36) DEFAULT NULL,
          name varchar(100) DEFAULT NULL,
          \`order\` int DEFAULT NULL,
          category_id int DEFAULT NULL,
          PRIMARY KEY (id),
          KEY fk_category_module_modules_1 (category_id),
          CONSTRAINT fk_category_module_modules_1 FOREIGN KEY (category_id) REFERENCES category_module (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,

        `CREATE TABLE IF NOT EXISTS roles (
          id char(36) NOT NULL,
          name varchar(100) DEFAULT NULL,
          is_deleted tinyint(1) DEFAULT NULL,
          created_by char(36) DEFAULT NULL,
          created_at datetime DEFAULT NULL,
          updated_by char(36) DEFAULT NULL,
          updated_at datetime DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,

        `CREATE TABLE IF NOT EXISTS permissions (
          id int NOT NULL AUTO_INCREMENT,
          can_read tinyint(1) DEFAULT NULL,
          can_create tinyint(1) DEFAULT NULL,
          can_update tinyint(1) DEFAULT NULL,
          can_delete tinyint(1) DEFAULT NULL,
          created_by char(36) DEFAULT NULL,
          updated_by char(36) DEFAULT NULL,
          role_id char(36) DEFAULT NULL,
          module_id int DEFAULT NULL,
          PRIMARY KEY (id),
          KEY fk_permissions_modules_1 (module_id),
          KEY fk_roles_permissions (role_id),
          CONSTRAINT fk_permissions_modules_1 FOREIGN KEY (module_id) REFERENCES modules (id),
          CONSTRAINT fk_roles_permissions FOREIGN KEY (role_id) REFERENCES roles (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,

        `CREATE TABLE IF NOT EXISTS users (
          id char(36) NOT NULL,
          username varchar(255) DEFAULT NULL,
          password varchar(255) DEFAULT NULL,
          fullname varchar(100) DEFAULT NULL,
          email varchar(100) DEFAULT NULL,
          phone varchar(20) DEFAULT NULL,
          is_deleted tinyint(1) DEFAULT NULL,
          created_by char(36) DEFAULT NULL,
          created_at datetime DEFAULT NULL,
          updated_by char(36) DEFAULT NULL,
          updated_at datetime DEFAULT NULL,
          role_id char(36) DEFAULT NULL,
          PRIMARY KEY (id),
          KEY fk_users_roles (role_id),
          CONSTRAINT fk_users_roles FOREIGN KEY (role_id) REFERENCES roles (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
      ];

      for (let createQuery of createTablesQueries) {
        await query(createQuery);
      }

      await query(`
        INSERT INTO category_module (id, uuid, name, \`order\`) VALUES
        (1, '88d73d8a-2abf-47c9-855a-947f5f9deaf7', 'Management', 1),
        (2, '99d7a6b0-03ad-4113-b9d1-69f8758efec4', 'Team', 2);
      `);

      await query(`
        INSERT INTO modules (id, uuid, name, \`order\`, category_id) VALUES
        (1, '06995435-b0c0-42d1-9a76-730a0d9575ce', 'Permissions', 1, 1),
        (2, '06995435-b0c0-42d1-9a76-euri37e6531', 'Team', 1, 2),
        (3, '06995435-b0c0-42d1-9a76-hgjdue738409', 'Roles', 2, 1),
        (4, '06995435-b0c0-42d1-9a76-ksjdilawdi3', 'Users', 2, 2);
      `);

      await query(`
        INSERT INTO roles (id, name, is_deleted, created_by, created_at, updated_by, updated_at) VALUES
        ('47820a5d-9398-457d-bef6-43d79e9496ca', 'users', 0, '4b2801cb-a2e6-4c59-b3c1-767144cb203a', '2024-08-03 10:10:04', '4b2801cb-a2e6-4c59-b3c1-767144cb203a', '2024-08-03 10:10:04');
      `);

      await query(`
        INSERT INTO permissions (id, can_read, can_create, can_update, can_delete, created_by, updated_by, role_id, module_id) VALUES
        (1, 1, 1, 1, 1, '4b2801cb-a2e6-4c59-b3c1-767144cb203a', '4b2801cb-a2e6-4c59-b3c1-767144cb203a', '47820a5d-9398-457d-bef6-43d79e9496ca', 1),
        (2, 1, 1, 1, 1, '4b2801cb-a2e6-4c59-b3c1-767144cb203a', '4b2801cb-a2e6-4c59-b3c1-767144cb203a', '47820a5d-9398-457d-bef6-43d79e9496ca', 2),
        (3, 1, 1, 1, 1, '4b2801cb-a2e6-4c59-b3c1-767144cb203a', '4b2801cb-a2e6-4c59-b3c1-767144cb203a', '47820a5d-9398-457d-bef6-43d79e9496ca', 3),
        (4, 1, 1, 1, 1, '4b2801cb-a2e6-4c59-b3c1-767144cb203a', '4b2801cb-a2e6-4c59-b3c1-767144cb203a', '47820a5d-9398-457d-bef6-43d79e9496ca', 4);
      `);

      await query(`
        INSERT INTO users (id, username, password, fullname, email, phone, is_deleted, created_by, created_at, updated_by, updated_at, role_id) VALUES
        ('955f0efd-2ff1-404b-bfda-2d9ea433bada', 'budi', '$2b$10$HBD2vcOSmUC69R2.eNPLJ.i5HSMCubsd.7FbZxNJhW/d89.Pgx0Ym', 'Budi Prayoga', 'budiprayoga5103@gmail.com', '08189834789', 0, NULL, '2024-09-30 10:52:21', NULL, '2024-09-30 10:52:21', '47820a5d-9398-457d-bef6-43d79e9496ca');
      `);

      console.log("database seeded successfully.");
    } else {
      console.log("Database ready.");
    }
  } catch (error) {
    console.error("Error while checking if table exists:", error);
  }
};
