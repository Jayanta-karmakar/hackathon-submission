
import { useState, useEffect } from "react";
import { QuizQuestion as QuestionType } from "../types";
import { motion } from "framer-motion";
import { useQuiz } from "../context/QuizContext";

interface QuizQuestionProps {
  question: QuestionType;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  showCorrectAnswer: boolean;
  isAnswered: boolean;
  timeRemaining: number;
}

const QuizQuestion = ({ 
  question, 
  selectedOption, 
  onSelectOption, 
  showCorrectAnswer,
  isAnswered,
  timeRemaining
}: QuizQuestionProps) => {
  const [timeRemainingWidth, setTimeRemainingWidth] = useState("100%");
  
  // Update timer width
  useEffect(() => {
    setTimeRemainingWidth(`${(timeRemaining / 10) * 100}%`);
  }, [timeRemaining]);
  
  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Timer */}
      <div className="quiz-countdown">
        <motion.div 
          className="quiz-countdown-progress"
          initial={{ width: "100%" }}
          animate={{ width: timeRemainingWidth }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </div>
      
      {/* Question */}
      <div className="mt-4 mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-1 neon-text">
          {question.question}
        </h2>
      </div>
      
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = showCorrectAnswer && index === question.correctOption;
          const isIncorrect = showCorrectAnswer && isSelected && index !== question.correctOption;
          
          let optionClass = "answer-option";
          if (isSelected) optionClass += " border-neon-purple shadow-neon-purple/30";
          if (isCorrect) optionClass += " answer-option-correct";
          if (isIncorrect) optionClass += " answer-option-incorrect";
          
          return (
            <motion.button
              key={index}
              className={optionClass}
              onClick={() => !isAnswered && onSelectOption(index)}
              disabled={isAnswered}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
            >
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neon-purple/20 text-sm mr-3 mt-0.5">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuizQuestion;
