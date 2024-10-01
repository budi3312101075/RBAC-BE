import db from "../database/db";

export const query: any = async (query: any, array: any) => {
  const [value] = await db.query(query, array === undefined ? [] : array);
  return value;
};

export const queryBulk: any = async (query: any, array: any) => {
  return await db.format(query, array === undefined ? [] : array);
};
