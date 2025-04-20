import { QuizCategory } from "../types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { mockQuizCategories } from "../data/mockQuestions";
import { Beaker, Film, Landmark, Cpu, Globe } from "lucide-react";

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const CategorySelector = ({
  onSelectCategory,
  selectedCategory,
}: CategorySelectorProps) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Flask":
        return <Beaker size={20} />;
      case "Film":
        return <Film size={20} />;
      case "Landmark":
        return <Landmark size={20} />;
      case "Cpu":
        return <Cpu size={20} />;
      case "Globe":
        return <Globe size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {mockQuizCategories.map((category) => {
        const isSelected = selectedCategory === category.id;

        return (
          <motion.div
            key={category.id}
            className={`flex items-center p-4 rounded-lg cursor-pointer border transition-all
              ${
                isSelected
                  ? "border-neon-purple bg-gray-600/30 shadow-md shadow-neon-purple/10"
                  : "border-gray-600 hover:border-neon-purple/50 hover:bg-gray-600/20"
              }`}
            onClick={() => onSelectCategory(category.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div
              className={`p-2 mr-3 rounded-md ${
                isSelected
                  ? "bg-neon-purple/10 text-neon-purple"
                  : "bg-gray-600/50 text-gray-300"
              }`}
            >
              {getCategoryIcon(category.iconName)}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3
                  className={`font-medium ${
                    isSelected ? "text-white" : "text-gray-300"
                  }`}
                >
                  {category.name}
                </h3>
                {isSelected && (
                  <Check size={18} className="text-neon-purple ml-2" />
                )}
              </div>
              <p
                className={`text-sm mt-1 ${
                  isSelected ? "text-gray-300" : "text-gray-400"
                }`}
              >
                {category.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CategorySelector;
