import { useTheme } from "@react-navigation/native";
import { StyleProp, View, ViewStyle, useWindowDimensions } from "react-native";

interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  backgroundColor?: string;
}

const Container = ({ children, style, backgroundColor }: ContainerProps) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const containerWidth = width >= 700 ? 500 : "85%";

  return (
    <View
      style={[
        {
          backgroundColor: backgroundColor ?? colors.background,
          flex: 1,
          width: containerWidth,
          alignSelf: "center",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Container;
