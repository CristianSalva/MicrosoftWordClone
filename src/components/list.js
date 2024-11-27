import { List, ListOrdered } from "lucide-react";

const WordList = ({ saveState, editorRef }) => {
  const handleFormat = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();

      if (
        command === "insertUnorderedList" ||
        command === "insertOrderedList"
      ) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        // Get the current block element
        let currentBlock = range.commonAncestorContainer;
        if (currentBlock.nodeType === Node.TEXT_NODE) {
          currentBlock = currentBlock.parentElement;
        }

        // Ensure we're working with a block element
        if (currentBlock === editorRef.current) {
          document.execCommand("formatBlock", false, "p");
        }

        // Apply list command
        document.execCommand(command, false, value);

        // Fix empty list items
        const lists = editorRef.current.querySelectorAll("ul, ol");
        lists.forEach((list) => {
          const items = list.querySelectorAll("li");
          items.forEach((item) => {
            if (!item.textContent.trim()) {
              item.innerHTML = "<br>";
            }
          });
        });
      } else {
        document.execCommand(command, false, value);
      }

      saveState();
    }
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={() => handleFormat("insertUnorderedList")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Bullet List"
      >
        <List size={20} />
      </button>
      <button
        onClick={() => handleFormat("insertOrderedList")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Numbered List"
      >
        <ListOrdered size={20} />
      </button>
    </div>
  );
};

export default WordList;
