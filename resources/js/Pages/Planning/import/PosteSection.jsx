import React from "react";

const PosteSection = ({
  typePosts,
  selectedTypePost,
  handleTypePostChange,
  listPosts,
  selectedPost,
  handlePostChange,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center font-semibold text-2xl text-gray-900">
        Poste
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 bg-white border border-gray-300 rounded-lg shadow-md p-4">
        <div className="flex-1">
          <label
            htmlFor="typePost"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type:
          </label>
          <select
            id="typePost"
            value={selectedTypePost}
            onChange={handleTypePostChange}
            className="block w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Sélectionner un type</option>
            {typePosts.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label
            htmlFor="post"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Poste:
          </label>
          <select
            id="post"
            value={selectedPost}
            onChange={handlePostChange}
            className="block w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Sélectionner un poste</option>
            {listPosts.map((post) => (
              <option key={post.id} value={post.abbreviation}>
                {post.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PosteSection;
