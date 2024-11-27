import React from "react";

const ImageInsert = ({ handleImageInsert, Image }) => {
  return (
    <label className="p-2 hover:bg-gray-100 rounded cursor-pointer">
      <Image size={20} />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageInsert}
      />
    </label>
  );
};

export default ImageInsert;
