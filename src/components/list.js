// WordList.jsx
import React from "react";
import { List, ListOrdered } from "lucide-react";

const WordList = ({ saveState, editorRef }) => {
  const handleFormat = (command) => {
    if (!editorRef.current) {
      console.log("Editor ref is not available");
      return;
    }

    try {
      // Log the current state
      console.log("Executing command:", command);
      console.log("Editor content before:", editorRef.current.innerHTML);

      // Focus the editor first
      editorRef.current.focus();

      // Get the current selection
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      // Ensure we're working with a block element
      let currentBlock = range.commonAncestorContainer;
      while (currentBlock && currentBlock.nodeType === Node.TEXT_NODE) {
        currentBlock = currentBlock.parentNode;
      }

      // If we're in the editor root, wrap content in a paragraph
      if (currentBlock === editorRef.current) {
        document.execCommand("formatBlock", false, "p");
      }

      // Execute the list command
      const success = document.execCommand(command, false, null);
      console.log("Command executed successfully:", success);

      // Log the result
      console.log("Editor content after:", editorRef.current.innerHTML);

      // Save state if successful
      if (success && saveState) {
        saveState();
      }
    } catch (error) {
      console.error("Error applying list format:", error);
    }
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={() => {
          console.log("Bullet list button clicked");
          handleFormat("insertUnorderedList");
        }}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        title="Bullet List"
        type="button"
      >
        <List size={20} />
      </button>
      <button
        onClick={() => {
          console.log("Numbered list button clicked");
          handleFormat("insertOrderedList");
        }}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        title="Numbered List"
        type="button"
      >
        <ListOrdered size={20} />
      </button>
    </div>
  );
};

export default WordList;
