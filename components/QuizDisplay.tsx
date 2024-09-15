import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  RadioButton,
  Button,
  ActivityIndicator,
  MD2Colors,
  Divider,
  Icon,
  MD3Colors,
} from "react-native-paper";
import he from "he";
import { useCurrentQuiz } from "@/QuizContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";
import Result from "./Result";

const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type QuizDisplayProps = {
  id: string;
  numberOfQuestions: string;
  difficulty: string;
  useTimer: boolean;
  timerValue: number;
};
const QuizDisplay = ({
  id,
  numberOfQuestions,
  difficulty,
  useTimer,
  timerValue,
}: QuizDisplayProps) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timerValue);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { setShowQuiz } = useCurrentQuiz();

  async function GrabQuizzes() {
    setIsLoading(true);
    setErrorMessage(null);
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const req = await fetch(
          `https://opentdb.com/api.php?amount=${numberOfQuestions}&type=multiple&category=${id}&difficulty=${difficulty}`
        );
        const res = await req.json();
        console.log("Response Code:", res.response_code);

        switch (res.response_code) {
          case 0:
            const shuffledQuizzes = res.results?.map((quiz: any) => ({
              ...quiz,
              allAnswers: shuffleArray([
                ...quiz.incorrect_answers,
                quiz.correct_answer,
              ]),
            }));
            setQuizzes(shuffledQuizzes);
            setIsLoading(false);
            return;
          case 1:
            setErrorMessage(
              "Not enough questions available. Please try different settings (e.g., fewer questions or a different category)."
            );
            setIsLoading(false);
            return;
          case 5:
            console.warn("Rate limit exceeded, waiting before retry");
            await delay(5000);
            retries++;
            break;
          default:
            console.error("Unexpected response code:", res.response_code);
            setErrorMessage(
              "An unexpected error occurred. Please try again later."
            );
            setIsLoading(false);
            return;
        }
      } catch (error) {
        console.error("Error fetching quizzes", error);
        setErrorMessage(
          "Failed to fetch quizzes. Please check your internet connection and try again."
        );
        setIsLoading(false);
        return;
      }
    }

    if (retries >= maxRetries) {
      setErrorMessage(
        "Unable to fetch quizzes due to rate limiting. Please try again later."
      );
      setIsLoading(false);
    }
  }
  useEffect(() => {
    GrabQuizzes();
  }, [id]);

  useEffect(() => {
    if (useTimer && timeRemaining > 0) {
      const timerId = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
    if (timeRemaining === 0 && useTimer && quizzes?.length > 0) {
      handleNext();
    }
  }, [timeRemaining, useTimer]);

  const handleAnswerSelect = (
    questionIndex: number,
    selectedAnswer: string
  ) => {
    setAnswers({ ...answers, [questionIndex]: selectedAnswer });
  };
  const handleNext = () => {
    if (currentIndex < quizzes?.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeRemaining(timerValue);
    } else {
      calculateScore();
      setIsSubmitted(true);
    }
  };
  const calculateScore = () => {
    let correctCount = 0;
    quizzes.forEach((quiz, index) => {
      if (answers[index] === quiz.correct_answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };
  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setScore(null);
    setIsSubmitted(false);
    setQuizzes([]);
    setShowQuiz(false);
    GrabQuizzes();
    setTimeRemaining(timerValue);
  };

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator
            animating={true}
            color={MD2Colors.green600}
            size={"large"}
          />
        ) : errorMessage ? (
          <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
        ) : !isSubmitted ? (
          quizzes?.length > 0 && (
            <View style={{ gap: 20, padding: 10, marginTop: 5 }}>
              {useTimer && (
                <ThemedText style={styles.timerText}>
                  <Icon source="clock" color={MD3Colors.neutral50} size={20} />{" "}
                  {timeRemaining} seconds
                </ThemedText>
              )}

              <ThemedText
                type="subtitle"
                style={{ fontFamily: "Poppins_Semibold" }}
              >
                Question #{currentIndex + 1}
              </ThemedText>
              <ThemedText style={styles.questionText}>
                {he.decode(quizzes[currentIndex].question)}
              </ThemedText>
              <RadioButton.Group
                onValueChange={(newValue) =>
                  handleAnswerSelect(currentIndex, newValue)
                }
                value={answers[currentIndex] || ""}
              >
                {quizzes[currentIndex].allAnswers?.map(
                  (answer: string, index: number) => (
                    <View key={index} style={styles.answerContainer}>
                      <RadioButton value={answer} color="#00712D" />
                      <ThemedText style={{ fontFamily: "Poppins" }}>
                        {he.decode(answer)}
                      </ThemedText>
                    </View>
                  )
                )}
              </RadioButton.Group>

              <Button
                icon="arrow-right"
                mode="contained"
                onPress={handleNext}
                disabled={!answers[currentIndex]}
                buttonColor="#00712D"
              >
                {currentIndex < quizzes?.length - 1 ? "Next" : "Submit"}
              </Button>
            </View>
          )
        ) : (
          <ScrollView>
            <Result quizzes={quizzes} score={score} answers={answers} />
            <Button
              mode="contained"
              buttonColor="#00712D"
              onPress={handleRestart}
            >
              Restart
            </Button>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default QuizDisplay;

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  answerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    fontFamily: "Poppins",
  },
  scoreText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  resultContainer: {
    marginBottom: 20,
    marginTop: 8,
  },
  answerText: {
    fontSize: 16,
    marginBottom: 5,
  },
  correctAnswer: {
    color: "green",
    fontWeight: "bold",
  },
  incorrectAnswer: {
    color: "red",
    fontWeight: "bold",
  },
  questionSubtitle: {
    fontSize: 16,
    color: "gray",
  },
  timerText: {
    fontSize: 18,
    color: "red",
    fontFamily: "Poppins",
    textAlign: "right",
    lineHeight: -15,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Poppins_Semibold",
  },
});
