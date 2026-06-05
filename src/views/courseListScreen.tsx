import CourseCard from "@/components/ui/courseCard";
import { setCourses, setLastSynced, setOffline } from "@/store/courseSlice";
import { RootState } from "@/store/store";
import { CourseListViewModel } from "@/viewmodels/courseListViewModel";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const CourseListScreen = () => {
  const dispatch = useDispatch();

  const { courses, offline, lastSyncedAt } = useSelector(
    (state: RootState) => state.course,
  );

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<{
    premium?: boolean;
    enrolled?: boolean;
  }>({});

  const [sort, setSort] = useState<"rating" | "price" | "duration">("rating");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setLoading(true);

      // cached data instantly
      const local = await CourseListViewModel.loadCourses();
      dispatch(setCourses(local));

      // background sync
      sync();
    } catch (e) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const sync = async () => {
    try {
      dispatch(setOffline(false));

      const data = await CourseListViewModel.syncCourses();

      dispatch(setCourses(data));
      dispatch(setLastSynced(new Date().toISOString()));

      setError("");
    } catch (e) {
      dispatch(setOffline(true));
      setError("Unable to sync with server");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await sync();

    setRefreshing(false);
  };

  const runQuery = async () => {
    try {
      const data = await CourseListViewModel.query({
        search,
        filter,
        sort,
      });

      dispatch(setCourses(data));
    } catch (e) {
      setError("Search failed");
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <ActivityIndicator size="large" />
        <Text>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {/* OFFLINE */}
      {offline && (
        <Text
          style={{
            color: "red",
            marginBottom: 8,
          }}>
          Offline Mode
        </Text>
      )}

      {/* ERROR */}
      {error !== "" && (
        <Text
          style={{
            color: "red",
            marginBottom: 10,
          }}>
          {error}
        </Text>
      )}

      {/* SEARCH */}
      <TextInput
        placeholder="Search title, tags, instructor..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={runQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      />

      {/* FILTERS */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}>
        <Button
          title="Premium"
          onPress={() => {
            setFilter({
              ...filter,
              premium: true,
            });
          }}
        />

        <Button
          title="Free"
          onPress={() => {
            setFilter({
              ...filter,
              premium: false,
            });
          }}
        />

        <Button
          title="Enrolled"
          onPress={() => {
            setFilter({
              ...filter,
              enrolled: true,
            });
          }}
        />

        <Button
          title="All"
          onPress={() => {
            setFilter({});
          }}
        />
      </View>

      {/* SORT */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 10,
        }}>
        <Button
          title="Rating"
          onPress={() => {
            setSort("rating");
            runQuery();
          }}
        />

        <Button
          title="Price"
          onPress={() => {
            setSort("price");
            runQuery();
          }}
        />

        <Button
          title="Duration"
          onPress={() => {
            setSort("duration");
            runQuery();
          }}
        />
      </View>

      {/* EMPTY */}
      {courses.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text>No courses found</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <CourseCard course={item} onPress={() => {}} />
          )}
        />
      )}
    </View>
  );
};

export default CourseListScreen;
