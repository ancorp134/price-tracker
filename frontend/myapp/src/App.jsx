// import { useState } from 'react'
import Header from './Components/Header'
import Homepage from './Components/Homepage'
import "./assets/css/main.css"
import Login from './Components/Login'
import { BrowserRouter , Routes, Route} from "react-router-dom"


function App() {
  

  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path='/' element= {<Homepage></Homepage>}></Route>
        <Route path='/login' element= {<Login></Login>}></Route>
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
