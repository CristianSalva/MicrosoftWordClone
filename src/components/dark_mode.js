import React from "react";

const DarkMode = ({ setDarkMode, darkMode, Sun, Moon }) => {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 hover:bg-gray-100 rounded"
      title={darkMode ? "Light Mode" : "Dark Mode"}
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default DarkMode;
