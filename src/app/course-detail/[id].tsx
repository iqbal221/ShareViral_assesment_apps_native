import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function CourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Course Detail</Text>
      <Text>ID: {id}</Text>
    </View>
  );
}
