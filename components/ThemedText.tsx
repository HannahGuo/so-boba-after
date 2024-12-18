import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultBold' | 'subtitle' | 'subsubtitle' |  'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultBold' ? styles.defaultBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'subsubtitle' ? styles.subsubtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 18,
    fontFamily: 'CourierPrime',
  },
  defaultBold: {
    fontSize: 22,
    fontFamily: 'CourierPrimeBold',
  },
  title: {
    fontSize: 80,
    fontFamily: 'LondrinaSolid',
  },
  subtitle: {
    fontSize: 36,
    fontFamily: 'LondrinaSolid',
  },
  subsubtitle: {
    fontSize: 28,
    fontFamily: 'LondrinaSolid',
  },
  link: {
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: 'CourierPrime',
  },
});
