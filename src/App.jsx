import {  useSelector } from 'react-redux';
import Navbar from './components/common/Navbar';
import Login from './screens/auth/Login';

const App = () => {

  const {token} = useSelector((state) => state.Auth);

  return (
    <div className='w-[100vw] h-[100vh] overflow-hidden flex flex-col items-center bg-gray-100'>
      <Navbar />
      <Login />
    </div>
  );
};

export default App;
