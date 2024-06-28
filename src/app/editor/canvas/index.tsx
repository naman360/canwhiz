"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import React, { useEffect, useRef } from "react";

type Props = {};

const Canvas = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const mouseStartingPoints = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentShapeIndex = useRef<number>(-1);
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
    drawImages();
  }, [state.editor.elements]);

  const drawImages = () => {
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
            canvasCtx.drawImage(
              img,
              element.startX,
              element.startY,
              element.width,
              element.height
            );
          };
        }
      });
    }
  };
  const doesMouseCollides = (
    mouseX: number,
    mouseY: number,
    element: EditorElement
  ) => {
    let elementLeft = element.startX;
    let elementRight = element.startX + element.width;
    let elementTop = element.startY;
    let elementBottom = element.startY + element.height;

    if (
      mouseX > elementLeft &&
      mouseX < elementRight &&
      mouseY > elementTop &&
      mouseY < elementBottom
    )
      return true;
    return false;
  };
  const handleMouseDown:
    | React.MouseEventHandler<HTMLCanvasElement>
    | undefined = (e) => {
    e.preventDefault();
    mouseStartingPoints.current.x = e.clientX - (window.innerWidth - 800); //800 is canvas width
    mouseStartingPoints.current.y = e.clientY;
    let index = 0;

    // Check if mouse click collides with image
    for (let element of state.editor.elements) {
      if (
        doesMouseCollides(
          mouseStartingPoints.current.x,
          mouseStartingPoints.current.y,
          element
        )
      ) {
        console.log("In Image");
        currentShapeIndex.current = index;
        isDragging.current = true;
        return;
      }
      index++;
    }
    // Select Clicked Element
    dispatch({
      type: "SET_SELECTED_ELEMENT",
      payload: {
        element: state.editor.elements[currentShapeIndex.current],
      },
    });
  };

  const handleMouseMove:
    | React.MouseEventHandler<HTMLCanvasElement>
    | undefined = (e) => {
    if (!isDragging.current) {
      return;
    }

    let mouseX = e.clientX - (window.innerWidth - 800);
    let mouseY = e.clientY;
    let dx = mouseX - mouseStartingPoints.current.x;
    let dy = mouseY - mouseStartingPoints.current.y;
    let currentShape = state.editor.elements[currentShapeIndex.current];
    currentShape.startX += dx;
    currentShape.startY += dy;
    mouseStartingPoints.current.x = mouseX;
    mouseStartingPoints.current.y = mouseY;
    console.log(
      mouseX,
      mouseY,
      mouseStartingPoints.current.x,
      mouseStartingPoints.current.y,
      dx,
      dy,
      currentShape
    );
    dispatch({
      type: "MODIFY_IMAGE",
      payload: {
        index: currentShapeIndex.current,
        newImage: currentShape,
      },
    });
    // console.log(state.editor.elements);
    drawImages();
  };

  const handleMouseUp:
    | React.MouseEventHandler<HTMLCanvasElement>
    | undefined = (e) => {
    e.preventDefault;
    if (!isDragging.current) return;
    isDragging.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="border border-black"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      id="primary-canvas"
      width={800}
      height={600}
    />
  );
};

export default Canvas;
