import React from 'react';
import { fetchTrainers } from '../../js/redux/slice/sliceTrainer';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Detailpage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const trainers = useSelector((state) => state.trainer.trainers.detail);
  const status = useSelector((state) => state.trainer.status);
  const error = useSelector((state) => state.trainer.error);
  console.log(trainers);

  useEffect(() => {
    dispatch(fetchTrainers(id));
  }, [dispatch, id]);

  return <div>Detailpage</div>;
};

export default Detailpage;
