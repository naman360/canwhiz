import React, { ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          dispatch({
            type: "ADD_IMAGE",
            payload: {
              id: uuidv4(),
              startX: 0,
              startY: 0,
              width: 400,
              height: 400,
              image: reader.result as string,
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <TabsList className="flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4">
      <TabsTrigger
        value="Cursor"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <MousePointer2 />
      </TabsTrigger>
      <TabsTrigger value="Image" className="relative">
        <input
          type="file"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          onChange={handleFileChange}
        />
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
