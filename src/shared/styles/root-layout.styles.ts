import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  forceUpdateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  forceUpdateTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  forceUpdateBody: { textAlign: 'center', marginBottom: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  errorBody: { textAlign: 'center', marginBottom: 24, color: '#555' },
});
