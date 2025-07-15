import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import ThemedText from "./ThemedText";

interface Props {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  fontSize?: number;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  noLoading?: boolean;
  icon?: "remove" | "add";
}

const Button = ({
  onPress,
  title,
  children,
  variant = "primary",
  size = "medium",
  fontSize,
  disabled = false,
  loading = false,
  style,
  noLoading = false,
  icon,
}: Props) => {
  const { colors } = useTheme();

  const getBackgroundColor = (): string => {
    if (disabled) return colors.border; // TODO: fix this
    if (variant === "primary") return colors.primary;
    if (variant === "secondary") return colors.card;
    return "transparent";
  };

  const getTextColor = (): string => {
    if (disabled) return colors.text + "80";
    if (variant === "primary") return "#FFFFFF";
    return colors.text;
  };

  const getPadding = (): { vertical: number; horizontal: number } => {
    if (size === "small") return { vertical: 8, horizontal: 16 };
    if (size === "large") return { vertical: 16, horizontal: 24 };
    return { vertical: 12, horizontal: 20 };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.5}
      style={[
        {
          backgroundColor: getBackgroundColor(),
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: getPadding().vertical,
          paddingHorizontal: getPadding().horizontal,
          opacity: disabled || loading ? 0.5 : 1,
        },
        style,
      ]}
    >
      {!noLoading && loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : icon ? (
        <MaterialIcons name={icon} color={getTextColor()} size={24} />
      ) : children ? (
        children
      ) : (
        <ThemedText
          style={{
            color: getTextColor(),
            fontSize: fontSize ?? 16,
            fontWeight: "500",
          }}
        >
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

export default Button;
