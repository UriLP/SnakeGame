import { StyleSheet, Text, View } from 'react-native';
import { Coordinate } from '../types/types';

function getRandomFruitEmojist() {
  const fruitEmojist = ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝"]
  const randomIndex = Math.floor(Math.random() * fruitEmojist.length);
  return fruitEmojist[randomIndex];
}
export default function Food({ x, y }: Coordinate): JSX.Element {
  return <Text style={[{ top: y * 10, left: x * 10 }, styles.food]}>{ getRandomFruitEmojist() }</Text>
}

const styles = StyleSheet.create({
  food: {
    width: 20,
    height: 20,
    borderRadius: 7,
    position: 'absolute',
  }
})
