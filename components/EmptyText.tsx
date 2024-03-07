import { Text } from 'react-native-paper';
import { useDarkMode } from '../hooks/useDarkMode';

type Props = {
  text: string;
};

export const EmptyText = ({ text }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();

  return (
    <Text
      style={{
        color: darkMode ? 'white' : 'black',
        fontFamily: 'PoppinsMedium',
        verticalAlign: 'middle',
        marginTop: 10,
      }}
      variant="titleSmall"
    >
      {text}
    </Text>
  );
};
