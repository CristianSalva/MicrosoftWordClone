import React from "react";

const Draw = ({ setShowDrawing, Pencil }) => {
  return (
    <button
      onClick={() => setShowDrawing(true)}
      className="p-2 hover:bg-gray-100 rounded"
      title="Draw"
    >
      <Pencil size={20} />
    </button>
  );
};

export default Draw;
