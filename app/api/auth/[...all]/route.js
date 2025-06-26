import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/app/auth";

export const { POST, GET } = toNextJsHandler(auth);
