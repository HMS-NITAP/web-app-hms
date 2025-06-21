import {  useSelector } from 'react-redux';
import Navbar from './components/Navbar';

const App = () => {

  const {token} = useSelector((state) => state.Auth);

  return (
    <div className='w-[100vw] h-[100vh] overflow-hidden flex justify-center bg-gray-100'>
      <Navbar />
    </div>
  );
};

export default App;
