"use client";
import React, { useEffect, useRef, useState } from "react";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { EditorBtns } from "@/lib/constants";

type Props = {
  activeTool: string;
};
const Canvas = (props: Props) => {
  const { activeTool } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const mouseStartingPoints = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentShapeIndex = useRef<number>(-1);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { state, dispatch } = useEditor();
  const [selectedElement, setSelectedElement] = useState<EditorElement | null>(
    null
  );

  const [textAreaPosition, setTextAreaPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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
  }, [state.editor.elements]);

  const drawOnBgCanvas = () => {
    const bgCanvas = canvasRef.current;
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext("2d");
    if (!bgCtx) return;

    // bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height); // TODO: Conflicting with fillText

    state.editor.elements.forEach((element) => {
      if (element.type === "image" && element.id !== selectedElement?.id) {
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
        element.width!,
        element.height!
      );
    };
  };

  const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> | undefined = (
    e
  ) => {
    const textElementDetails = {
      type: "text" as EditorBtns,
      text: e.target.value,
      startX: textAreaPosition?.x! - (window.innerWidth - 800),
      startY: textAreaPosition?.y!,
    };

    const canvasCtx = canvasRef.current?.getContext("2d");
    if (!canvasCtx) return;

    dispatch({
      type: "ADD_ELEMENT",
      payload: textElementDetails,
    });
    drawText(textElementDetails);
    setTextAreaPosition(null);
  };

  const drawText = (element: {
    type: EditorBtns;
    text: string;
    startX: number;
    startY: number;
  }) => {
    const canvasCtx = canvasRef.current?.getContext("2d");
    if (!canvasCtx) return;
    canvasCtx.font = "24px arial";
    canvasCtx.fillStyle = "#000";
    canvasCtx.textBaseline = "top";
    canvasCtx.fillText(element.text, element.startX, element.startY);
  };

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (activeTool === "text" && textAreaPosition) return;

    e.preventDefault();

    const mouseX = e.clientX - (window.innerWidth - 800); // Assuming canvas width is 800, canvas relative mouseX
    const mouseY = e.clientY;

    /** For Text element */
    if (activeTool === "text") {
      setTextAreaPosition({ x: e.clientX, y: mouseY });

      setTimeout(() => textareaRef.current?.focus(), 0); //textarea display is based on textAreaPosition, initially after setting text position textarearef will be null as ssetstate is async
    } else {
      /** For every other element */
      let index = 0;
      for (let element of state.editor.elements) {
        if (doesMouseCollide(mouseX, mouseY, element)) {
          currentShapeIndex.current = index;
          isDragging.current = true;
          mouseStartingPoints.current = { x: mouseX, y: mouseY };
          setSelectedElement(element);

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
    }
  };

  const doesMouseCollide = (
    mouseX: number,
    mouseY: number,
    element: EditorElement
  ) => {
    const elementLeft = element.startX;
    const elementRight = element.startX + element.width!;
    const elementTop = element.startY;
    const elementBottom = element.startY + element.height!;

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

    // Clear and redraw the selected image on the foreground canvas
    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) return;
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    drawImage(canvasCtx, currentShape); // Draw the updated image

    // Clear and redraw the background canvas without the selected image
    drawOnBgCanvas();
  };

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (activeTool === "text" && textAreaPosition) return;
    isDragging.current = false;
    setSelectedElement(null); // Reset selected element state
  };

  return (
    <div className="flex flex-col relative">
      {/* <canvas
        ref={bgCanvasRef}
        className="border border-black absolute"
        id="bg-canvas"
        width={800}
        height={600}
      /> */}
      <canvas
        ref={canvasRef}
        className="border border-black z-1"
        id="primary-canvas"
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {activeTool === "text" && textAreaPosition ? (
        <textarea
          ref={textareaRef}
          className="writing_area"
          onBlur={handleBlur}
          style={{
            top: textAreaPosition.y, // *textAreaPosition state is relative to screen, hence taking mouse coordinates
            left: textAreaPosition.x,
            font: `24px arial`,
          }}
        />
      ) : null}
    </div>
  );
};

export default Canvas;
