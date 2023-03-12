import * as React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import { Coordinate, Direction, GestureEventType } from '../types/types';
import { randomFoodPosition } from '../utils/randomFoodPosition';
import { checkEatsFood } from '../utils/checkEatsFood';
import { checkGameOver } from '../utils/checkGameOver';
import { Colors } from '../styles/colors';
import Header from './Header';
import Snake from './Snake';
import Food from './Food';

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { xMin: 0, xMax: 34, yMin: 0, yMax: 65 };
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

export default function Game(): JSX.Element {
  const [direction, setDirection] = React.useState<Direction>(Direction.Right);
  const [snake, setSnake] = React.useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = React.useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const [score, setScore] = React.useState<number>(0);

  React.useEffect(() => {
    if (!isGameOver) {
      const intervalID = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);

      return () => clearInterval(intervalID);
    }
  }, [isGameOver, snake, isPaused]);

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead }; // create a copy

    // game over
    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      setIsGameOver((prev) => !prev);
      return;
    }

    switch (direction) {
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
      default:
        break;
    }

    // check if eats food
    if (checkEatsFood(newHead, food, 2)) {
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax))
      setSnake([newHead, ...snake]);
      setScore(score + SCORE_INCREMENT);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]) // move snake
    }

  }
  
  const handleGesture = (event: GestureEventType ) => {
    const { translationX, translationY } = event.nativeEvent;
    
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        setDirection(Direction.Right);
      } else {
        setDirection(Direction.Left);
      }
    } else {
      if (translationY > 0) {
        setDirection(Direction.Down);
      } else {
        setDirection(Direction.Up);
      }
    }
  }

  const reloadGame = () => {
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setDirection(Direction.Right);
    setIsPaused(false);
  }

  const pauseGame = () => {
    setIsPaused(!isPaused);
  }

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
        <SafeAreaView style={styles.container}>
            <Header
              reloadGame={reloadGame}
              isPaused={isPaused}
              pauseGame={pauseGame}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: Colors.secondary,
                }}
              >{score}</Text>
            </Header>
            <View style={styles.boundaries} >
              <Snake snake={snake} />
              <Food x={food.x} y={food.y} />
            </View>
        </SafeAreaView>
    </PanGestureHandler>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  boundaries: {
    flex: 1,
    borderWidth: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderColor: Colors.tertiary,
    backgroundColor: Colors.background
  }
});
