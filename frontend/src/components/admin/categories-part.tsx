import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash, X } from "lucide-react";
import { Category } from "@/types/course";
import AdminPagination from "./pagination";
import { useTheme } from "@/contexts/theme-context";
import { deleteCategories, editCategories, fetchCategories, postCategories } from "@/api/course";
import toast from "react-hot-toast";

const CategoriesPart: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("name");
    const [filterBy, setFilterBy] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>("add");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Form State
    const [name, setName] = useState<string>("");
    const [type, setType] = useState<string>("Framework");
    const [error, setError] = useState<string>("");

    const { theme } = useTheme();
    const isDark = theme.includes("dark");

    const itemsPerPage = 8;
    const navigate = useNavigate();

    const handleShowModal = (type: 'add' | 'edit' | 'delete', category?: Category) => {
        setModalType(type);
        setSelectedCategory(category || null);
        setShowModal(true);
        if (type === "edit" && category) {
            setName(category.name);
            setType(category.type);
        } else {
            setName("");
            setType("Framework");
            setError("");
        }
    };

    const getCategories = async () => {
        try {
            const response = await fetchCategories();
            setCategories(response.categories);
        } catch (error: any) {
            console.error("Error fetching categories:", error.error);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const filteredCategories = categories
        .filter(cat => filterBy === "all" || cat.type === filterBy)
        .filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type)));

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAddCategory = async () => {
        if (!name.trim() || !type.trim()) {
            setError("All fields are required.");
            return;
        }

        try {
            const response = await postCategories(name, type);
            toast.success(response.message);
            setCategories((prev) => [...prev, response.newCategory]);
            setShowModal(false);
            setName("");
            setType("Framework");
            setError("");
        } catch (error: any) {
            setError(error.error || "Failed to update category");
        }
    };

    const handleEditCategory = async () => {
        if (!name || !type || !selectedCategory) return;

        try {
            const response = await editCategories(selectedCategory._id as string, name, type);
            toast.success(response.message);
            setCategories((prev) =>
                prev.map((category) =>
                    category._id === selectedCategory._id ? { ...category, name, type } : category
                )
            );
            setShowModal(false);
            setSelectedCategory(null);
        } catch (error: any) {
            setError(error.error || "Failed to update category");
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;
        try {
            const response = await deleteCategories(selectedCategory._id as string);
            toast.success(response.message);
            setCategories((prev) =>
                prev.filter((category) =>
                    category._id !== selectedCategory._id
                )
            );
            setShowModal(false);
            setSelectedCategory(null);
        } catch (error: any) {
            setError(error.error || "Failed to update category");
        }
    };

    return (
        <div className={`container-fluid py-6 px-6 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            {/* Breadcrumb Navigation */}
            <nav className="text-gray-400 text-sm mb-4">
                <Link to="/admin/dashboard" className="hover:text-blue-400">Home</Link> &gt;
                <span className="text-gray-400 font-semibold"> Categories</span>
            </nav>

            {/* Header Section */}
            <div className="flex w-full flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">Categories</h2>
                <button
                    onClick={() => handleShowModal("add")}
                    className="flex ml-auto items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm cursor-pointer"
                >
                    <Plus size={20} className="mr-2" /> Category
                </button>
            </div>

            {/* Filter, Sort & Search Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full md:w-1/3 border rounded-sm p-2 focus:ring-2 ${isDark ? "bg-gray-850 text-white border-gray-700 focus:ring-blue-400" : "border-gray-300"}`}
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full md:w-1/3 border rounded-sm p-2 ${isDark ? "bg-gray-850 text-white border-gray-700" : "border-gray-300"}`}
                >
                    <option value="name">Sort by Name</option>
                    <option value="type">Sort by Type</option>
                </select>
                <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className={`w-full md:w-1/3 border rounded-sm p-2 ${isDark ? "bg-gray-850 text-white border-gray-700" : "border-gray-300"}`}
                >
                    <option value="all">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                </select>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedCategories.map(({ _id, name, type }) => (
                    <div
                        key={_id}
                        className={`p-4 transition-transform transform hover:scale-105 cursor-pointer border rounded-sm shadow-lg ${isDark ? "bg-gray-850 border-gray-700" : "bg-white border-gray-200"}`}
                        onClick={() => navigate(`/admin/categories/courses/${name}/${_id}`)}
                    >
                        <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-700"}`}>{name}</h3>
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{type}</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="bg-green-500 text-white p-2 rounded-sm hover:bg-green-600 transition"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowModal("edit", { _id, name, type });
                                }}
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                className="bg-red-500 text-white p-2 rounded-sm hover:bg-red-600 transition"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowModal("delete", { _id, name, type });
                                }}
                            >
                                <Trash size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
                    <div className={`p-6 rounded-sm shadow-lg w-96 border ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                {modalType === "add" ? "Add Category" : modalType === "edit" ? "Edit Category" : "Delete Category"}
                            </h2>
                            <button className="hover:text-red-500" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {modalType !== "delete" ? (
                            <>
                                {error && <p className="text-red-500 font-bold text-center pb-2">{error}</p>}
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full border rounded-sm p-2 mb-3 ${isDark ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300"}`}
                                />
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className={`w-full border p-2 mb-3 rounded-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300"}`}
                                >
                                    <option value="Framework">Framework</option>
                                    <option value="Programming language">Programming language</option>
                                </select>
                                <button
                                    onClick={modalType === "add" ? handleAddCategory : handleEditCategory}
                                    className="w-full bg-blue-500 hover:bg-blue-600 rounded-sm text-white p-2 cursor-pointer"
                                >
                                    {modalType === "add" ? "Add Category" : "Update Category"}
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-center mb-4">Are you sure you want to delete this category?</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setShowModal(false)} className="w-full bg-gray-500 hover:bg-gray-600 cursor-pointer p-2 text-white rounded-lg">Cancel</button>
                                    <button onClick={handleDeleteCategory} className="w-full cursor-pointer bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg">Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Pagination */}
            <AdminPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );

};

export default CategoriesPart;
