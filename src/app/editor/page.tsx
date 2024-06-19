import React from "react";
import Toolkit from "./toolkit";
import Canvas from "./canvas";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="flex justify-between">
      <Toolkit />
      <Canvas />
    </div>
  );
};

export default Page;
