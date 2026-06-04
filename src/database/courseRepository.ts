import { Course } from "@/models/course";
import { supabase } from "../api/supabase";
import db from "../database/sqlite";

export class CourseRepository {
  // 1. LOAD FROM SQLITE (instant UI)
  static getLocalCourses(): Promise<Course[]> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM courses",
          [],
          (_, result) => {
            const rows = result.rows.raw();

            // FIX: parse JSON tags back
            const parsed = rows.map((c: any) => ({
              ...c,
              tags: c.tags ? JSON.parse(c.tags) : [],
              isPremium: !!c.isPremium,
              isEnrolled: !!c.isEnrolled,
            }));

            resolve(parsed);
          },
          (_, error) => {
            reject(error);
            return false;
          },
        );
      });
    });
  }

  // 2. FETCH FROM SUPABASE (REMOTE)
  static async fetchRemoteCourses(): Promise<Course[]> {
    const { data, error } = await supabase.from("courses").select("*");

    if (error) throw error;

    return data as Course[];
  }

  // 3. SAVE TO SQLITE (CACHE)
  static saveToLocal(courses: Course[]) {
    db.transaction((tx) => {
      courses.forEach((c) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO courses
          (id, title, instructor, tags, price, rating, duration, isPremium, isEnrolled)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.id,
            c.title,
            c.instructor,
            JSON.stringify(c.tags),
            c.price,
            c.rating,
            c.duration,
            c.isPremium ? 1 : 0,
            c.isEnrolled ? 1 : 0,
          ],
        );
      });
    });
  }

  // 4. 🔥 MAIN ENTRY: LOAD COURSES (UI SHOULD USE THIS)
  static async loadCourses(): Promise<Course[]> {
    return await this.getLocalCourses();
  }

  // 5. 🔥 SYNC FUNCTION (OFFLINE-FIRST)
  static async syncCourses(): Promise<Course[]> {
    try {
      const remote = await this.fetchRemoteCourses();

      if (remote && remote.length > 0) {
        this.saveToLocal(remote);
      }

      return await this.getLocalCourses();
    } catch (error) {
      console.log("Sync failed, fallback to local DB:", error);
      return await this.getLocalCourses();
    }
  }

  // 6. SEARCH + FILTER + SORT (LOCAL DB LOGIC)
  static async queryCourses(params: {
    search?: string;
    filter?: {
      premium?: boolean;
      enrolled?: boolean;
    };
    sort?: "rating" | "price" | "duration";
  }) {
    let courses = await this.getLocalCourses();

    // SEARCH
    if (params.search) {
      const q = params.search.toLowerCase();

      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          (c.tags || []).some((t) => t.toLowerCase().includes(q)),
      );
    }

    // FILTER
    if (params.filter?.premium !== undefined) {
      courses = courses.filter((c) => c.isPremium === params.filter!.premium);
    }

    if (params.filter?.enrolled !== undefined) {
      courses = courses.filter((c) => c.isEnrolled === params.filter!.enrolled);
    }

    // SORT
    if (params.sort === "rating") {
      courses.sort((a, b) => b.rating - a.rating);
    }

    if (params.sort === "price") {
      courses.sort((a, b) => a.price - b.price);
    }

    if (params.sort === "duration") {
      courses.sort((a, b) => a.duration - b.duration);
    }

    return courses;
  }

  // 7. OPTIONAL: CLEAR CACHE
  static clearCourses() {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM courses");
    });
  }
}
