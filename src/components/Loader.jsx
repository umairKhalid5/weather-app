import React from 'react';
import { PuffLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className="loader">
      <PuffLoader color="#dedede" size={150} />
    </div>
  );
};

export default Loader;
