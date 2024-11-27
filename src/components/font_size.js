import React from "react";

const FontSize = ({ handleFormat, fontSizes }) => {
  return (
    <select
      onChange={(e) => handleFormat("fontSize", e.target.value)}
      className="p-2 border rounded hover:bg-gray-100"
      title="Font Size"
    >
      <option value="">Font Size</option>
      {fontSizes.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  );
};

export default FontSize;
