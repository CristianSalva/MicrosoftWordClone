import React from "react";

const Colors = ({ handleFormat }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        onChange={(e) => handleFormat("foreColor", e.target.value)}
        className="w-8 h-8 p-1 rounded cursor-pointer"
        title="Text Color"
      />
      <input
        type="color"
        onChange={(e) => handleFormat("hiliteColor", e.target.value)}
        className="w-8 h-8 p-1 rounded cursor-pointer"
        title="Highlight Color"
      />
    </div>
  );
};

export default Colors;
