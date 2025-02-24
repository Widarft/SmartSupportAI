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
      Swal.fire("Error!", "Nama kategori tidak boleh kosong.", "error");
      return;
    }

    const response = await addCategory(categoryName);
    if (response.success) {
      Swal.fire("Sukses!", response.message, "success");
      setCategoryName("");
      fetchCategories();
      setIsModalOpen(false);
    } else {
      Swal.fire("Error!", response.message, "error");
    }
  };

  const handleEditCategory = async () => {
    if (!categoryName.trim()) {
      Swal.fire("Error!", "Nama kategori tidak boleh kosong.", "error");
      return;
    }

    const response = await updateCategory(selectedCategory.id, categoryName);
    if (response.success) {
      Swal.fire("Sukses!", response.message, "success");
      setCategoryName("");
      fetchCategories();
      setIsModalOpen(false);
    } else {
      Swal.fire("Error!", response.message, "error");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Kategori yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const response = await deleteCategory(categoryId);
      if (response.success) {
        Swal.fire("Terhapus!", response.message, "success");
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="p-6 max-w-[1440px] bg-white rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Manajemen Kategori</h2>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mb-4"
          onClick={() => handleOpenModal()}
        >
          <FaPlus className="mr-2" /> Tambah Kategori
        </button>

        <div className="relative overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 w-10">No</th>
                <th className="border p-2">Nama Kategori</th>
                <th className="border p-2 w-16">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category.id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{category.name}</td>
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
                {selectedCategory ? "Edit Kategori" : "Tambah Kategori"}
              </h3>
              <input
                type="text"
                placeholder="Nama Kategori"
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
                  Batal
                </button>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={
                    selectedCategory ? handleEditCategory : handleAddCategory
                  }
                >
                  {selectedCategory ? "Update" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
