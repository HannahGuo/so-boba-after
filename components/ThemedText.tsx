import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
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
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 22,
    lineHeight: 24,
    fontFamily: 'CourierPrime-Regular',
  },
  defaultSemiBold: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: 'CourierPrime-Bold',
  },
  title: {
    fontSize: 80,
    lineHeight: 32,
    fontFamily: 'LondrinaSolid',
  },
  subtitle: {
    fontSize: 40,
    fontFamily: 'LondrinaSolid',
  },
  link: {
    lineHeight: 22,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: 'CourierPrime-Regular',
  },
});
