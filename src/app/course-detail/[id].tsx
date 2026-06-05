import CourseDetailScreen from "@/views/courseDetailScreen";
import { useLocalSearchParams } from "expo-router";

export default function CourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CourseDetailScreen />;
}
