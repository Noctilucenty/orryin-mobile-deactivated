import { SafeAreaView, Text, Button, View, ScrollView } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { api } from "@/src/lib/api";
import { API_BASE_URL } from "@/src/config/api";
import { useSession } from "@/src/session/SessionContext";

function isAlreadyExistsSumsubError(e: any): boolean {
  const httpStatus = e?.response?.status;

  // If backend actually returns 409, great:
  if (httpStatus === 409) return true;

  // Otherwise, check body text for embedded Sumsub 409
  const data = e?.response?.data;

  let asText = "";
  try {
    asText = typeof data === "string" ? data : JSON.stringify(data ?? {});
  } catch {
    asText = "";
  }

  const text = asText.toLowerCase();

  // Common patterns:
  // - "Sumsub error 409"
  // - '"code": 409'
  // - "already exists"
  if (text.includes("sumsub error 409")) return true;
  if (text.includes('"code":409') || text.includes('"code": 409')) return true;
  if (text.includes("already exists")) return true;

  return false;
}

export default function KycScreen() {
  const { user, hydrated } = useSession();

  const [status, setStatus] = useState("Idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const startKyc = async () => {
    setStatus("Running...");
    setResult(null);
    setError("");

    if (!user) {
      setStatus("Failed ❌");
      setError("No user in session. Go Home and run /mvp/test-flow first.");
      return;
    }

    try {
      const res = await api.post("/kyc/applicant", {
        user_id: user.id,
        email: user.email,
        first_name: "Test",
        last_name: "User",
        country: "BRA",
      });

      setResult(res.data);
      setStatus("Success ✅");
    } catch (e: any) {
      // ✅ Treat applicant already exists as success-like (idempotent UX)
      if (isAlreadyExistsSumsubError(e)) {
        setStatus("Already created ✅");
        setError("");
        setResult(
          e?.response?.data ?? {
            message: "Applicant already exists in Sumsub. Continue verification.",
          }
        );
        return;
      }

      const msg =
        e?.response?.data
          ? JSON.stringify(e.response.data, null, 2)
          : e?.message || "Unknown error";
      setError(msg);
      setStatus("Failed ❌");
    }
  };

  if (!hydrated) {
    return (
      <LinearGradient colors={["#0b1020", "#1a2a4a", "#6b7bd6"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
          <Text style={{ color: "white" }}>Loading session…</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const buttonTitle = status.startsWith("Already") ? "KYC Already Started" : "Start KYC";

  return (
    <LinearGradient colors={["#0b1020", "#1a2a4a", "#6b7bd6"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
          Orryin — KYC
        </Text>

        <View
          style={{
            marginBottom: 12,
            backgroundColor: "rgba(255,255,255,0.08)",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white" }}>API: {API_BASE_URL}</Text>
          <Text style={{ color: "white" }}>Status: {status}</Text>
          <Text style={{ color: "white" }}>
            Session user: {user ? `${user.id} (${user.email})` : "—"}
          </Text>
        </View>

        <Button title={buttonTitle} onPress={startKyc} />

        {error ? (
          <View
            style={{
              marginTop: 12,
              padding: 10,
              borderWidth: 1,
              borderColor: "red",
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Text selectable style={{ color: "#ff6b6b" }}>
              {error}
            </Text>
          </View>
        ) : null}

        <ScrollView style={{ marginTop: 12, flex: 1 }}>
          <Text selectable style={{ color: "white" }}>
            {result ? JSON.stringify(result, null, 2) : "No result yet."}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
