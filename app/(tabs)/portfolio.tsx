import { SafeAreaView, Text, View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSession } from "../../src/session/SessionContext";

export default function PortfolioScreen() {
  const { user, account } = useSession();

  return (
    <LinearGradient colors={["#0b1020", "#1a2a4a", "#6b7bd6"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
          Orryin — Portfolio
        </Text>

        <View style={{ marginBottom: 12, backgroundColor: "rgba(255,255,255,0.08)", padding: 12, borderRadius: 12 }}>
          <Text style={{ color: "white" }}>User: {user ? `${user.id} (${user.email})` : "—"}</Text>
          <Text style={{ color: "white" }}>Account: {account ? `${account.id} (${account.currency})` : "—"}</Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <Text style={{ color: "white", opacity: 0.9 }}>
            Portfolio UI v1 (placeholder):
            {"\n"}• Holdings: coming next
            {"\n"}• P/L: coming next
            {"\n"}• Positions: coming next
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
