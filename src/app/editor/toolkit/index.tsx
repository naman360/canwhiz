"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import React, { useEffect, useState } from "react";
import TabList from "./tab-list";

const Toolkit = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <Sheet open={isOpen} modal={false}>
      <Tabs className="w-full" defaultValue="Settings">
        <SheetContent
          hideCloseIcon
          side="left"
          className="flex items-center w-16 z-[80] border-none shadow-none p-0 focus:border-none transition-all overflow-hidden"
        >
          <div className="border py-4 py-2">
            <TabList />
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
};

export default Toolkit;
