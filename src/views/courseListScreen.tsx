import CourseCard from '@/components/ui/courseCard';
import { setCourses, setLastSynced, setOffline } from '@/store/courseSlice';
import { RootState } from '@/store/store';
import { CourseListViewModel } from '@/viewmodels/courseListViewModel';
import { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const courseListScreen = () => {
 
  const dispatch = useDispatch();
  const { courses, offline, lastSyncedAt } =
    useSelector((state: RootState) => state.course);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState('rating');

  // LOAD LOCAL FIRST
  useEffect(() => {
    loadLocal();
    sync();
  }, []);

  const loadLocal = async () => {
    const data:any = await CourseListViewModel.loadCourses();
    dispatch(setCourses(data));
  };

  const sync = async () => {
    try {
      const data:any = await CourseListViewModel.syncCourses();
      dispatch(setCourses(data));
      dispatch(setLastSynced(new Date().toISOString()));
    } catch (e) {
      dispatch(setOffline(true));
    }
  };

  const loadQuery = async () => {
    const data:any = await CourseListViewModel.query({
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
        <Text>
          Offline Mode
        </Text>
      )}

      {/* LAST SYNC */}
      {lastSyncedAt && (
        <Text>
          Last synced: {lastSyncedAt}
        </Text>
      )}

      {/* SEARCH */}
      <TextInput
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={loadQuery}
      />

      {/* LIST */}
      <FlatList
        data={courses}
        keyExtractor={i => i.id.toString()}
        renderItem={({ item }:any) => (
          <CourseCard course={item} onPress={() => {}} />
        )}
        refreshing={false}
        onRefresh={sync}
      />

    </View>
  );
};



export default courseListScreen