import React from 'react';

const TrainerReadMore = () => {
  return <div>TrainerReadMore</div>;
};

export const handleReadMore = () => {
  const newWindow = window.open('', '_blank', 'width=600,height=400');
  newWindow.document.write('<div id="root"></div>');
  newWindow.document.title = 'Trainer Details';
  newWindow.document.body.style.margin = '0';
  newWindow.document.body.style.fontFamily = 'Arial, sans-serif';
  newWindow.document.body.innerHTML = '<h1>Hello</h1>';
};

export default TrainerReadMore;
