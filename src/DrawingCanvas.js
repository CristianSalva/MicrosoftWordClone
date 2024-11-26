import React, { useState, useRef, useEffect } from "react";
import { Pencil, Eraser, Square, Circle, Trash2 } from "lucide-react";

const DrawingCanvas = ({ onSave, onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [ctx, setCtx] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    setCtx(context);
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    setStartPos({ x: offsetX, y: offsetY });
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);

    // Create a copy of the canvas for shape preview
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? 20 : lineWidth;

    if (tool === "pencil" || tool === "eraser") {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    } else if (tool === "square") {
      const width = offsetX - startPos.x;
      const height = offsetY - startPos.y;
      ctx.strokeRect(startPos.x, startPos.y, width, height);
    } else if (tool === "circle") {
      const radius = Math.sqrt(
        Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2),
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctx.closePath();
  };

  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleSave = () => {
    const image = canvasRef.current.toDataURL("image/png");
    onSave(image);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTool("pencil")}
            className={`p-2 rounded ${tool === "pencil" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`p-2 rounded ${tool === "eraser" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            <Eraser size={20} />
          </button>
          <button
            onClick={() => setTool("square")}
            className={`p-2 rounded ${tool === "square" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            <Square size={20} />
          </button>
          <button
            onClick={() => setTool("circle")}
            className={`p-2 rounded ${tool === "circle" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            <Circle size={20} />
          </button>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8"
          />
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(e.target.value)}
            className="w-24"
          />
          <button
            onClick={clearCanvas}
            className="p-2 rounded bg-red-500 text-white"
          >
            <Trash2 size={20} />
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
