import { StyleSheet } from 'react-native';
import { theme } from "@/shared/constants";

export const styles = StyleSheet.create({
  // Estilo base compartilhado por todos os componentes SDUI placeholder
  card: {
    padding: theme.spacing[4],
    margin: theme.spacing[2],
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    ...theme.shadows.sm,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  // SduiRenderer
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
});
