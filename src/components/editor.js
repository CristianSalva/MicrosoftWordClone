import React from "react";

const Editor = ({ editorRef, darkMode, handleDrop, handleDragOver }) => {
  return (
    <div
      ref={editorRef}
      className={`editor flex-1 overflow-auto p-4 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
      contentEditable
      suppressContentEditableWarning
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        minHeight: "100px",
        outline: "none",
        whiteSpace: "pre-wrap",
      }}
    />
  );
};

export default Editor;
