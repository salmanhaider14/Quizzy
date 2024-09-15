import { createContext, useContext, useState } from "react";

interface QuizContext {
  showQuiz: boolean;
  setShowQuiz: React.Dispatch<React.SetStateAction<boolean>>;
}

export const QuizzContext = createContext<QuizContext | null>(null);

const QuizzProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  return (
    <QuizzContext.Provider value={{ showQuiz, setShowQuiz }}>
      {children}
    </QuizzContext.Provider>
  );
};

export const useCurrentQuiz = () => {
  const currentQuizContext = useContext(QuizzContext);

  if (!currentQuizContext) {
    throw new Error(
      "useCurrentUser has to be used within <QuizzContext.Provider>"
    );
  }

  return currentQuizContext;
};

export default QuizzProvider;
