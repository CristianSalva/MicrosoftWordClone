import React from "react";

const UndoRedo = ({ handleUndo, handleRedo, Undo2, Redo2 }) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={handleUndo}
        className="p-2 hover:bg-gray-100 rounded"
        title="Undo"
      >
        <Undo2 size={20} />
      </button>
      <button
        onClick={handleRedo}
        className="p-2 hover:bg-gray-100 rounded"
        title="Redo"
      >
        <Redo2 size={20} />
      </button>
    </div>
  );
};

export default UndoRedo;
