export type EditorActions =
  | {
      type: "ADD_IMAGE";
      payload: { image: string };
    }
  | {
      type: "SET_CONTEXT";
      payload: {
        context: CanvasRenderingContext2D | null;
      };
    };
