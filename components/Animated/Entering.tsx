import React from 'react';
import { motion } from 'framer-motion';

export const EnteringTop: React.FC<any> = ({ children, ...rest }) => {
  return (
    <motion.div
      initial="top"
      animate="normal"
      variants={{
        top: { y: -50 },
        normal: { y: 0 },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const EnteringBottom: React.FC<any> = ({ children, ...rest }) => {
  return (
    <motion.article
      initial="bottom"
      animate="normal"
      variants={{
        bottom: { y: 50 },
        normal: { y: 0 },
      }}
      {...rest}
    >
      {children}
    </motion.article>
  );
};
