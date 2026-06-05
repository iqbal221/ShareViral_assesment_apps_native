// import { CourseListViewModel } from "@/viewmodels/courseListViewModel";
// import { useLocalSearchParams } from "expo-router";
// import { useEffect, useState } from "react";
// import { ScrollView, Text, View } from "react-native";
// import { useDispatch } from "react-redux";

// export default function CourseDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const dispatch = useDispatch();

//   const [course, setCourse] = useState<any>(null);

//   // LOAD SINGLE COURSE FROM LOCAL DB
//   useEffect(() => {
//     loadCourse();
//   }, []);

//   const loadCourse = async () => {
//     const all = await CourseListViewModel.loadCourses();
//     const found = all.find((c: any) => c.id === id);
//     setCourse(found);
//   };

//   if (!course) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={{ flex: 1, padding: 16 }}>
//       {/* TITLE */}
//       <Text style={{ fontSize: 22, fontWeight: "bold" }}>{course.title}</Text>

//       <Text style={{ marginTop: 5 }}>Instructor: {course.instructor}</Text>

//       {/* DETAILS */}
//       <Text>⭐ Rating: {course.rating}</Text>
//       <Text>💲 Price: {course.price}</Text>
//       <Text>⏱ Duration: {course.duration} weeks</Text>

//       {/* TAGS */}
//       <View
//         style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 10 }}>
//         {course.tags?.map((tag: string) => (
//           <Text
//             key={tag}
//             style={{
//               backgroundColor: "#eee",
//               padding: 5,
//               margin: 3,
//               borderRadius: 6,
//             }}>
//             {tag}
//           </Text>
//         ))}
//       </View>

//       {/* PREMIUM */}
//       <Text>{course.isPremium ? "🔥 Premium Course" : "🆓 Free Course"}</Text>
//     </ScrollView>
//   );
// }

import { setCourses } from "@/store/courseSlice";
import { CourseListViewModel } from "@/viewmodels/courseListViewModel";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    setLoading(true);

    const all = await CourseListViewModel.loadCourses();

    const found = all.find((c: any) => String(c.id) === String(id));

    setCourse(found || null);
    setLoading(false);
  };

  // ✅ TOGGLE ENROLLMENT (LOCAL ONLY)
  const toggleEnroll = async () => {
    if (!course) return;

    const updatedCourse = {
      ...course,
      isEnrolled: !course.isEnrolled,
    };

    const toggleEnroll = async () => {
      if (!course) return;

      const updatedCourse = {
        ...course,
        isEnrolled: !course.isEnrolled,
      };

      // ✅ 1. update SQLite via ViewModel
      await CourseListViewModel.updateEnrollment(
        String(updatedCourse.id),
        updatedCourse.isEnrolled,
      );

      // ✅ 2. update local UI
      setCourse(updatedCourse);

      // ✅ 3. refresh Redux list
      const all = await CourseListViewModel.loadCourses();
      dispatch(setCourses(all));
    };

    // 2. update UI state
    setCourse(updatedCourse);

    // 3. update Redux (instant list update)
    const all = await CourseListViewModel.loadCourses();
    dispatch(setCourses(all));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Course not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* TITLE */}
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>{course.title}</Text>

      {/* INSTRUCTOR */}
      <Text style={{ marginTop: 5 }}>Instructor: {course.instructor}</Text>

      {/* DETAILS */}
      <Text>⭐ Rating: {course.rating}</Text>
      <Text>💲 Price: ${course.price}</Text>
      <Text>⏱ Duration: {course.duration} weeks</Text>

      {/* TAGS */}
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 10 }}>
        {course.tags?.map((tag: string) => (
          <Text
            key={tag}
            style={{
              backgroundColor: "#eee",
              padding: 5,
              margin: 3,
              borderRadius: 6,
            }}>
            {tag}
          </Text>
        ))}
      </View>

      {/* PREMIUM STATUS */}
      <Text style={{ marginBottom: 10 }}>
        {course.isPremium ? "🔥 Premium Course" : "🆓 Free Course"}
      </Text>

      {/* ENROLL BUTTON */}
      <Button
        title={course.isEnrolled ? "Remove Enrollment" : "Mark as Enrolled"}
        onPress={toggleEnroll}
      />
    </ScrollView>
  );
}
