import { useTheme } from '../context/ThemeContext';

export const useThemeColor = () => {
  const { theme, isDark } = useTheme();
  return { colors: theme, isDark };
};