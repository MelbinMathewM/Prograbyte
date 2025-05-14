import { useEffect, useState } from "react";
import { Plus, Edit, Trash, X } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "@/contexts/theme-context";
import { Link } from "react-router-dom";

import {
    fetchOffers,
    postOffer,
    editOffer,
    removeOffer,
} from "@/api/offer";

import AdminPagination from "./pagination";
import { IOffer } from "@/types/course";

const OfferPart = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");
    const [offers, setOffers] = useState<IOffer[]>([]);
    const [selectedOffer, setSelectedOffer] = useState<IOffer | null>(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { theme } = useTheme();
    const isDark = theme.includes("dark");

    const itemsPerPage = 8;
    const totalPages = Math.ceil(offers?.length / itemsPerPage);
    const filteredOffers = offers?.filter((o: IOffer) =>
        o?.title?.toLowerCase().includes(search.toLowerCase())
    );
    const paginatedOffers = filteredOffers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState<number>(0);
    const [expiryDate, setExpiryDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadOffers = async () => {

            try {
                const res = await fetchOffers();
                setOffers(res.offers);
            } catch (err: any) {
                console.error("Failed to fetch offers", err.message);
            }
        };

        loadOffers();
    }, []);

    const handleShowModal = (
        type: "add" | "edit" | "delete",
        offer?: IOffer
    ) => {
        setModalType(type);
        setSelectedOffer(offer || null);
        setShowModal(true);

        if (type === "edit" && offer) {
            setTitle(offer.title);
            setDescription(offer.description);
            setDiscount(offer.discount);
            setExpiryDate(offer.expiryDate.split("T")[0]);
        } else {
            setTitle("");
            setDescription("");
            setDiscount(0);
            setExpiryDate("");
            setErrorMessage("");
        }
    };

    const handleAddOffer = async () => {
        if (!title || !discount || !expiryDate) {
            setErrorMessage("Please fill all required fields.");
            return;
        }

        try {
            const res = await postOffer({ title, description, discount, expiryDate });
            setOffers(prev => [...prev, res.offer]);
            toast.success("Offer added!");
            setShowModal(false);
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to add offer");
        }
    };

    const handleEditOffer = async () => {
        if (!selectedOffer || !title || !discount || !expiryDate) return;

        try {
            const res = await editOffer(selectedOffer._id, {
                title,
                description,
                discount,
                expiryDate,
            });
            setOffers(prev =>
                prev.map(o => (o._id === selectedOffer._id ? res.updatedOffer : o))
            );
            toast.success("Offer updated!");
            setShowModal(false);
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to edit offer");
        }
    };

    const handleDeleteOffer = async () => {
        if (!selectedOffer) return;

        try {
            await removeOffer(selectedOffer._id);
            setOffers(prev => prev.filter(o => o._id !== selectedOffer._id));
            toast.success("Offer deleted!");
            setShowModal(false);
        } catch (err: any) {
            toast.error("Failed to delete offer");
        }
    };

    return (
        <div className={`px-6 py-6 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
            <nav className="text-sm text-gray-400 mb-4">
                <Link to="/admin/dashboard" className="hover:text-blue-400">Home</Link> &gt;
                <span className="font-semibold"> Offers</span>
            </nav>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Offers</h2>
                <button
                    onClick={() => handleShowModal("add")}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-sm"
                >
                    <Plus size={20} className="mr-2" /> Add
                </button>
            </div>

            <input
                type="text"
                placeholder="Search offer title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`mb-4 w-full md:w-1/3 p-2 border rounded-sm ${isDark ? "bg-gray-850 text-white border-gray-700" : "border-gray-300"}`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedOffers.map((offer: IOffer) => (
                    <div
                        key={offer._id}
                        className={`p-4 border rounded shadow-sm ${isDark ? "bg-gray-850 border-gray-700" : "bg-white border-gray-200"}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold">{offer.title}</h3>
                                <p className="text-sm text-gray-400">{offer.description}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {offer.discount}% off – Expires on {new Date(offer.expiryDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="bg-green-500 hover:bg-green-600 p-2 text-white rounded-sm"
                                    onClick={() => handleShowModal("edit", offer)}
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 p-2 text-white rounded-sm"
                                    onClick={() => handleShowModal("delete", offer)}
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                    <div className={`w-96 p-6 rounded shadow-lg ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}>
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold capitalize">{modalType} Offer</h2>
                            <button onClick={() => setShowModal(false)}><X /></button>
                        </div>

                        {modalType !== "delete" ? (
                            <>
                                {errorMessage && <p className="text-red-500 mb-3">{errorMessage}</p>}
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 mb-3 border rounded-sm"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2 mb-3 border rounded-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Discount (%)"
                                    value={discount}
                                    onChange={(e) => setDiscount(Number(e.target.value))}
                                    className="w-full p-2 mb-3 border rounded-sm"
                                />
                                <input
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full p-2 mb-3 border rounded-sm"
                                />
                                <button
                                    onClick={modalType === "add" ? handleAddOffer : handleEditOffer}
                                    className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm"
                                >
                                    {modalType === "add" ? "Add" : "Update"} Offer
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-center mb-4">Are you sure you want to delete this offer?</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setShowModal(false)} className="w-full bg-gray-600 text-white p-2 rounded-sm">Cancel</button>
                                    <button onClick={handleDeleteOffer} className="w-full bg-red-600 text-white p-2 rounded-sm">Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default OfferPart;
