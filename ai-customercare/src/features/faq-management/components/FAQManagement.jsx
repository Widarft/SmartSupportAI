import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  addFAQ,
  getUserFAQs,
  updateFAQ,
  deleteFAQ,
} from "../services/faqService";
import Swal from "sweetalert2";
import FAQModal from "./FAQModal";

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    const data = await getUserFAQs();
    setFaqs(data);
  };

  const handleSubmit = async (formData) => {
    let response;

    if (selectedFAQ) {
      response = await updateFAQ(selectedFAQ.id, formData);
    } else {
      response = await addFAQ(
        formData.question,
        formData.answer,
        formData.category
      );
    }

    if (response.success) {
      Swal.fire("Sukses!", response.message, "success");
      fetchFAQs();
      handleCloseModal();
    } else {
      Swal.fire("Error!", response.message, "error");
    }
  };

  const handleEdit = (faq) => {
    setSelectedFAQ(faq);
    setIsModalOpen(true);
  };

  const handleDelete = async (faqId) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const response = await deleteFAQ(faqId);
      if (response.success) {
        Swal.fire("Terhapus!", response.message, "success");
        fetchFAQs();
      } else {
        Swal.fire("Error!", response.message, "error");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFAQ(null);
  };

  const filteredFAQs = faqs
    .filter((faq) => (filterCategory ? faq.category === filterCategory : true))
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="p-6 max-w-[1440px] bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">FAQ Management</h2>

      <div className="flex justify-between mb-4">
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilterCategory(e.target.value)}
          value={filterCategory}
        >
          <option value="">Semua Kategori</option>
          <option value="Pemesanan">Pemesanan</option>
          <option value="Pembayaran">Pembayaran</option>
          <option value="Pengiriman">Pengiriman</option>
          <option value="Pengembalian & Refund">Pengembalian & Refund</option>
          <option value="Akun & Keamanan">Akun & Keamanan</option>
          <option value="Produk">Produk</option>
          <option value="Promosi & Voucher">Promosi & Voucher</option>
          <option value="Program Membership">Program Membership</option>
          <option value="Teknikal">Teknikal</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        <select
          className="border p-2 rounded"
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Tambah FAQ
        </button>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 w-10">No</th>
              <th className="border p-2 w-36">Tanggal</th>
              <th className="border p-2 w-40">Kategori</th>
              <th className="border p-2 w-52">Pertanyaan</th>
              <th className="border p-2 w-96">Jawaban</th>
              <th className="border p-2 w-16">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredFAQs.map((faq, index) => (
              <tr key={faq.id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  {new Date(faq.createdAt.toDate()).toLocaleDateString()}
                </td>
                <td className="border p-2">{faq.category}</td>
                <td className="border p-2">{faq.question}</td>
                <td className="border p-2">{faq.answer}</td>
                <td className="p-2 flex justify-center space-x-2">
                  <button
                    className="text-yellow-500"
                    onClick={() => handleEdit(faq)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(faq.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FAQModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedFAQ}
      />
    </div>
  );
};

export default FAQManagement;
