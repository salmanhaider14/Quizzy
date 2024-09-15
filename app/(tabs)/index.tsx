import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { Divider } from "react-native-paper";
import { useCurrentQuiz } from "../../QuizContext";

type Category = {
  id: number;
  name: string;
};

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showQuiz, setShowQuiz } = useCurrentQuiz();

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://opentdb.com/api_category.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data.trivia_categories);
    } catch (error) {
      console.error("Error fetching categories", error);
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (showQuiz) {
      setShowQuiz(false);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00712D" />
          <ThemedText style={styles.loadingText}>
            Loading categories...
          </ThemedText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Button
            mode="contained"
            onPress={fetchCategories}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      );
    }

    return (
      <ThemedView style={{ gap: 20 }}>
        {categories.map((category: Category, index: number) => (
          <ThemedView key={index}>
            <ThemedView
              lightColor="#00712D"
              darkColor="#00712D"
              style={{ padding: 12, alignItems: "center", borderRadius: 13 }}
            >
              <Link
                href={{
                  pathname: "/(tabs)/[id]",
                  params: { id: category.id },
                }}
              >
                <ThemedText
                  type="subtitle"
                  lightColor="white"
                  style={{
                    textAlign: "center",
                    padding: 8,
                    fontFamily: "Poppins_Semibold",
                  }}
                >
                  {category.name.replace(/Entertainment:|Science:/g, "")}
                </ThemedText>
              </Link>
            </ThemedView>
            <Divider />
          </ThemedView>
        ))}
      </ThemedView>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/headerimg.jpeg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer} lightColor="white">
        <ThemedText
          type="title"
          style={{
            marginBottom: 18,
            fontFamily: "Poppins_Bold",
          }}
        >
          Categories
        </ThemedText>
      </ThemedView>

      {renderContent()}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Poppins",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    fontFamily: "Poppins",
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: "#00712D",
  },
});
