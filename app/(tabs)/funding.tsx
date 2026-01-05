import { SafeAreaView, Text, View, Button, ScrollView, Platform } from "react-native";
import { useState } from "react";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useSession } from "../../src/session/SessionContext";

export default function FundingScreen() {
  const { user, account } = useSession();

  const [status, setStatus] = useState("Idle");
  const [rate, setRate] = useState<any>(null);
  const [transfer, setTransfer] = useState<any>(null);
  const [error, setError] = useState("");

  const baseURL =
    Platform.OS === "web" ? "http://127.0.0.1:8000" : "http://192.168.0.212:8000";

  const getRate = async () => {
    setStatus("Fetching rate...");
    setError("");
    setRate(null);
    setTransfer(null);

    try {
      const res = await axios.get(`${baseURL}/payments/fx-rate`, {
        params: { source: "BRL", target: "USD", amount: 100 },
        timeout: 20000,
      });
      setRate(res.data);
      setStatus("Rate OK ✅");
    } catch (e: any) {
      setStatus("Failed ❌");
      setError(
        e?.response?.data ? JSON.stringify(e.response.data, null, 2) : e?.message || "Unknown error"
      );
    }
  };

  const sandboxTransfer = async () => {
    setStatus("Creating sandbox transfer...");
    setError("");
    setTransfer(null);

    if (!user || !account) {
      setStatus("Failed ❌");
      setError("No user/account in session. Go Home and run /mvp/test-flow first.");
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}/payments/transfer/sandbox`,
        {
          user_id: user.id,
          account_id: account.id,
          source_currency: "BRL",
          target_currency: "USD",
          source_amount: 100,
        },
        { headers: { "Content-Type": "application/json" }, timeout: 20000 }
      );

      setTransfer(res.data);
      setStatus("Transfer OK ✅");
    } catch (e: any) {
      setStatus("Failed ❌");
      setError(
        e?.response?.data ? JSON.stringify(e.response.data, null, 2) : e?.message || "Unknown error"
      );
    }
  };

  return (
    <LinearGradient colors={["#0b1020", "#1a2a4a", "#6b7bd6"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
          Orryin — Funding
        </Text>

        <View style={{ marginBottom: 12, backgroundColor: "rgba(255,255,255,0.08)", padding: 12, borderRadius: 12 }}>
          <Text style={{ color: "white" }}>Status: {status}</Text>
          <Text style={{ color: "white" }}>
            Session: {user ? `User ${user.id}` : "—"} / {account ? `Account ${account.id}` : "—"}
          </Text>
        </View>

        <Button title="Get FX Rate (BRL → USD, 100)" onPress={getRate} />
        <View style={{ height: 10 }} />
        <Button title="Sandbox Transfer (simulate deposit)" onPress={sandboxTransfer} />

        {error ? (
          <View style={{ marginTop: 12, padding: 10, borderWidth: 1, borderColor: "red", borderRadius: 12 }}>
            <Text selectable style={{ color: "#ff6b6b" }}>{error}</Text>
          </View>
        ) : null}

        <ScrollView style={{ marginTop: 12, flex: 1 }}>
          <Text selectable style={{ color: "white" }}>
            {rate ? `FX Rate:\n${JSON.stringify(rate, null, 2)}\n\n` : ""}
            {transfer ? `Sandbox Transfer:\n${JSON.stringify(transfer, null, 2)}` : ""}
            {!rate && !transfer ? "No result yet." : ""}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
