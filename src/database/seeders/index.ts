import { cekTableExist } from "./seedingDb";

export const runSeederUsers = async () => {
  await cekTableExist();
};
