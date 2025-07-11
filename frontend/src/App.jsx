

import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'

function App() {
 

  return (
    <>
     <div  className='bg-bgPrimary min-h-screen flex flex-col'>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <footer className='mt-auto'>Footer</footer>
     </div>
    </>
  )
}

export default App
