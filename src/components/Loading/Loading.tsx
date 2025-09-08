import { motion, AnimatePresence } from 'framer-motion';
import { Flex } from '@radix-ui/themes';
import logo from "../../assets/Logo-GRUPAC-white.png"
import BackgroundComponent from '../Background/Background';

const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center "
    >
      <div className="absolute w-full">
        <BackgroundComponent />
      </div>
      <Flex direction={'column'} align={'center'} gap={'3'} className='bg-glass card-container w-[50%] max-sm:w-[80%] p-5 !backdrop-blur-sm bg-glass relative z-20'>
        <img
          src={logo}
          alt="Loading"
          className="w-40  animate-pulse"
        />
        <p className='heading-1 !text-white'>Aguarde...</p>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="h-16 w-16 rounded-full border-4 border-t-transparent border-white"
        />
      </Flex>

    </motion.div>

  );
};

export const PageLoader = () => {

  return (
    <AnimatePresence>
      <Loading />
    </AnimatePresence>
  );
};