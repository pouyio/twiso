import React from 'react';
import { motion } from 'framer-motion';

export const TappableLi: React.FC<any> = ({ children, ...rest }) => {
  return (
    <motion.li
      whileTap={{ scale: 1.03, transition: { duration: 0.02 } }}
      whileHover={{ scale: 1.03, transition: { duration: 0.05 } }}
      {...rest}
    >
      {children}
    </motion.li>
  );
};
