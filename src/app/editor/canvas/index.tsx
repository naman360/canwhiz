import React from "react";

type Props = {};

const Canvas = (props: Props) => {
  return (
    <canvas
      className="border border-black"
      id="primary-canvas"
      width={800}
      height={600}
    />
  );
};

export default Canvas;
