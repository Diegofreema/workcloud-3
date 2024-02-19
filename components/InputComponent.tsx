import { StyleSheet, View, Text } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useDarkMode } from '../hooks/useDarkMode';
import { colors } from '../constants/Colors';
import { fontFamily } from '../constants';

type Props = TextInputProps & {
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  label?: string;
  setToggle?: () => void;
  password?: boolean;
  id?: string;
  numberOfLines?: number;
};

export const InputComponent = ({
  onChangeText,
  placeholder,
  value,
  keyboardType,
  secureTextEntry,
  setToggle,
  id,
  password,
  label,
  numberOfLines,
  ...props
}: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  const handleToggle = (inputId: string) => {
    if (id === inputId) {
      setToggle && setToggle();
    }
  };
  return (
    <>
      {label && (
        <Text
          style={{
            marginBottom: 5,
            fontFamily: fontFamily.Bold,
            fontSize: 12,
            color: darkMode ? 'white' : 'black',
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        {...props}
        activeUnderlineColor="transparent"
        numberOfLines={numberOfLines}
        placeholderTextColor={'black'}
        style={{
          backgroundColor: '#E9E9E9',
        }}
        contentStyle={{
          color: 'black',
          fontFamily: fontFamily.Medium,
          fontSize: 13,
        }}
        right={
          password && (
            <TextInput.Icon
              id={id}
              icon={secureTextEntry ? 'eye' : 'eye-off'}
              onPress={() => handleToggle(id as string)}
            />
          )
        }
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </>
  );
};

const styles = StyleSheet.create({});
