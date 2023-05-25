import React from 'react';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SelectCity from './components/SelectCity';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<SelectCity />} />
        <Route path="/:city" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
