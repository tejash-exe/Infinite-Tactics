import React from 'react';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className='min-h-screen w-screen flex justify-center items-center '>
      <div className='w-[25rem] h-full'>
        <Outlet/>
      </div>
    </div>
  )
}

export default App;