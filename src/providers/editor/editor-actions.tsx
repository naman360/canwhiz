import { EditorElement } from "./editor-provider";

export type EditorActions =
  | {
      type: "ADD_IMAGE";
      payload: {
        image: string;
        startX: number;
        startY: number;
        width: number;
        height: number;
      };
    }
  | {
      type: "MODIFY_IMAGE";
      payload: {
        index: number;
        newImage: EditorElement;
      };
    }
  | {
      type: "SET_SELECTED_ELEMENT";
      payload: {
        element: EditorElement;
      };
    }
  | {
      type: "SET_CONTEXT";
      payload: {
        context: CanvasRenderingContext2D | null;
      };
    };
