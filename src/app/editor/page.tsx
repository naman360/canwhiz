"use client";
import React, { useState } from "react";
import Toolkit from "./toolkit";
import Canvas from "./canvas";

type Props = {};

const Page = (props: Props) => {
  const [activeTool, setActiveTool] = useState<string>("cursor");

  const handleToolFn = (tool: string) => {
    switch (tool) {
      case "text":
    }
  };

  return (
    <div className="flex justify-between">
      <Toolkit
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        handleToolFn={handleToolFn}
      />
      <Canvas activeTool={activeTool} />
    </div>
  );
};

export default Page;
