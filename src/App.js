import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  StrikethroughIcon,
  Undo2,
  Redo2,
  List,
  ListOrdered,
  Table,
  Image,
  Printer,
  Search,
  Sun,
  Moon,
  Pencil,
  GripVertical,
  X,
} from "lucide-react";
import WordList from "./components/list.js";
import Draw from "./components/draw.js";
import UndoRedo from "./components/undo_redo.js";
import TextPosition from "./components/text_position.js";
import Colors from "./components/color.js";
import FontSize from "./components/font_size.js";
import FontFamily from "./components/font_family.js";
import TextHighlight from "./components/text_highlight.js";
import InsertTable from "./components/table.js";
import ImageInsert from "./components/image.js";
import Templates from "./components/templates.js";
import DarkMode from "./components/dark_mode.js";
import Print from "./components/print.js";
import Replace from "./components/search.js";
import Editor from "./components/editor.js";

// DrawingCanvas Component
const DrawingCanvas = ({ onSave, onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 100;

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  const handleSave = () => {
    const dataUrl = canvasRef.current.toDataURL();
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Drawing Canvas</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Drawing
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  );
};

// TextBlockSidebar Component
const TextBlockSidebar = ({ onDragStart }) => {
  const blocks = [
    {
      id: "signature",
      label: "Signature Block",
      template: "[Signature]\n[Name]\n[Title]",
    },
    { id: "date", label: "Date Block", template: "[Current Date]" },
    {
      id: "contact",
      label: "Contact Info",
      template: "[Name]\n[Email]\n[Phone]",
    },
    {
      id: "address",
      label: "Address Block",
      template: "[Street Address]\n[City, State ZIP]",
    },
  ];

  return (
    <div className="h-full bg-gray-50 p-4">
      <h3 className="text-lg font-semibold mb-4">Text Blocks</h3>
      <div className="space-y-2">
        {blocks.map((block) => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", block.template);
              onDragStart(block);
            }}
            className="p-3 bg-white border rounded shadow-sm cursor-move hover:bg-gray-50 flex items-center gap-2"
          >
            <GripVertical className="text-gray-400" size={16} />
            {block.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main TextEditor Component
const TextEditor = () => {
  const [fileName, setFileName] = useState("Untitled Document");
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showDrawing, setShowDrawing] = useState(false);
  const editorRef = useRef(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const fontSizes = [
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22",
    "24",
    "26",
    "28",
    "36",
    "48",
    "72",
  ];

  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Helvetica",
    "Tahoma",
    "Trebuchet MS",
  ];

  const templates = {
    blank: "",
    letter: `Dear [Name],\n\nBody of the letter goes here.\n\nSincerely,\n[Your Name]`,
    resume: `[Your Name]\n[Address]\n[Phone]\n[Email]\n\nOBJECTIVE\n[Your objective statement]\n\nEXPERIENCE\n[Company Name] - [Position]\n[Dates]\n• Achievement 1\n• Achievement 2\n\nEDUCATION\n[Degree] - [Institution]\n[Graduation Date]`,
    memo: `MEMORANDUM\n\nTO: [Recipient]\nFROM: [Sender]\nDATE: [Date]\nSUBJECT: [Subject]\n\nBody of memo goes here.`,
  };

  const saveState = () => {
    const content = editorRef.current?.innerHTML || "";
    setUndoStack((prev) => [...prev, content]);
    setRedoStack([]);
  };

  const handleFormat = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();

      if (command === "fontSize") {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);

          // Instead of using surroundContents, we'll modify the fontSize directly
          if (!selection.isCollapsed) {
            // Create a CSS style for fontSize
            const fontSize = `${value}px`;

            // Apply fontSize to existing content
            const fragment = range.extractContents();
            const span = document.createElement("span");
            span.style.fontSize = fontSize;

            // Handle nested spans
            const existingSpans = fragment.querySelectorAll("span");
            existingSpans.forEach((existingSpan) => {
              existingSpan.style.fontSize = fontSize;
            });

            // If there are no spans, wrap everything in a new span
            if (existingSpans.length === 0) {
              span.appendChild(fragment);
              range.insertNode(span);
            } else {
              range.insertNode(fragment);
            }

            // Restore selection
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            // If no text is selected, prepare for next input
            const span = document.createElement("span");
            span.style.fontSize = `${value}px`;
            span.appendChild(document.createTextNode("\u200B")); // Zero-width space
            range.insertNode(span);

            // Move cursor inside the span
            range.setStart(span.firstChild, 1);
            range.setEnd(span.firstChild, 1);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      } else if (
        command === "insertUnorderedList" ||
        command === "insertOrderedList"
      ) {
        // ... rest of your existing list handling code ...
      } else {
        document.execCommand(command, false, value);
      }
      saveState();
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.addEventListener("input", saveState);
      editorRef.current.addEventListener("keydown", handleKeyDown);

      // Initialize with a paragraph
      if (!editorRef.current.innerHTML) {
        editorRef.current.innerHTML = "<p><br></p>";
      }

      return () => {
        editorRef.current?.removeEventListener("input", saveState);
        editorRef.current?.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const currentBlock = range.commonAncestorContainer;

      // Handle list items
      if (currentBlock.nodeType === Node.TEXT_NODE) {
        const parentElement = currentBlock.parentElement;
        if (parentElement.tagName === "LI") {
          // If list item is empty, break out of the list
          if (!parentElement.textContent.trim()) {
            e.preventDefault();
            const parentList = parentElement.parentElement;
            const paragraph = document.createElement("p");
            paragraph.innerHTML = "<br>";

            if (parentList.nextSibling) {
              parentList.parentNode.insertBefore(
                paragraph,
                parentList.nextSibling,
              );
            } else {
              parentList.parentNode.appendChild(paragraph);
            }

            const newRange = document.createRange();
            newRange.setStart(paragraph, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);

            parentElement.remove();
            if (!parentList.children.length) {
              parentList.remove();
            }
          }
        }
      }
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const prevState = undoStack[undoStack.length - 1];
      setRedoStack((prev) => [...prev, editorRef.current.innerHTML]);
      setUndoStack((prev) => prev.slice(0, -1));
      if (editorRef.current) {
        editorRef.current.innerHTML = prevState;
      }
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack((prev) => [...prev, editorRef.current.innerHTML]);
      setRedoStack((prev) => prev.slice(0, -1));
      if (editorRef.current) {
        editorRef.current.innerHTML = nextState;
      }
    }
  };

  const handleDrawingSave = (imageData) => {
    handleFormat("insertImage", imageData);
  };

  const insertTable = () => {
    const rows = prompt("Enter number of rows:", "3");
    const cols = prompt("Enter number of columns:", "3");
    if (rows && cols) {
      let table = "<table style='border-collapse: collapse; width: 100%;'>";
      for (let i = 0; i < parseInt(rows); i++) {
        table += "<tr>";
        for (let j = 0; j < parseInt(cols); j++) {
          table +=
            "<td style='border: 1px solid black; padding: 8px;'>Cell</td>";
        }
        table += "</tr>";
      }
      table += "</table><br>";
      handleFormat("insertHTML", table);
    }
  };

  const handleImageInsert = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (editorRef.current) {
        editorRef.current.focus();
        const imageHtml = `<img src="${reader.result}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`;
        document.execCommand("insertHTML", false, imageHtml);
        saveState();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSearch = () => {
    if (!searchText) return;
    const content = editorRef.current;
    const text = content.innerHTML;
    const regex = new RegExp(searchText, "gi");
    content.innerHTML = text.replace(regex, (match) => `<mark>${match}</mark>`);
  };

  const handleReplace = () => {
    if (!searchText) return;
    const content = editorRef.current;
    const text = content.innerHTML;
    const regex = new RegExp(searchText, "gi");
    content.innerHTML = text.replace(regex, replaceText);
  };

  const handlePrint = () => {
    const content = editorRef.current?.innerHTML || "";
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            img { max-width: 100%; }
            table { border-collapse: collapse; }
            td, th { border: 1px solid black; padding: 8px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const applyTemplate = (templateKey) => {
    if (templates[templateKey]) {
      editorRef.current.innerText = templates[templateKey];
      saveState();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (range) {
      const blockElement = document.createElement("div");
      blockElement.className = "inline-block p-2 border rounded bg-gray-50 m-1";
      blockElement.contentEditable = true;
      blockElement.textContent = text;
      range.insertNode(blockElement);
      saveState();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className={`flex-1 flex flex-col ${darkMode ? "dark" : ""}`}>
        <div
          className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow`}
        >
          {/* Toolbar */}
          <div className="p-2 flex items-center gap-2 border-b flex-wrap">
            <UndoRedo
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              Undo2={Undo2}
              Redo2={Redo2}
            />
            <Draw setShowDrawing={setShowDrawing} Pencil={Pencil} />
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <TextPosition
              handleFormat={handleFormat}
              AlignLeft={AlignLeft}
              AlignCenter={AlignCenter}
              AlignRight={AlignRight}
            />
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Colors handleFormat={handleFormat} />
            <FontSize handleFormat={handleFormat} fontSizes={fontSizes} />
            <FontFamily
              handleFormat={handleFormat}
              fontFamilies={fontFamilies}
            />
            <TextHighlight
              handleFormat={handleFormat}
              Bold={Bold}
              Italic={Italic}
              Underline={Underline}
              StrikethroughIcon={StrikethroughIcon}
            />
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <WordList saveState={saveState} editorRef={editorRef} />

            <div className="flex gap-1">
              <InsertTable insertTable={insertTable} Table={Table} />

              <ImageInsert
                handleImageInsert={handleImageInsert}
                Image={Image}
              />
            </div>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            <Templates applyTemplate={applyTemplate} />

            <DarkMode
              setDarkMode={setDarkMode}
              darkMode={darkMode}
              Sun={Sun}
              Moon={Moon}
            />

            <Print handlePrint={handlePrint} Printer={Printer} />

            <Replace
              setShowSearch={setShowSearch}
              showSearch={showSearch}
              Search={Search}
            />
          </div>

          {/* Search and Replace Panel */}
          {showSearch && (
            <div className="p-2 border-b flex gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Replace with..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="p-2 border rounded"
              />
              <button
                onClick={handleSearch}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Search
              </button>
              <button
                onClick={handleReplace}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Replace
              </button>
            </div>
          )}
        </div>

        {/* Editor */}
        <Editor
          editorRef={editorRef}
          darkMode={darkMode}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
        />

        {/* Drawing Canvas */}
        {showDrawing && (
          <DrawingCanvas
            onSave={handleDrawingSave}
            onClose={() => setShowDrawing(false)}
          />
        )}
      </div>

      {/* Sidebar */}
      <div className="w-64 border-l overflow-y-auto">
        <TextBlockSidebar
          onDragStart={(block) => {
            console.log("Dragging block:", block.label);
          }}
        />
      </div>
    </div>
  );
};

export default TextEditor;
