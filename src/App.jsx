import React from 'react';
import Home from './components/Home';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SelectCity from './components/SelectCity';
import { AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

function App() {
  const location = useLocation();
  return (
    <div>
      <Navbar />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<SelectCity />} />
          <Route path="/:city" element={<Home />} />
          <Route path="/:coords/:location" element={<Home />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
