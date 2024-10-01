import dayjs from "dayjs";
import { randomUUID } from "crypto";

export const uuid = () => {
  return randomUUID();
};

export const date = () => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
};
