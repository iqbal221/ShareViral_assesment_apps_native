import { Course } from "@/models/course";
import { supabase } from "../api/supabase";
import db from "../database/sqlite";

export class CourseRepository {
  // 1. LOCAL LOAD
  static async getLocalCourses(): Promise<Course[]> {
    const rows = db.getAllSync("SELECT * FROM courses");

    return rows.map((c: any) => ({
      id: String(c.id),
      title: c.title ?? "",
      instructor: c.instructor ?? "",
      tags: this.safeParseTags(c.tags),
      price: Number(c.price ?? 0),
      rating: Number(c.rating ?? 0),
      duration: Number(c.duration ?? 0),
      isPremium: Boolean(c.isPremium),
      isEnrolled: Boolean(c.isEnrolled),
      last_updated: c.last_updated,
    }));
  }

  // 2. REMOTE LOAD (FIXED TYPE MAPPING)
  static async fetchRemoteCourses(): Promise<Course[]> {
    const { data, error } = await supabase.from("courses").select("*");

    console.log("error courses:", error);

    console.log("Parsed remote courses:", data);
    if (error) throw error;

    return (data ?? []).map(
      (c: any): Course => ({
        id: String(c.course_id),
        title: c.title,
        instructor: c.instructor_name,
        tags: Array.isArray(c.tags) ? c.tags : [],
        price: Number(c.price_usd),
        rating: Number(c.rating),
        duration: Number(c.duration_weeks),
        isPremium: Boolean(c.is_premium),
        isEnrolled: false,
        last_updated: c.last_updated ?? new Date().toISOString(), // For future sync logic
      }),
    );
  }

  // 3. SAVE TO SQLITE
  static saveToLocal(courses: Course[]) {
    courses.forEach((c) => {
      db.runSync(
        `INSERT OR REPLACE INTO courses
      (id, title, instructor, tags, price, rating, duration, isPremium, isEnrolled, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          c.last_updated,
        ],
      );
    });
  }

  // 4. LOAD ENTRY
  static async loadCourses(): Promise<Course[]> {
    return this.getLocalCourses();
  }

  // 5. SYNC
  static async syncCourses(): Promise<Course[]> {
    try {
      const remote = await this.fetchRemoteCourses();

      if (remote.length > 0) {
        this.saveToLocal(remote);
      }

      return await this.getLocalCourses();
    } catch (error) {
      console.log("Sync failed:", error);
      return await this.getLocalCourses();
    }
  }

  // 6. QUERY
  static async queryCourses(params: {
    search?: string;
    filter?: { premium?: boolean; enrolled?: boolean };
    sort?: "rating" | "price" | "duration";
  }): Promise<Course[]> {
    let courses = await this.getLocalCourses();

    // SEARCH
    if (params.search) {
      const q = params.search.toLowerCase();

      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)),
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
    switch (params.sort) {
      case "rating":
        courses.sort((a, b) => b.rating - a.rating);
        break;
      case "price":
        courses.sort((a, b) => a.price - b.price);
        break;
      case "duration":
        courses.sort((a, b) => a.duration - b.duration);
        break;
    }

    return courses;
  }

  // SAFE PARSER
  private static safeParseTags(tags: any): string[] {
    try {
      if (!tags) return [];
      if (Array.isArray(tags)) return tags;
      return JSON.parse(tags);
    } catch {
      return [];
    }
  }

  static updateEnrollment(id: string, isEnrolled: boolean) {
    return new Promise((resolve, reject) => {
      try {
        db.runSync?.("UPDATE courses SET isEnrolled = ? WHERE id = ?", [
          isEnrolled ? 1 : 0,
          id,
        ]);

        resolve(true);
      } catch (error) {
        console.log("Update enrollment error:", error);
        reject(error);
      }
    });
  }
}
