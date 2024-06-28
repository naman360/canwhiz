"use client";
import { v4 as uuidv4 } from "uuid";
import { EditorBtns } from "@/lib/constants";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { EditorActions } from "./editor-actions";

export type EditorElement = {
  id: string;
  type: EditorBtns;
  startX: number;
  startY: number;
  width: number;
  height: number;
  content: {
    url?: string;
  };
};
export type Editor = {
  canvasCtx: CanvasRenderingContext2D | null;
  elements: EditorElement[];
  selectedElement: string;
};
export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const inititalEditorState: Editor = {
  canvasCtx: null,
  elements: [],
  selectedElement: "",
};

const intitialHistoryState: HistoryState = {
  history: [inititalEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: inititalEditorState,
  history: intitialHistoryState,
};

const EditorReducer = (
  state: EditorState = initialState,
  action: EditorActions
): EditorState => {
  switch (action.type) {
    case "SET_CONTEXT":
      return {
        ...state,
        editor: {
          ...state.editor,
          canvasCtx: action.payload.context,
        },
      };
    case "ADD_IMAGE":
      const newImageElement: EditorElement = {
        id: uuidv4(),
        type: "image",
        startX: action.payload.startX,
        startY: action.payload.startY,
        width: action.payload.width,
        height: action.payload.height,
        content: { url: action.payload.image },
      };

      return {
        ...state,
        editor: {
          ...state.editor,
          elements: [...state.editor.elements, newImageElement],
        },
      };
    case "MODIFY_IMAGE":
      const indexToBeModified = action.payload.index;
      const newEditorElements = state.editor.elements;
      newEditorElements.splice(indexToBeModified, 1);
      newEditorElements.splice(indexToBeModified, 0, action.payload.newImage);
      return {
        ...state,
        editor: { ...state.editor, elements: newEditorElements },
      };
    case "SET_SELECTED_ELEMENT":
      return {
        ...state,
        editor: { ...state.editor, selectedElement: action.payload.elementId },
      };
    default:
      return state;
  }
};

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<EditorActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

type EditorProps = { children: React.ReactNode };

export const EditorProvider = ({ children }: EditorProps) => {
  const [state, dispatch] = useReducer(EditorReducer, initialState);
  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditor should ne used in Editor Provider");
  return context;
};
