import NetInfo from "@react-native-community/netinfo";
import { CourseRepository } from "../database/courseRepository";
import { fetchCourses } from "./courseService";

export const syncCourses = async () => {
  const net = await NetInfo.fetch();

  if (net.isConnected) {
    const courses = await fetchCourses();

    await CourseRepository.saveToLocal(courses);
  }

  return CourseRepository.getLocalCourses();
};
