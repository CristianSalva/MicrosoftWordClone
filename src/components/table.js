import React from "react";

const InsertTable = ({ insertTable, Table }) => {
  return (
    <button
      onClick={insertTable}
      className="p-2 hover:bg-gray-100 rounded"
      title="Insert Table"
    >
      <Table size={20} />
    </button>
  );
};

export default InsertTable;
