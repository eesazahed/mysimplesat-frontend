import React from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import ThemedText from "./ThemedText";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const Input = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}: InputProps) => {
  const colorScheme = useColorScheme();

  const backgroundColor = colorScheme === "dark" ? "#2c2c2c" : "#fff";
  const borderColor = colorScheme === "dark" ? "#444" : "#ccc";
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const placeholderColor = colorScheme === "dark" ? "#aaa" : "#888";

  return (
    <View style={[{ marginTop: 8, marginBottom: 16 }, containerStyle]}>
      {label && (
        <ThemedText
          style={{
            marginBottom: 8,
            fontSize: 16,
            fontFamily: "LatoBold",
            color: textColor,
          }}
        >
          {label}
        </ThemedText>
      )}
      <TextInput
        style={[
          {
            backgroundColor,
            borderWidth: 1,
            borderColor,
            borderRadius: 12,
            padding: 12,
            fontSize: 16,
            color: textColor,
          },
          style,
        ]}
        placeholderTextColor={placeholderColor}
        {...props}
      />
      {error ? (
        <ThemedText
          style={{
            color: "#d32f2f",
            fontSize: 14,
            marginTop: 4,
          }}
        >
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
};

export default Input;
