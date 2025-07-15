import { StyleProp, View, ViewStyle } from "react-native";
import ThemedText from "./ThemedText";

interface HeaderProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  fontSize?: number;
}

const Header = ({ title, style, fontSize = 34 }: HeaderProps) => {
  return (
    <View
      style={[
        {
          marginHorizontal: "auto",
          marginTop: 140,
          marginBottom: 20,
        },
        style,
      ]}
    >
      <ThemedText
        style={{
          fontSize: fontSize,
          fontWeight: 600,
          lineHeight: fontSize * 1.2,
          flex: 1,
          paddingVertical: 28,
        }}
      >
        {title}
      </ThemedText>
    </View>
  );
};

export default Header;
