import { HEADERS } from "../auth.constants";

export const BASE_URL = process.env.EXPO_PUBLIC_BFF_URL ?? "";

export const FORM_HEADERS = {
  [HEADERS.PROPERTIES.CONTENT_TYPE]: HEADERS.CONTENT_TYPE.FORM_URLENCODED,
};
