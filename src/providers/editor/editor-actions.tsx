export type EditorActions =
  | {
      type: "ADD_IMAGE";
      payload: {};
    }
  | {
      type: "SET_CONTEXT";
      payload: {
        context: CanvasRenderingContext2D | null;
      };
    };
