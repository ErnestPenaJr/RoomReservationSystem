import oracledb from 'oracledb';

export async function executeQuery<T>(
  sql: string,
  binds: any[] = [],
  opts: oracledb.ExecuteOptions = {}
): Promise<T[]> {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...opts
    });
    return result.rows as T[];
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}