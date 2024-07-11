"use client";
import React, { useEffect, useRef } from "react";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
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
    drawOnBgCanvas();
    // You can add more logic here if needed, like drawing selection areas
  }, [state.editor.elements]);

  const drawOnBgCanvas = () => {
    const bgCanvas = bgCanvasRef.current;
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext("2d");
    if (!bgCtx) return;

    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgCtx.fillStyle = "#ffffff";
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    state.editor.elements.forEach((element) => {
      if (element.type === "image") {
        drawImage(bgCtx, element);
      }
    });
  };

  const drawImage = (
    context: CanvasRenderingContext2D,
    element: EditorElement
  ) => {
    const img = new Image();
    img.src = element.content.url!;
    img.onload = () => {
      context.drawImage(
        img,
        element.startX,
        element.startY,
        element.width,
        element.height
      );
    };
  };

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    e.preventDefault();
    const mouseX = e.clientX - (window.innerWidth - 800); // Assuming canvas width is 800
    const mouseY = e.clientY;

    let index = 0;
    for (let element of state.editor.elements) {
      if (doesMouseCollide(mouseX, mouseY, element)) {
        currentShapeIndex.current = index;
        isDragging.current = true;
        mouseStartingPoints.current = { x: mouseX, y: mouseY };

        dispatch({
          type: "SET_SELECTED_ELEMENT",
          payload: {
            elementId: element.id,
          },
        });

        break;
      }
      index++;
    }
  };

  const doesMouseCollide = (
    mouseX: number,
    mouseY: number,
    element: EditorElement
  ) => {
    const elementLeft = element.startX;
    const elementRight = element.startX + element.width;
    const elementTop = element.startY;
    const elementBottom = element.startY + element.height;

    return (
      mouseX > elementLeft &&
      mouseX < elementRight &&
      mouseY > elementTop &&
      mouseY < elementBottom
    );
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isDragging.current || !canvasRef.current) return;

    const mouseX = e.clientX - (window.innerWidth - 800); // Assuming canvas width is 800
    const mouseY = e.clientY;

    const dx = mouseX - mouseStartingPoints.current.x;
    const dy = mouseY - mouseStartingPoints.current.y;

    const currentShape = state.editor.elements[currentShapeIndex.current];
    currentShape.startX += dx;
    currentShape.startY += dy;

    mouseStartingPoints.current = { x: mouseX, y: mouseY };

    dispatch({
      type: "MODIFY_IMAGE",
      payload: {
        index: currentShapeIndex.current,
        newImage: currentShape,
      },
    });

    // Clear foreground canvas and redraw the selected image
    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) return;
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    drawImage(canvasCtx, currentShape);
  };

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    isDragging.current = false;
  };

  return (
    <div className="flex flex-col relative">
      <canvas
        ref={bgCanvasRef}
        className="border border-black absolute"
        id="bg-canvas"
        width={800}
        height={600}
      />
      <canvas
        ref={canvasRef}
        className="border border-black z-10"
        id="primary-canvas"
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default Canvas;
