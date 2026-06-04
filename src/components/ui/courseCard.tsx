import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  price: number;
  duration: number;
  isPremium: boolean;
  isEnrolled: boolean;
}

interface Props {
  course: Course;
  onPress: () => void;
}

const CourseCard: React.FC<Props> = ({ course, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {course.title}
        </Text>

        {course.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>
              Premium
            </Text>
          </View>
        )}
      </View>

      {/* INSTRUCTOR */}
      <Text style={styles.instructor}>
        By {course.instructor}
      </Text>

      {/* INFO ROW */}
      <View style={styles.infoRow}>
        <Text style={styles.info}>
          ⭐ {course.rating}
        </Text>

        <Text style={styles.info}>
          ⏱ {course.duration}h
        </Text>

        <Text style={styles.info}>
          💲 {course.price}
        </Text>
      </View>

      {/* ENROLLED STATUS */}
      {course.isEnrolled && (
        <View style={styles.enrolledBadge}>
          <Text style={styles.enrolledText}>
            Enrolled
          </Text>
        </View>
      )}

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },

  instructor: {
    marginTop: 4,
    color: '#666',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  info: {
    fontSize: 13,
    color: '#444',
  },

  premiumBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  enrolledBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#4caf50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  enrolledText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CourseCard;