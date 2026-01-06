import { SafeAreaView, Text, Button, ScrollView, View } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { api } from "@/src/api/client";
import { useSession } from "@/src/session/SessionContext";

export default function HomeScreen() {
  const {
    user,
    account,
    kycState,
    brokerage,
    fundingWarning,
    setFromBackendSnapshot,
    resetSession,
  } = useSession();

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<string>("Idle");
  const [lastMs, setLastMs] = useState<number | null>(null);

  const runTestFlow = async () => {
    try {
      setStatus("Running /mvp/test-flow...");
      setError("");
      const start = Date.now();

      const res = await api.post("/mvp/test-flow", {});
      setFromBackendSnapshot(res.data);
      setResult(res.data);

      setLastMs(Date.now() - start);
      setStatus("Success");
    } catch (e: any) {
      setError("Unexpected error running test flow");
      setStatus("Error");
    }
  };

  return (
    <LinearGradient colors={["#050A1A", "#1B2B5C"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "600" }}>
          Orryin — Home
        </Text>

        <Text style={{ color: "#9CA3AF", marginTop: 4 }}>
          Status: {status} {lastMs ? `(${lastMs} ms)` : ""}
        </Text>

        <View style={{ marginTop: 16 }}>
          <Button title="Run /mvp/test-flow" onPress={runTestFlow} />
          <View style={{ height: 8 }} />
          <Button title="Clear Session" color="gray" onPress={resetSession} />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "white", fontWeight: "600" }}>
            Session Snapshot
          </Text>

          <Text style={{ color: "#9CA3AF", marginTop: 4 }}>
            User: {user ? "Loaded" : "None"}
          </Text>
          <Text style={{ color: "#9CA3AF" }}>
            Account: {account ? "Loaded" : "None"}
          </Text>
          <Text style={{ color: "#9CA3AF" }}>KYC: {kycState}</Text>
          <Text style={{ color: "#9CA3AF" }}>
            Brokerage: {brokerage ? "Created" : "None"}
          </Text>

          {fundingWarning && (
            <Text style={{ color: "#FACC15", marginTop: 6 }}>
              Funding warning: {fundingWarning}
            </Text>
          )}
        </View>

        {error ? (
          <Text style={{ color: "#F87171", marginTop: 12 }}>{error}</Text>
        ) : null}

        <ScrollView style={{ marginTop: 16, flex: 1 }}>
          <Text selectable style={{ color: "white" }}>
            {result
              ? JSON.stringify(result, null, 2)
              : "No result yet. Tap the button above."}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
