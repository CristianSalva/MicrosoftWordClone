import React from "react";

const TextHighlight = ({
  handleFormat,
  Bold,
  Italic,
  Underline,
  StrikethroughIcon,
}) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => handleFormat("bold")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Bold"
      >
        <Bold size={20} />
      </button>
      <button
        onClick={() => handleFormat("italic")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Italic"
      >
        <Italic size={20} />
      </button>
      <button
        onClick={() => handleFormat("underline")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Underline"
      >
        <Underline size={20} />
      </button>
      <button
        onClick={() => handleFormat("strikeThrough")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Strikethrough"
      >
        <StrikethroughIcon size={20} />
      </button>
    </div>
  );
};

export default TextHighlight;
