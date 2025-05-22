import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  addCategory,
  getUserCategories,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import Swal from "sweetalert2";
import Sidebar from "../../../components/ui/Sidebar";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getUserCategories();
    setCategories(data);
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      Swal.fire("Error!", "The category name cannot be empty.", "error");
      return;
    }

    const response = await addCategory(categoryName);
    if (response.success) {
      Swal.fire("Success!", response.message, "success");
      setCategoryName("");
      fetchCategories();
      setIsModalOpen(false);
    } else {
      Swal.fire("Error!", response.message, "error");
    }
  };

  const handleEditCategory = async () => {
    if (!categoryName.trim()) {
      Swal.fire("Error!", "The category name cannot be empty.", "error");
      return;
    }

    const response = await updateCategory(selectedCategory.id, categoryName);
    if (response.success) {
      Swal.fire("Success!", response.message, "success");
      setCategoryName("");
      fetchCategories();
      setIsModalOpen(false);
    } else {
      Swal.fire("Error!", response.message, "error");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      const response = await deleteCategory(categoryId);
      if (response.success) {
        Swal.fire("Deleted!", response.message, "success");
        fetchCategories();
      } else {
        Swal.fire("Error!", response.message, "error");
      }
    }
  };

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setCategoryName(category ? category.name : "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setCategoryName("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-6">
        <h1 className="text-2xl md:text-3xl text-center md:text-left font-semibold mb-4 md:mb-6">
          Category Management
        </h1>
        <div className="flex justify-center">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center mb-4"
                onClick={() => handleOpenModal()}
              >
                <FaPlus className="mr-2" /> Add Category
              </button>
            </div>
            <div className="relative overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 w-10">No</th>
                    <th className="border p-2 w-[900px]">Category Name</th>
                    <th className="border p-2 w-16">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={category.id}
                      className="text-center odd:bg-white even:bg-gray-100"
                    >
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2 text-left">{category.name}</td>
                      <td className="p-2 flex justify-center space-x-2">
                        <button
                          className="text-yellow-500"
                          onClick={() => handleOpenModal(category)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h3 className="text-xl font-semibold mb-4">
                    {selectedCategory ? "Edit Category" : "Add Category"}
                  </h3>
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={
                        selectedCategory
                          ? handleEditCategory
                          : handleAddCategory
                      }
                    >
                      {selectedCategory ? "Update" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
