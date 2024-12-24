import React, { useState } from "react";

const PosteSection = ({
  typePosts,
  selectedTypePost,
  handleTypePostChange,
  selectedPost,
  handlePostChange,
  errors,
  posts,
  onIsDefaultHours,
}) => {
  console.log(typePosts, posts);
  // Filter posts based on selected type (optional based on your logic)
  const filteredPosts = posts.filter(
    (post) => post.type_post_id == selectedTypePost
  );
  console.log(selectedTypePost);
  console.log(filteredPosts);

  const selectedPostType = typePosts.find((t) => t.id == selectedTypePost);

  if (!selectedPostType) {
    console.error(
      `Aucun type de publication trouvé pour l'ID : ${selectedTypePost}`
    );
    onIsDefaultHours(false); // Valeur par défaut si aucun type n'est trouvé
  } else {
    const defaultHours = Boolean(selectedPostType.default_duration);
    const post = posts.find((p) => p.abbreviation == selectedPost);

    console.log(defaultHours, post);
  }

  return (
    <div className="flex-1 border p-2">
      {/* Title Label */}
      <label className="block text-sm font-bold text-black text-center bg-gray-300">
        Poste
      </label>

      <div className="flex gap-1">
        {/* Type of Post Select */}
        <div className="flex-1">
          <label className="block text-xs text-black font-bold">
            Type de Post:
          </label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-xs text-sm"
            onChange={handleTypePostChange}
            value={selectedTypePost}
          >
            <option value="">Sélectionner</option>
            {typePosts
              .sort((a, b) => a.name.localeCompare(b.name)) // Trie les éléments par ordre alphabétique
              .map((typePost) => (
                <option key={typePost.id} value={typePost.id}>
                  {typePost.name}
                </option>
              ))}
          </select>
          {errors?.selectedTypePost && (
            <div className="text-red-500 text-xs font-bold">
              {errors.selectedTypePost}
            </div>
          )}
        </div>

        {/* Post Select */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-black text-center">
            Post:
          </label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
            onChange={handlePostChange}
            value={selectedPost}
            disabled={!selectedTypePost} // Disable if no type is selected
          >
            <option value="">Sélectionner</option>
            {filteredPosts.map((post) => (
              <option key={post.id} value={post.abbreviation}>
                {post.name}
              </option>
            ))}
          </select>
          {errors?.selectedPost && (
            <div className="text-red-500 text-xs font-bold">
              {errors.selectedPost}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosteSection;
