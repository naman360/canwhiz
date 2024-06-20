"use client";
import { EditorBtns } from "@/lib/constants";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { EditorActions } from "./editor-actions";

export type EditorElement = {
  id: string;
  type: EditorBtns;
  content: {};
};
export type Editor = {
  canvasCtx: CanvasRenderingContext2D | null;
  elements: EditorElement[];
  selectedElement: EditorElement;
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
  selectedElement: { id: "", type: null, content: {} },
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
) => {
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
      console.log("Added Image on Editor");
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
