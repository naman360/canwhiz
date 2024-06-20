import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ALargeSmallIcon,
  ImagesIcon,
  MousePointer2,
  SettingsIcon,
  ShareIcon,
} from "lucide-react";
import { useEditor } from "@/providers/editor/editor-provider";

const TabList = () => {
  const { dispatch } = useEditor();
  return (
    <TabsList className="flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4">
      <TabsTrigger
        value="Cursor"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <MousePointer2 />
      </TabsTrigger>
      <TabsTrigger
        value="Image"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
        onClick={() => dispatch({ type: "ADD_IMAGE", payload: {} })}
      >
        <ImagesIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Text"
        className="data-[state=active]:bg-muted w-10 h-10 p-0"
      >
        <ALargeSmallIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Settings"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <SettingsIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Share"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <ShareIcon />
      </TabsTrigger>
    </TabsList>
  );
};

export default TabList;
