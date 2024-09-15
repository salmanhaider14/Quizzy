import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import he from "he";
import { Button, Divider, RadioButton, useTheme } from "react-native-paper";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

type ResultProps = {
  quizzes: any;
  score: number | null;
  answers: any;
};
const Result = ({ quizzes, score, answers }: ResultProps) => {
  const theme = useColorScheme();
  return (
    <ScrollView>
      <ThemedView
        lightColor="#00712D"
        darkColor="#00712D"
        style={{
          height: 150,
          width: "100%",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <ThemedText
          type="title"
          lightColor="white"
          style={{
            textAlign: "center",
            padding: 8,
            fontFamily: "Poppins_Bold",
          }}
        >
          Result
        </ThemedText>
      </ThemedView>
      <ThemedText style={styles.scoreText}>
        Your Score: {score} / {quizzes?.length}
      </ThemedText>

      {quizzes.map((quiz: any, index: number) => (
        <>
          <View key={index} style={{ marginBottom: 20, marginTop: 10 }}>
            <ThemedText style={styles.questionText}>
              {he.decode(quiz.question)}
            </ThemedText>

            {quiz.allAnswers.map((answer: string, i: number) => {
              const isCorrect = answer === quiz.correct_answer;
              const isUserAnswer = answers[index] === answer;

              return (
                <View key={i} style={styles.answerContainer}>
                  <RadioButton
                    value={answer}
                    status="checked" // Always checked in results
                    color={isCorrect ? "green" : isUserAnswer ? "red" : "gray"}
                    disabled // Disable all after submission
                  />
                  <ThemedText
                    style={{
                      color: isCorrect
                        ? "green"
                        : isUserAnswer
                        ? "red"
                        : theme == "light"
                        ? "black"
                        : "white",
                      fontFamily: "Poppins",
                    }}
                  >
                    {he.decode(answer)}
                  </ThemedText>
                </View>
              );
            })}
          </View>
          <Divider />
        </>
      ))}
    </ScrollView>
  );
};
export default Result;

const styles = StyleSheet.create({
  scoreText: {
    fontSize: 22,
    marginBottom: 20,
    fontFamily: "Poppins_Bold",
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
  },
});
