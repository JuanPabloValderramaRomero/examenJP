import { connect } from './connect.js';

async function tableExists(tableName) {
  const [rows] = await connect.query('SHOW TABLES LIKE ?', [tableName]);
  return rows.length > 0;
}

async function columnExists(tableName, columnName) {
  const [rows] = await connect.query(`SHOW COLUMNS FROM \`${tableName}\` LIKE ?`, [columnName]);
  return rows.length > 0;
}

async function indexExists(tableName, indexName) {
  const [rows] = await connect.query(`SHOW INDEX FROM \`${tableName}\` WHERE Key_name = ?`, [indexName]);
  return rows.length > 0;
}

export async function ensureSchema() {
  // Keep this minimal and safe: only add missing columns/indexes that our API expects.
  try {
    const hasUsers = await tableExists('users');
    if (hasUsers) {
      const hasUserEmail = await columnExists('users', 'User_email');
      if (!hasUserEmail) {
        await connect.query('ALTER TABLE `users` ADD COLUMN `User_email` varchar(256) NULL AFTER `User_user`');
      }

      const emailIndexName = 'idx_users_user_email';
      const hasEmailIndex = await indexExists('users', emailIndexName);
      if (!hasEmailIndex) {
        await connect.query(`CREATE INDEX \`${emailIndexName}\` ON \`users\` (\`User_email\`)`);
      }
    }
  } catch (error) {
    // Don't block server start; expose a clear warning for local dev.
    console.warn('[ensureSchema] Warning:', error?.message || error);
  }
}

