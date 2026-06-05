import CourseCard from "@/components/ui/courseCard";
import { setCourses, setLastSynced, setOffline } from "@/store/courseSlice";
import { RootState } from "@/store/store";
import { CourseListViewModel } from "@/viewmodels/courseListViewModel";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const courseListScreen = () => {
  const dispatch = useDispatch();
  const { courses, offline, lastSyncedAt } = useSelector(
    (state: RootState) => state.course,
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState("rating");

  // LOAD LOCAL FIRST
  useEffect(() => {
    loadLocal();
    sync();
  }, []);

  const loadLocal = async () => {
    const data: any = await CourseListViewModel.loadCourses();
    dispatch(setCourses(data));
  };

  const sync = async () => {
    try {
      const data: any = await CourseListViewModel.syncCourses();
      dispatch(setCourses(data));
      dispatch(setLastSynced(new Date().toISOString()));
    } catch (e) {
      dispatch(setOffline(true));
    }
  };

  const loadQuery = async () => {
    const data: any = await CourseListViewModel.query({
      search,
      filter,
      sort,
    });

    dispatch(setCourses(data));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* OFFLINE INDICATOR */}
      {offline && (
        <Text style={{ marginLeft: 10, marginTop: 10, marginBottom: 10 }}>
          Offline Mode
        </Text>
      )}

      {/* SEARCH */}
      <TextInput
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={loadQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginHorizontal: 10,
          marginVertical: 5,
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      />

      {/* LIST */}
      <FlatList
        data={courses}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }: any) => (
          <CourseCard
            course={item}
            onPress={() =>
              router.push({
                pathname: "/course-detail/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        refreshing={false}
        onRefresh={sync}
      />
    </View>
  );
};

export default courseListScreen;
