import { StyleSheet, Text, View } from 'react-native';

export default function ExploreTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are in the right project ✅</Text>
      <Text style={styles.text}>
        This tab replaces the default Expo welcome content. Use the Home tab to manage inventory.
      </Text>
      <Text style={styles.text}>Next features to add:</Text>
      <Text style={styles.bullet}>• Sales checkout flow</Text>
      <Text style={styles.bullet}>• Authentication (owner/staff)</Text>
      <Text style={styles.bullet}>• Daily sales report</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
    gap: 10
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a'
  },
  text: {
    fontSize: 15,
    color: '#334155'
  },
  bullet: {
    fontSize: 15,
    color: '#1e293b'
  }
});
