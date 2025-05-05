import { motion, AnimatePresence } from 'framer-motion';
import Waves from '../WavesBG/Waves';
import { Flex } from '@radix-ui/themes';
import logo from "../../assets/Logo-GRUPAC.png"

const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center "
    ><Waves
        lineColor="#6e56cf"
        backgroundColor="rgba(255, 255, 255, 0.2)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      <Flex direction={'column'} align={'center'} gap={'3'} className='bg-glass card-container w-[20%] p-5 !backdrop-blur-sm'>
        <img
          src={logo}
          alt="Loading"
          className="w-20  animate-pulse"
        />
        <p className='heading-1 !text-primary'>Aguarde...</p>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="h-16 w-16 rounded-full border-4 border-t-transparent border-primary"
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