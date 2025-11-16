import React from 'react';
import Loading from '@/icons/Loading';

type SubmitProps = {
  result: string | null;
};

const SubmitBtn = ({ result }: SubmitProps) => {
  return (
    result && (
      <div role="alert" className="alert alert-success">
        <Loading />
        <span>
          예측 결과: <strong className="font-extrabold">{result}</strong>
        </span>
      </div>
    )
  );
};

export default SubmitBtn;
