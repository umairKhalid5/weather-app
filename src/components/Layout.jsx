import React from 'react';
import Home from './Home';
import { Route, Routes, useLocation } from 'react-router-dom';
import SelectCity from './SelectCity';
import { AnimatePresence } from 'framer-motion';

const Layout = () => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.key}>
        <Route path="/" element={<SelectCity />} />
        <Route path="/weather/:city" element={<Home />} />
        <Route path="/weather/:coords/:location" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
};

export default Layout;
