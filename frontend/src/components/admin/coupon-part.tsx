import { useEffect, useState } from "react";
import { Plus, Edit, Trash, X } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "@/contexts/theme-context";
import { Link } from "react-router-dom";

import {
    fetchCoupons,
    postCoupon,
    editCoupon,
    removeCoupon,
} from "@/api/coupon";

import AdminPagination from "./pagination";
import { ICoupon } from "@/types/course";

const CouponPart = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");
    const [coupons, setCoupons] = useState<ICoupon[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { theme } = useTheme();
    const isDark = theme.includes("dark");

    const itemsPerPage = 8;
    const totalPages = Math.ceil(coupons?.length / itemsPerPage);
    const filteredCoupons = coupons?.filter((c: ICoupon) =>
        c?.code?.toLowerCase().includes(search.toLowerCase())
    );
    const paginatedCoupons = filteredCoupons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState<number>(0);
    const [isLiveStream, setIsLiveStream] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadCoupons = async () => {

            try {
                const res = await fetchCoupons();
                setCoupons(res.coupons)
            } catch (err: any) {
                console.log(err.error);
            }
        };

        loadCoupons();
    }, []);

    const handleShowModal = (
        type: "add" | "edit" | "delete",
        coupon?: ICoupon
    ) => {
        setModalType(type);
        setSelectedCoupon(coupon || null);
        setShowModal(true);

        if (type === "edit" && coupon) {
            setCode(coupon.code);
            setDiscount(coupon.discount);
            setIsLiveStream(coupon.isLiveStream);
        } else {
            setCode("");
            setDiscount(0);
            setIsLiveStream(false);
            setErrorMessage("");
        }
    };

    const handleAddCoupon = async () => {
        if (!code.trim() || discount <= 0) {
            setErrorMessage("Please fill all required fields.");
            return;
        }

        try {
            const response = await postCoupon(code.toUpperCase(), discount, isLiveStream);
            setCoupons(prev => [...prev, response.coupon]);
            toast.success("Coupon added!");
            setShowModal(false);
        } catch (err: any) {
            setErrorMessage(err.error || "Failed to add coupon");
        }
    };

    const handleEditCoupon = async () => {
        if (!selectedCoupon || !code || discount <= 0) return;

        try {
            const response = await editCoupon(selectedCoupon._id, {
                code: code.toUpperCase(),
                discount,
                isLiveStream,
            });
            setCoupons(prev =>
                prev.map(c => (c._id === selectedCoupon._id ? response.coupon : c))
            );
            toast.success("Coupon updated!");
            setShowModal(false);
        } catch (err: any) {
            setErrorMessage(err.error || "Failed to edit coupon");
        }
    };

    const handleDeleteCoupon = async () => {
        if (!selectedCoupon) return;

        try {
            await removeCoupon(selectedCoupon._id);
            setCoupons(prev => prev.filter(c => c._id !== selectedCoupon._id));
            toast.success("Coupon deleted!");
            setShowModal(false);
        } catch (err: any) {
            toast.error("Failed to delete coupon");
        }
    };

    return (
        <div className={`px-6 py-6 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-400 mb-4">
                <Link to="/admin/dashboard" className="hover:text-blue-400">Home</Link> &gt;
                <span className="font-semibold"> Coupons</span>
            </nav>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Coupons</h2>
                <button
                    onClick={() => handleShowModal("add")}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-sm"
                >
                    <Plus size={20} className="mr-2" /> Add
                </button>
            </div>

            <input
                type="text"
                placeholder="Search coupon code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`mb-4 w-full md:w-1/3 p-2 border rounded-sm ${isDark ? "bg-gray-850 text-white border-gray-700" : "border-gray-300"}`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedCoupons.map((coupon: ICoupon) => (
                    <div
                        key={coupon._id}
                        className={`p-4 border rounded shadow-sm ${isDark ? "bg-gray-850 border-gray-700" : "bg-white border-gray-200"}`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">{coupon.code}</h3>
                                <p className="text-sm text-gray-400">
                                    {coupon.discount}% off {coupon.isLiveStream ? "(Live Class)" : "(Course)"}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="bg-green-500 hover:bg-green-600 p-2 text-white rounded-sm"
                                    onClick={() => handleShowModal("edit", coupon)}
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 p-2 text-white rounded-sm"
                                    onClick={() => handleShowModal("delete", coupon)}
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
                            <h2 className="text-xl font-bold capitalize">{modalType} Coupon</h2>
                            <button onClick={() => setShowModal(false)}><X /></button>
                        </div>

                        {modalType !== "delete" ? (
                            <>
                                {errorMessage && <p className="text-red-500 mb-3 font-semibold">{errorMessage}</p>}
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full p-2 mb-3 border rounded-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Discount (%)"
                                    value={discount}
                                    onChange={(e) => setDiscount(Number(e.target.value))}
                                    className="w-full p-2 mb-3 border rounded-sm"
                                />
                                <label className="flex items-center gap-2 mb-3">
                                    <input
                                        type="checkbox"
                                        checked={isLiveStream}
                                        onChange={() => setIsLiveStream(!isLiveStream)}
                                    />
                                    Is for Live Class?
                                </label>
                                <button
                                    onClick={modalType === "add" ? handleAddCoupon : handleEditCoupon}
                                    className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm"
                                >
                                    {modalType === "add" ? "Add" : "Update"} Coupon
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-center mb-4">Are you sure you want to delete this coupon?</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setShowModal(false)} className="w-full bg-gray-600 text-white p-2 rounded-sm">Cancel</button>
                                    <button onClick={handleDeleteCoupon} className="w-full bg-red-600 text-white p-2 rounded-sm">Delete</button>
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

export default CouponPart;
