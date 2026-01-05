// src/screens/TestBackend.tsx
import { View, Button, Text } from "react-native";
import { api } from "../api/client";
import { useState } from "react";

export default function TestBackend() {
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    const res = await api.post("/mvp/test-flow", {});
    setResult(res.data);
  };

  return (
    <View>
      <Button title="Run Backend Test" onPress={runTest} />
      <Text>{JSON.stringify(result, null, 2)}</Text>
    </View>
  );
}
