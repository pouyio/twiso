import { motion } from 'motion/react';

export const Underline: React.FC<{ selected: boolean }> = ({ selected }) => {
  return (
    <div className="border-b-2 border-transparent h-0.5 w-full">
      {selected && (
        <motion.div
          layoutId="underline-tab"
          className="bg-blue-300 h-0.5 w-full"
        />
      )}
    </div>
  );
};
