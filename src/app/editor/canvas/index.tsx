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
      fillCanvasBgColor(canvasRef.current.getContext("2d"));
    }
  }, []);

  useEffect(() => {
    drawImages();
  }, [state.editor.elements]);

  /* 
    TODO: Optimise drawing of image, avoid drawing all image instead only draw the image which is actually changed
    1. Figure out Data Structure to optimally find whi  ch image is changed 
    2. Figure out which image is changed.
    3. Redraw the changed image.
  */

  /*
    Function to fill canvas with white color before drawing images, for enabling users to download the image with white background
  */
  const fillCanvasBgColor = (context?: CanvasRenderingContext2D | null) => {
    const { canvasCtx } = state.editor;
    const canvasContext = canvasCtx || context;
    if (!canvasContext) return;
    canvasContext.clearRect(
      0,
      0,
      canvasContext.canvas.width,
      canvasContext.canvas.height
    );
    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(
      0,
      0,
      canvasContext.canvas.width,
      canvasContext.canvas.height
    );
  };

  const drawImages = () => {
    const { elements, canvasCtx } = state.editor;
    if (canvasCtx) {
      fillCanvasBgColor();

      // Draw non-selected elements first
      elements.forEach((element) => {
        if (
          element.type === "image" &&
          element.id !== state.editor.selectedElement
        ) {
          if (!element.content.url) return;
          drawImage(element);
        }
      });

      // Draw selected element next to ensure it's on top of every image
      const selectedElement = elements.find(
        (element) => element.id === state.editor.selectedElement
      );
      if (
        selectedElement &&
        selectedElement.type === "image" &&
        selectedElement.content.url
      ) {
        drawImage(selectedElement, true);
      }
    }
  };
  const drawImage = (element: EditorElement, isSelected?: boolean) => {
    const { canvasCtx } = state.editor;
    if (!canvasCtx) return;
    // Draw image on canvas
    const img = new Image();
    img.src = element.content.url!;
    img.onload = () => {
      canvasCtx.drawImage(
        img,
        element.startX,
        element.startY,
        element.width,
        element.height
      );
      if (isSelected) {
        // Draw the selected region
        createSelectionArea(element);
      }
    };
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
  const createSelectionArea = (element: EditorElement) => {
    const { canvasCtx } = state.editor;
    if (!canvasCtx) return;
    canvasCtx.setLineDash([5]);
    canvasCtx.strokeStyle = "#000";
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeRect(
      element.startX,
      element.startY,
      element.width,
      element.height
    );
  };
  const handleMouseDown:
    | React.MouseEventHandler<HTMLCanvasElement>
    | undefined = (e) => {
    e.preventDefault();
    mouseStartingPoints.current.x = e.clientX - (window.innerWidth - 800); // * 800 is canvas width
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
        currentShapeIndex.current = index;
        isDragging.current = true;
        // Select Clicked Element
        dispatch({
          type: "SET_SELECTED_ELEMENT",
          payload: {
            elementId: state.editor.elements[currentShapeIndex.current]?.id,
          },
        });
        createSelectionArea(state.editor.elements[currentShapeIndex.current]);
        break;
      }
      index++;
    }
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

    dispatch({
      type: "MODIFY_IMAGE",
      payload: {
        index: currentShapeIndex.current,
        newImage: currentShape,
      },
    });
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
