import { Text, type TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  className?: string;
}

function makeTextComponent(baseClassName: string, displayName: string) {
  function TypographyComponent({ className = '', ...props }: TypographyProps) {
    return <Text className={`${baseClassName} ${className}`.trim()} {...props} />;
  }
  TypographyComponent.displayName = displayName;
  return TypographyComponent;
}

export const Display = makeTextComponent('font-display text-display text-neutral-900', 'Display');
export const H1 = makeTextComponent('font-display text-h1 text-neutral-900', 'H1');
export const H2 = makeTextComponent('font-display-medium text-h2 text-neutral-900', 'H2');
export const H3 = makeTextComponent('font-display-medium text-h3 text-neutral-900', 'H3');
export const BodyLarge = makeTextComponent('font-body text-body-lg text-neutral-900', 'BodyLarge');
export const Body = makeTextComponent('font-body text-body text-neutral-700', 'Body');
export const Caption = makeTextComponent(
  'font-body-medium text-caption text-neutral-500',
  'Caption',
);
export const Overline = makeTextComponent(
  'font-body-semibold text-overline uppercase tracking-widest text-neutral-500',
  'Overline',
);
