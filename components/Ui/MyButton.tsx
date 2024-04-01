import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ButtonProps, Button } from 'react-native-paper';
import { colors } from '../../constants/Colors';
import { fontFamily } from '../../constants/index';

type Props = ButtonProps & {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  buttonColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export const MyButton = ({
  children,
  contentStyle,
  buttonColor = colors.dialPad,
  textColor = 'white',
  style,
  labelStyle,
  ...props
}: Props): JSX.Element => {
  return (
    <Button
      {...props}
      rippleColor={colors.ripple}
      contentStyle={[contentStyle]}
      textColor={textColor}
      buttonColor={buttonColor}
      style={[
        {
          borderRadius: 5,
        },
        style,
      ]}
      labelStyle={[
        {
          fontFamily: fontFamily.Medium,
          fontSize: 14,

          width: '100%',
        },
        labelStyle,
      ]}
    >
      {children}
    </Button>
  );
};
