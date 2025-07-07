import React from 'react';
import TrainerMain from './TrainerMain';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TrainerReadMore from './TrainerReadMore';
import TrainerMapModal from './TrainerMapModal';
import TrainerReview from './TrainerReview';

const Trainer = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TrainerMain />} />
        <Route path="/:userId" element={<TrainerReadMore />} />
        <Route path="/review/:userId" element={<TrainerReview />} />
        <Route path="/map" element={<TrainerMapModal />} />
      </Routes>
    </div>
  );
};

export default Trainer;
