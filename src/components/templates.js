import React from "react";

const Templates = ({ applyTemplate }) => {
  return (
    <select
      onChange={(e) => applyTemplate(e.target.value)}
      className="p-2 border rounded hover:bg-gray-100"
    >
      <option value="">Templates</option>
      <option value="blank">Blank</option>
      <option value="letter">Letter</option>
      <option value="resume">Resume</option>
      <option value="memo">Memo</option>
    </select>
  );
};

export default Templates;
