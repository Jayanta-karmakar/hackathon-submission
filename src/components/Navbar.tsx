
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-full py-4 px-6 md:px-8 flex items-center justify-between border-b border-neon-purple/30">
      <Link to="/" className="flex items-center">
        <h1 className="text-2xl font-bold neon-text">NEON QUIZ</h1>
      </Link>
      
      <div className="flex items-center space-x-4">
        <Link 
          to="/about" 
          className="hover:text-neon-purple transition-colors duration-300"
        >
          About
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
