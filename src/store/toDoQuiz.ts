import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { QuestionsState } from '../API';

interface IState {
    questions: Array<QuestionsState>;
    loading: boolean;
    gameOver: boolean;
    difficultyLevel: string;
}

const initialState: IState = {
    questions: [],
    loading: false,
    gameOver: true,
    difficultyLevel: 'easy',
};

export const toDoQuiz = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        addQuestions: (state, action: PayloadAction<QuestionsState[]>) => {
            state.questions = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setGameOver: (state, action: PayloadAction<boolean>) => {
            state.gameOver = action.payload;
        },
        setDifficultyLevel: (state, action: PayloadAction<string>) => {
            state.difficultyLevel = action.payload;
        },

        // setTodos(todos.map((todo) => (todo.id === id ? { ...todo, todo: editTodo } : todo)));
        // incrementByAmount: (state, action: PayloadAction<number>) => {
        //     state.value += action.payload;
        // },
    },
});

// Action creators are generated for each case reducer function
export const { addQuestions, setLoading, setGameOver, setDifficultyLevel } = toDoQuiz.actions;

export const getQuestion = (state: RootState) => state.quiz.questions;
export const getLoading = (state: RootState) => state.quiz.loading;
export const getGameOver = (state: RootState) => state.quiz.gameOver;
export const getDifficultyLevel = (state: RootState) => state.quiz.difficultyLevel;

export default toDoQuiz.reducer;
