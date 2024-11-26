import React, { useState, useRef, useEffect } from "react";

const DraggableTextBlock = ({ content, onDelete, initialX, initialY }) => {
  const [position, setPosition] = useState({
    x: typeof initialX === "number" ? initialX : 100,
    y: typeof initialY === "number" ? initialY : 100,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);
  const blockRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.tagName !== "INPUT") {
      setIsDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && blockRef.current) {
      const parent = blockRef.current.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const blockRect = blockRef.current.getBoundingClientRect();

      const newX = Math.min(
        Math.max(0, e.clientX - offset.x),
        parentRect.width - blockRect.width,
      );
      const newY = Math.min(
        Math.max(0, e.clientY - offset.y),
        parentRect.height - blockRect.height,
      );

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div
      ref={blockRef}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 1000 : 1,
      }}
      className="p-3 bg-white border rounded shadow-lg"
    >
      <div
        className="cursor-grab select-none"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className="w-full bg-transparent border-none outline-none cursor-text"
          />
        ) : (
          text
        )}
      </div>
      <button
        onClick={onDelete}
        className="absolute top-1 right-1 text-gray-500 hover:text-red-500"
      >
        ×
      </button>
    </div>
  );
};

export default DraggableTextBlock;
