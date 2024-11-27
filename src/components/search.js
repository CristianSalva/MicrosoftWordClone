import React from "react";

const Replace = ({ setShowSearch, showSearch, Search }) => {
  return (
    <button
      onClick={() => setShowSearch(!showSearch)}
      className="p-2 hover:bg-gray-100 rounded"
      title="Search and Replace"
    >
      <Search size={20} />
    </button>
  );
};

export default Replace;
