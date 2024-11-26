import React, { useState } from "react";
import ModalFormTypePost from "./AddTypePostModal";
import ModalFormPost from "./AddPostModal";
import { Inertia } from "@inertiajs/inertia";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Index = ({ typePosts, posts }) => {
  console.log(posts);
  console.log(typePosts);

  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [isEditPostModalOpen, setEditPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [isCreateTypePostModalOpen, setCreateTypePostModalOpen] =
    useState(false);
  const [isEditTypePostModalOpen, setEditTypePostModalOpen] = useState(true);
  const [selectedTypePost, setSelectedTypePost] = useState(null);

  const openCreatePostModal = () => setCreatePostModalOpen(true);
  const closeCreatePostModal = () => setCreatePostModalOpen(false);

  const openCreateTypePostModal = () => setCreateTypePostModalOpen(true);
  const closeCreateTypePostModal = () => setCreateTypePostModalOpen(false);

  const openEditTypePostModal = (typepost) => {
    setSelectedTypePost(typepost);
    setEditTypePostModalOpen(true);
  };
  const openEditPostModal = (post) => {
    console.log(post);
    setSelectedPost(post);
    setEditPostModalOpen(true);
  };

  const closeEditTypePostModal = () => {
    setSelectedTypePost(null);
    setEditTypePostModalOpen(false);
  };
  const closeEditPostModal = () => {
    setSelectedPost(null);
    setEditPostModalOpen(false);
  };

  const handleDeleteTypePost = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      Inertia.delete(`/typePosts/${id}`)
        .then(() => {
          // Optionally handle success here
        })
        .catch(() => {
          // Optionally handle error here
        });
    }
  };

  const handleDeletePost = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      Inertia.delete(`/typePosts/${id}`)
        .then(() => {
          // Optionally handle success here
        })
        .catch(() => {
          // Optionally handle error here
        });
    }
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Type Post Management" />
      <div className="container mx-auto p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Type de poste
          </h1>
          <button
            onClick={openCreateTypePostModal}
            className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            Ajouter un nouveau Type de post
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium">
                  Name
                </th>

                <th className="py-2 px-3 text-left text-xs font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {typePosts.length > 0 ? (
                typePosts.map((typepost, index) => (
                  <tr
                    key={typepost.id}
                    className={`border-b border-gray-300 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-1 px-3 text-sm text-gray-800">
                      {typepost.name}
                    </td>

                    <td className="py-1 px-3 text-sm text-gray-800 flex space-x-1">
                      <button
                        onClick={() => openEditTypePostModal(typepost)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTypePost(typepost.id)}
                        className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 px-3 text-center text-gray-600"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create type post Modal */}
        <ModalFormTypePost
          isOpen={isCreateTypePostModalOpen}
          onClose={closeCreateTypePostModal}
          isEditing={false}
        />

        {/* Edit type post Modal */}
        {selectedTypePost && (
          <ModalFormTypePost
            isOpen={isEditTypePostModalOpen}
            onClose={closeEditTypePostModal}
            typePost={selectedTypePost}
            isEditing={true}
          />
        )}
      </div>

      <div className="container mx-auto p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">les Posts</h1>
          <button
            onClick={openCreatePostModal}
            className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            Ajouter un nouveau poste
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium">
                  Name
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium">
                  Abbreviation
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium">
                  Type
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <tr
                    key={post.id}
                    className={`border-b border-gray-300 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-1 px-3 text-sm text-gray-800">
                      {post.name}
                    </td>
                    <td className="py-1 px-3 text-sm text-gray-800">
                      {post.abbreviation}
                    </td>
                    <td className="py-1 px-3 text-sm text-gray-800">
                      {post.type_post && post.type_post.name
                        ? post.type_post.name
                        : "No type"}
                    </td>

                    <td className="py-1 px-3 text-sm text-gray-800 flex space-x-1">
                      <button
                        onClick={() => openEditPostModal(post)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-4 px-3 text-center text-gray-600"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create post Modal */}
        <ModalFormPost
          isOpen={isCreatePostModalOpen}
          onClose={closeCreatePostModal}
          isEditing={false}
          typePosts={typePosts}
        />

        {/* Edit post Modal */}
        {selectedPost && (
          <ModalFormPost
            isOpen={isEditPostModalOpen}
            onClose={closeEditPostModal}
            post={selectedPost}
            isEditing={true}
            typePosts={typePosts}
          />
        )}
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default Index;
