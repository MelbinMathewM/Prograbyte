import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash, X } from "lucide-react";
import axiosInstance from "../../axios/axiosConfig";
import { Category } from "../../types/course";

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

    // Fetch categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`course/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

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
            await axiosInstance.post(`course/categories`,{name, type});
            fetchCategories();
            setShowModal(false);
            setName("");
            setType("Framework");
            setError("");
        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.error || "Failed to update category");
            } else if (error.request) {
                setError("No response from server. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleEditCategory = async () => {
        if (!name || !type || !selectedCategory) return;

        try {
            await axiosInstance.put(`course/categories/${selectedCategory._id}`, { name, type });
            fetchCategories();
            setShowModal(false);
        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.error || "Failed to update category");
            } else if (error.request) {
                setError("No response from server. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };    

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;
        try {
            await axiosInstance.delete(`course/categories/${selectedCategory._id}`);
            fetchCategories();
            setShowModal(false);
        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.error || "Failed to update category");
            } else if (error.request) {
                setError("No response from server. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };


    const handleCategoryClick = (categoryName: string, categoryId: number) => {
        navigate(`/admin/categories/courses/${categoryName}/${categoryId}`)
    }

    return (
        <div className="container py-6 px-6">
            {/* Breadcrumb Navigation */}
            <nav className="text-gray-500 text-sm mb-4">
                <Link to="/admin/dashboard" className="hover:underline">Home</Link> &gt;
                <span className="text-primary font-semibold"> Categories</span>
            </nav>

            {/* Header Section */}
            <div className="flex w-full flex-col-2 md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">Categories</h2>
                <button onClick={() => handleShowModal("add")} className="flex ml-auto items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                    <Plus size={20} className="mr-2" /> Add Category
                </button>
            </div>

            {/* Filter, Sort & Search Section */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/3 border rounded-lg p-2 cursor-pointer"
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full md:w-1/3 border rounded-lg p-2 cursor-pointer"
                >
                    <option value="name">Sort by Name</option>
                    <option value="type">Sort by Type</option>
                </select>

                <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full md:w-1/3 border rounded-lg p-2 cursor-pointer"
                >
                    <option value="all">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                </select>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedCategories.map(({ _id, name, type }) => (
                    <div 
                    key={_id} 
                    className="bg-gray-400 shadow-md rounded-lg overflow-hidden cursor-pointer" 
                    onClick={() => handleCategoryClick(name,_id as number)}
                >
                    <div className="p-4">
                        <h3 className="text-lg font-bold">{name}</h3>
                        <p className="text-gray-900 text-sm">{type}</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button 
                                className="flex bg-green-500 text-white rounded px-2 py-2" 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleShowModal("edit", { _id, name, type }); 
                                }}
                            >
                                <Edit size={16} className="mt-1"/>
                            </button>
                            <button 
                                className="flex bg-red-500 text-white rounded px-2 py-2" 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleShowModal("delete", { _id, name, type }); 
                                }}
                            >
                                <Trash size={16} className="mt-1"/>
                            </button>
                        </div>
                    </div>
                </div>                
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
                    <div className="bg-black border border-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">{modalType === "add" ? "Add Category" : modalType === "edit" ? "Edit Category" : "Delete Category"}</h2>
                            <button className="hover:text-red-500" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {modalType !== "delete" ? (
                            <>
                                {error && <p className="text-red-500 font-bold text-center pb-2">{error}</p>}
                                <input type="text" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 mb-3" />
                                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2 mb-3">
                                    <option className="text-black" value="Framework">Framework</option>
                                    <option className="text-black" value="Programming language">Programming language</option>
                                </select>
                                <button onClick={modalType === "add" ? handleAddCategory : handleEditCategory} className="w-full bg-blue-600 text-white p-2 rounded-lg">
                                    {modalType === "add" ? "Add Category" : "Update Category"}
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-white text-center mb-4">Are you sure you want to delete this category?</p>
                                <button onClick={handleDeleteCategory} className="w-full bg-red-600 text-white p-2 rounded-lg mb-2">Delete</button>
                                <button onClick={() => setShowModal(false)} className="w-full bg-gray-600 text-white p-2 rounded-lg">Cancel</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center gap-2">
                <button
                    className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-900 text-black" : "bg-blue-600 text-white"}`}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-800 text-white" : "bg-blue-500"}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-900 text-black" : "bg-blue-600 text-white"}`}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CategoriesPart;
