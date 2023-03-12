export enum Direction {
    Right,
    Left,
    Up,
    Down,
}

export interface GestureEventType {
    nativeEvent: { translationX: number; translationY: number; };
}

export interface Coordinate {
    x: number;
    y: number;
}