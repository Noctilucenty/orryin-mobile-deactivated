import { Platform } from "react-native";

export const API_BASE_URL =
  Platform.OS === "web"
    ? "https://web-production-343a.up.railway.app"
    : "https://web-production-343a.up.railway.app";
