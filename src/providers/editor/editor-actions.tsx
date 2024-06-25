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
      type: "SET_CONTEXT";
      payload: {
        context: CanvasRenderingContext2D | null;
      };
    };
