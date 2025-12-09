import { motion } from 'motion/react';
import { useTranslate } from '../../hooks/useTranslate';
import Emoji from '../Emoji';

export const EmptySeason = () => {
  const { t } = useTranslate();
  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 5 }}
      className="py-3 text-center text-sm"
    >
      <p className="bg-gray-100 rounded-xl p-8 inline-block">
        {t('no-episodes')} <Emoji emoji="📅" />
      </p>
    </motion.div>
  );
};
