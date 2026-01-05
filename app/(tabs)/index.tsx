import { SafeAreaView, Text, Button, ScrollView, View } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { api } from "@/src/lib/api";
import { API_BASE_URL } from "@/src/config/api";
import { useSession } from "@/src/session/SessionContext";

export default function HomeScreen() {
  const { user, account, setUser, setAccount, clear, hydrated } = useSession();

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<string>("Idle");
  const [lastMs, setLastMs] = useState<number | null>(null);

  const runTest = async () => {
    const t0 = Date.now();
    setStatus("Running...");
    setError("");
    setResult(null);
    setLastMs(null);

    try {
      const res = await api.post("/mvp/test-flow", {});
      setResult(res.data);
      setStatus("Success ✅");

      // Save real user/account into session
      setUser(res.data?.user ?? null);
      setAccount(res.data?.account ?? null);
    } catch (e: any) {
      const msg =
        e?.response?.data
          ? JSON.stringify(e.response.data, null, 2)
          : e?.message || "Unknown error";
      setError(msg);
      setStatus("Failed ❌");
    } finally {
      setLastMs(Date.now() - t0);
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

  return (
    <LinearGradient colors={["#0b1020", "#1a2a4a", "#6b7bd6"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8, color: "white" }}>
          Orryin — Home
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
            Last request: {lastMs === null ? "-" : `${lastMs} ms`}
          </Text>

          <Text style={{ color: "white", marginTop: 8, fontWeight: "700" }}>
            Current Session
          </Text>
          <Text style={{ color: "white" }}>
            User: {user ? `${user.id} (${user.email})` : "—"}
          </Text>
          <Text style={{ color: "white" }}>
            Account: {account ? `${account.id} (${account.currency})` : "—"}
          </Text>
        </View>

        <Button title="Run /mvp/test-flow" onPress={runTest} />

        <View style={{ marginTop: 10 }}>
          <Button title="Clear Session" onPress={clear} />
        </View>

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
            {result ? JSON.stringify(result, null, 2) : "No result yet. Tap the button above."}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
