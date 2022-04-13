import './App.css';
import { BrowserRouter as Router, Routes, Route, useRoutes } from "react-router-dom";

import FileInput from './Components/FileInput';
import Header from './Components/Header';
import Home from './Components/Home';
import NoPage from './Components/NoPage';
import Download from './Components/Download';


function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/home' element={<Home />}></Route>
          <Route exact path='/upload' element={<FileInput />}></Route>
          <Route exact path='/download' element={<Download />}></Route>
          <Route path="*" element={<NoPage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
