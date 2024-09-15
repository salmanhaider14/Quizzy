import QuizDisplay from "@/components/QuizDisplay";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCurrentQuiz } from "@/QuizContext";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SegmentedButtons, Button, Checkbox } from "react-native-paper";

export default function QuizScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const refinedId = id.replace("(tabs)", "");

  const [numberOfQuestions, setNumberOfQuestions] = useState("10");
  const [difficulty, setDifficulty] = useState("easy");
  const [checked, setChecked] = useState(false);
  const [useTimer, setUseTimer] = useState(false);
  const [timerValue, setTimerValue] = useState(30);

  const { showQuiz, setShowQuiz } = useCurrentQuiz();

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };
  useEffect(() => setShowQuiz(false), [id]);

  const handleTimerToggle = () => {
    setUseTimer(!useTimer);
    setChecked(!checked);
  };
  const handleTimerOptionChange = (value: string) => {
    setTimerValue(Number(value));
  };

  if (showQuiz) {
    return (
      <ThemedView style={styles.container}>
        <QuizDisplay
          id={refinedId}
          numberOfQuestions={numberOfQuestions}
          difficulty={difficulty}
          useTimer={useTimer}
          timerValue={timerValue}
        />
      </ThemedView>
    );
  } else {
    return (
      <ThemedView style={styles.container}>
        <>
          <ThemedView
            lightColor="#00712D"
            darkColor="#00712D"
            style={{
              height: 200,
              width: "100%",
              justifyContent: "center",
              marginBottom: 9,
            }}
          >
            <ThemedText
              type="title"
              lightColor="white"
              style={{
                textAlign: "center",
                fontFamily: "Poppins_Bold",
              }}
            >
              Configure Quiz
            </ThemedText>
          </ThemedView>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 30,
              padding: 8,
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Number of Questions Selection */}
              <ThemedText
                type="subtitle"
                lightColor="black"
                style={{
                  padding: 8,
                  alignSelf: "flex-start",
                  fontFamily: "Poppins_Semibold",
                }}
              >
                Number of Questions
              </ThemedText>
              <SegmentedButtons
                value={numberOfQuestions}
                onValueChange={setNumberOfQuestions}
                buttons={[
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "30", label: "30" },
                  { value: "40", label: "40" },
                  { value: "50", label: "50" },
                ]}
                style={styles.segmentedButtons}
                theme={{
                  colors: {
                    secondaryContainer: "#00712D",
                    onSecondaryContainer: "white",
                  },
                }}
              />
            </View>

            {/* Difficulty Selection */}
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedText
                type="subtitle"
                lightColor="black"
                style={{
                  padding: 8,
                  alignSelf: "flex-start",
                  fontFamily: "Poppins_Semibold",
                }}
              >
                Difficulty
              </ThemedText>
              <SegmentedButtons
                value={difficulty}
                onValueChange={setDifficulty}
                buttons={[
                  { value: "easy", label: "Easy" },
                  { value: "medium", label: "Medium" },
                  { value: "hard", label: "Hard" },
                ]}
                style={styles.segmentedButtons}
                theme={{
                  colors: {
                    secondaryContainer: "#00712D",
                    onSecondaryContainer: "white",
                  },
                }}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "flex-start",
                alignItems: "center",
                marginLeft: 15,
                gap: 8,
              }}
            >
              <ThemedText
                type="subtitle"
                style={{ fontFamily: "Poppins_Semibold" }}
              >
                Enable Timer
              </ThemedText>
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={handleTimerToggle}
                color="#00712D"
              />
            </View>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {useTimer && (
                <SegmentedButtons
                  value={String(timerValue)}
                  onValueChange={handleTimerOptionChange}
                  buttons={[
                    { value: "30", label: "30 seconds" },
                    { value: "60", label: "60 seconds" },
                    { value: "90", label: "90 seconds" },
                  ]}
                  style={styles.segmentedButtons}
                  theme={{
                    colors: {
                      secondaryContainer: "#00712D",
                      onSecondaryContainer: "white",
                    },
                  }}
                />
              )}
            </View>
            <Button
              mode="contained"
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 12,
                backgroundColor: "#00712D",
                width: "100%",
              }}
              onPress={handleStartQuiz}
              labelStyle={{
                fontWeight: "bold",
                fontSize: 16,
                fontFamily: "Poppins_Semibold",
              }}
              contentStyle={{ width: "100%" }}
            >
              {" "}
              START
            </Button>
          </View>
        </>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  segmentedButtons: {
    marginVertical: 10,
  },
});
