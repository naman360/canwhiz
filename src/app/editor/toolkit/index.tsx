"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import React, { useEffect, useState } from "react";
import TabList from "./tab-list";

type Props = {
  activeTool: string;
  setActiveTool: React.Dispatch<React.SetStateAction<string>>;
  handleToolFn: (tool: string) => void;
};
const Toolkit = (props: Props) => {
  const { activeTool, setActiveTool, handleToolFn } = props;
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <Sheet open={isOpen} modal={false}>
      <Tabs className="w-full" defaultValue="Cursor">
        <SheetContent
          hideCloseIcon
          side="left"
          className="flex items-center w-16 z-[80] border-none shadow-none p-0 focus:border-none transition-all overflow-hidden"
        >
          <div className="border border-l-0 py-4 px-2">
            <TabList
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              handleToolFn={handleToolFn}
            />
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
};

export default Toolkit;
