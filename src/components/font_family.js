import React from "react";

const FontFamily = ({ handleFormat, fontFamilies }) => {
  return (
    <select
      onChange={(e) => handleFormat("fontName", e.target.value)}
      className="p-2 border rounded hover:bg-gray-100"
      title="Font Family"
    >
      <option value="">Font Family</option>
      {fontFamilies.map((font) => (
        <option key={font} value={font}>
          {font}
        </option>
      ))}
    </select>
  );
};

export default FontFamily;
