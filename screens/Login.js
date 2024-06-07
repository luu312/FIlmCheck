import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import supabase from "../api/Supabase";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data: userProfile, error } = await supabase
      .from("profiles")
      .select("id, username, password")
      .eq("username", username)
      .single();

    if (error) {
      Alert.alert("Login Error", "Invalid username");
      return;
    }

    if (userProfile.password !== password) {
      Alert.alert("Login Error", "Incorrect password");
      return;
    }

    // Przechowaj ID użytkownika w lokalnym stanie lub w jakimś kontekście globalnym
    navigation.navigate("Home", { userId: userProfile.id });
  };

  return (
    <View style={styles.container} className="flex-1 bg-neutral-800">
      <Text style={styles.header}>
        <Text style={styles.check}>Film</Text>Check
      </Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>or</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home", { userId: null })}
      >
        <Text style={styles.buttonText}>Login as a guest</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 50,
    color: "white",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  check: {
    color: "#c8d34a",
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  button: {
    width: "100%",
    padding: 10,
    backgroundColor: "#c8d34a",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    marginBottom: 10,
    fontSize: 18,
    color: "white",
    fontSize: 20,
  },
});
