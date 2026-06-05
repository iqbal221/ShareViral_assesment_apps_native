import { CourseRepository } from "@/database/courseRepository";

export class CourseListViewModel {
  static async loadCourses() {
    return await CourseRepository.getLocalCourses();
  }
  static async syncCourses() {
    const remote = await CourseRepository.fetchRemoteCourses();
    await CourseRepository.saveToLocal(remote);
    return remote;
  }
  static async query(params: any) {
    return await CourseRepository.queryCourses(params);
  }
}
