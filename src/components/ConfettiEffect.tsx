import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface ConfettiEffectProps {
  trigger: boolean;
  duration?: number;
}

const ConfettiEffect = ({ trigger, duration = 3000 }: ConfettiEffectProps) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger && !active) {
      setActive(true);

      const end = Date.now() + duration;

      // Create canvas element for confetti
      const canvas = document.createElement("canvas");
      canvas.className = "confetti-container";
      document.body.appendChild(canvas);

      // Initialize confetti
      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true,
      });

      // Launch confetti
      const frame = () => {
        myConfetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#9b87f5", "#7E69AB", "#D946EF"],
        });

        myConfetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#9b87f5", "#7E69AB", "#D946EF"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          // Clean up
          setActive(false);
          canvas.remove();
        }
      };

      frame();

      return () => {
        // Clean up if component unmounts
        canvas.remove();
      };
    }
  }, [trigger, active, duration]);

  return null;
};

export default ConfettiEffect;
