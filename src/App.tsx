import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
// Components
import QuestionCard from './components/QuestionCard';
// types
import { QuestionsState } from './API';
// Styles
import { GlobalStyle, Wrapper, DifficultyWrapper } from './App.styles';
import { useDispatch, useSelector } from 'react-redux';
import {
    addQuestions,
    getGameOver,
    getLoading,
    getQuestion,
    setGameOver,
    setLoading,
    setDifficultyLevel,
    getDifficultyLevel,
} from './store/toDoQuiz';

export type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App: React.FC = () => {
    const [number, setNumber] = useState(0);
    const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
    const [score, setScore] = useState(0);

    const dispatch = useDispatch();
    const questions = useSelector(getQuestion);
    const loading = useSelector(getLoading);
    const gameOver = useSelector(getGameOver);
    const difficultyLevel = useSelector(getDifficultyLevel);

    const startTrivia = async () => {
        dispatch(setLoading(true));
        dispatch(setGameOver(false));
        const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, difficultyLevel);
        dispatch(addQuestions(newQuestions));
        setScore(0);
        setUserAnswers([]);
        setNumber(0);
        dispatch(setLoading(false));
    };

    const checkAnswer = (e: any) => {
        if (!gameOver) {
            // User's answer
            const answer = e.currentTarget.value;
            // Check answer against correct answer
            const correct = questions[number].correct_answer === answer;
            // Add score if answer is correct
            if (correct) setScore((prev) => prev + 1);
            // Save the answer in the array for user answers
            const answerObject = {
                question: questions[number].question,
                answer,
                correct,
                correctAnswer: questions[number].correct_answer,
            };
            setUserAnswers((prev) => [...prev, answerObject]);
        }
    };

    const nextQuestion = () => {
        // Move on to the next question if not the last question
        const nextQ = number + 1;

        if (nextQ === TOTAL_QUESTIONS) {
            dispatch(setGameOver(false));
        } else {
            setNumber(nextQ);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Wrapper>
                <h1>HAPPY QUIZ</h1>
                {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
                    <button className="start" onClick={startTrivia}>
                        Start
                    </button>
                ) : null}
                {!gameOver ? <p className="score">Score: {score}</p> : null}
                {loading ? <p>Loading Questions...</p> : null}
                {!loading && !gameOver && (
                    <QuestionCard
                        questionNr={number + 1}
                        totalQuestions={TOTAL_QUESTIONS}
                        question={questions[number].question}
                        answers={questions[number].answers}
                        userAnswer={userAnswers ? userAnswers[number] : undefined}
                        callback={checkAnswer}
                    />
                )}
                {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
                    <button className="next" onClick={nextQuestion}>
                        Next Question
                    </button>
                ) : null}
                {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
                    <DifficultyWrapper>
                        <h2>Level of Difficulty</h2>
                        <form>
                            <select onChange={(e) => dispatch(setDifficultyLevel(e.target.value))}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </form>
                    </DifficultyWrapper>
                ) : null}
            </Wrapper>
        </>
    );
};

export default App;
