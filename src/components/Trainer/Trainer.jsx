import React from 'react';
import TrainerMain from './TrainerMain';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Detailpage from './Detailpage';
import TrainerReadMore from './TrainerReadMore';
const Trainer = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TrainerMain />} />

        <Route path="/:id" element={<TrainerReadMore />} />
      </Routes>
    </div>
  );
};

export default Trainer;
