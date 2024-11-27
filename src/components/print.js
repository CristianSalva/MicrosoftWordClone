import React from "react";

const Print = ({ handlePrint, Printer }) => {
  return (
    <button
      onClick={handlePrint}
      className="p-2 hover:bg-gray-100 rounded"
      title="Print"
    >
      <Printer size={20} />
    </button>
  );
};

export default Print;
