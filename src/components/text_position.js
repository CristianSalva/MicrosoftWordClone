import React from "react";

const TextPosition = ({ handleFormat, AlignLeft, AlignCenter, AlignRight }) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => handleFormat("justifyLeft")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Align Left"
      >
        <AlignLeft size={20} />
      </button>
      <button
        onClick={() => handleFormat("justifyCenter")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Align Center"
      >
        <AlignCenter size={20} />
      </button>
      <button
        onClick={() => handleFormat("justifyRight")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Align Right"
      >
        <AlignRight size={20} />
      </button>
    </div>
  );
};

export default TextPosition;
