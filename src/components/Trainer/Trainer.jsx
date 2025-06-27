import React from 'react';
import TrainerMain from './TrainerMain';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TrainerReadMore from './TrainerReadMore';

const Trainer = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TrainerMain />} />
        <Route path="/trainer/:id" element={<TrainerReadMore />} />
      </Routes>
    </div>
  );
};

export default Trainer;
