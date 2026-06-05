import { Course } from "@/models/course";
import { createSlice } from "@reduxjs/toolkit";

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  offline: boolean;
  lastSyncedAt: string | null;
  last_updated: string;
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
  offline: false,
  lastSyncedAt: null,
  last_updated: new Date().toISOString(),
};

// const courseSlice = createSlice({
//   name: "course",
//   initialState,
//   reducers: {
//     setCourses(state, action: PayloadAction<Course[]>) {
//       state.courses = action.payload;
//     },

//     enrollCourse(state, action: PayloadAction<number>) {
//       const course = state.courses.find((c) => c.id === action.payload);

//       if (course) {
//         course.enrolled = true;
//       }
//     },

//     setLoading(state, action: PayloadAction<boolean>) {
//       state.loading = action.payload;
//     },

//     setError(state, action: PayloadAction<string | null>) {
//       state.error = action.payload;
//     },
//   },
// });

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourses(state, action) {
      state.courses = action.payload;
    },

    setOffline(state, action) {
      state.offline = action.payload;
    },

    setLastSynced(state, action) {
      state.lastSyncedAt = action.payload;
    },
  },
});

export const { setCourses, setOffline, setLastSynced } = courseSlice.actions;

export default courseSlice.reducer;
