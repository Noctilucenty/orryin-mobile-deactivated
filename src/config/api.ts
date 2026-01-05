import { Platform } from "react-native";

// DEV MACHINE LAN IP (PC)
// Use this for:
// - Physical Android phone (same Wi-Fi / LAN)
// - iOS simulator if needed
const DEV_MACHINE_HOST_ANDROID = "192.168.0.212";

export const API_BASE_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8000"
    : Platform.OS === "android"
    ? `http://${DEV_MACHINE_HOST_ANDROID}:8000`
    : `http://${DEV_MACHINE_HOST_ANDROID}:8000`;
