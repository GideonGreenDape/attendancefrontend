import { motion } from 'framer-motion';
import mvcimage from '../assets/mvcimage.png';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-md py-2 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center">
          <img 
            src={mvcimage} 
            alt="MyDreamConnect Logo" 
            className="h-12 sm:h-14 md:h-16 w-auto"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;