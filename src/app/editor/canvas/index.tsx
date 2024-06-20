"use client";
import { useEditor } from "@/providers/editor/editor-provider";
import React, { useEffect, useRef } from "react";

type Props = {};

const Canvas = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { state, dispatch } = useEditor();
  useEffect(() => {
    if (canvasRef.current) {
      dispatch({
        type: "SET_CONTEXT",
        payload: {
          context: canvasRef.current.getContext("2d"),
        },
      });
    }
  }, []);

  useEffect(() => {
    const { elements, canvasCtx } = state.editor;
    if (canvasCtx) {
      canvasCtx.clearRect(
        0,
        0,
        canvasCtx.canvas.width,
        canvasCtx.canvas.height
      );
      elements.forEach((element) => {
        if (element.type === "image") {
          if (!element.content.url) return;
          const img = new Image();
          img.src = element.content.url;
          img.onload = () => {
            canvasCtx.drawImage(img, 0, 0, 500, 500);
          };
        }
      });
    }
  }, [state.editor.elements]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-black"
      id="primary-canvas"
      width={800}
      height={600}
    />
  );
};

export default Canvas;
