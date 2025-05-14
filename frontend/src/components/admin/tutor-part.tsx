import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { changeTutorStatus, fetchTutors } from "@/api/profile";
import { Profile } from "@/types/user";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import AdminPagination from "@/components/admin/pagination";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "../ui/confirm-dialog";
import LoadingSkeletonCards from "../ui/loading-skeleton";

const TutorManagement = () => {
    const [tutors, setTutors] = useState<Profile[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
        tutorId: string;
        action: "approve" | "block" | "unblock";
    } | null>(null);

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortOrder, setSortOrder] = useState("asc");

    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme.includes("dark");

    useEffect(() => {
        getTutors();
    }, []);

    const getTutors = async () => {
        try {
            setLoading(true);
            const response = await fetchTutors();
            setTutors(response.tutors);
        } catch (error: any) {
            toast.error(error.error || "Failed to fetch tutors");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmedAction = async () => {
        if (!pendingAction) return;

        const { tutorId, action } = pendingAction;
        await handleAction(tutorId, action);
        setDialogOpen(false);
        setPendingAction(null);
    };

    const handleAction = async (
        tutorId: string,
        action: "approve" | "block" | "unblock"
    ) => {
        try {
            const response = await changeTutorStatus(tutorId, action);
            toast.success(response.message);
            setTutors((prevTutors) =>
                prevTutors.map((tutor) =>
                    tutor._id === tutorId
                        ? {
                            ...tutor,
                            isTutorVerified:
                                action === "approve" ? true : tutor.isTutorVerified,
                            isBlocked:
                                action === "block"
                                    ? true
                                    : action === "unblock"
                                        ? false
                                        : tutor.isBlocked,
                        }
                        : tutor
                )
            );
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const filteredTutors = tutors
        .filter((tutor) =>
            tutor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(
            (tutor) =>
                filterStatus === "All" ||
                (filterStatus === "Verified" && tutor.isTutorVerified) ||
                (filterStatus === "Blocked" && tutor.isBlocked)
        )
        .sort((a, b) =>
            sortOrder === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );

    const tutorsPerPage = 12;
    const totalFilteredPages = Math.ceil(filteredTutors.length / tutorsPerPage);
    const paginatedTutors = filteredTutors.slice(
        (currentPage - 1) * tutorsPerPage,
        currentPage * tutorsPerPage
    );

    if(loading) return (
       <LoadingSkeletonCards isDark={isDark} />
    )

    return (
        <div className={`container-fluid py-6 px-4 md:px-6 overflow-x-hidden ${isDark ? "bg-black/99 text-white" : "bg-white text-black"}`}>
            {/* Breadcrumb */}
            <nav className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-muted-foreground"}`}>
                <Link to="/admin/dashboard" className="hover:text-blue-500">
                    Dashboard
                </Link>{" "}
                &gt; <span className={`font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>Tutors</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-foreground"}`}>Tutors</h2>
                <Link
                    to="/admin/categories"
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700"
                >
                    <ChevronLeft size={16} /> Back
                </Link>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <Input
                    type="text"
                    placeholder="Search tutors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`border ${isDark ? "bg-gray-950 text-white border-gray-700" : "bg-background text-foreground border-gray-300"}`}
                />

                <Select onValueChange={setFilterStatus} defaultValue="All">
                    <SelectTrigger className={`border ${isDark ? "bg-gray-950 text-white border-gray-700" : "bg-background text-foreground border-gray-300"}`}>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className={`${isDark ? "bg-gray-800 text-white" : ""}`}>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={setSortOrder} defaultValue="asc">
                    <SelectTrigger className={`border ${isDark ? "bg-gray-950 text-white border-gray-700" : "bg-background text-foreground border-gray-300"}`}>
                        <SelectValue placeholder="Sort by name" />
                    </SelectTrigger>
                    <SelectContent className={`${isDark ? "bg-gray-800 text-white" : ""}`}>
                        <SelectItem value="asc">A - Z</SelectItem>
                        <SelectItem value="desc">Z - A</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {paginatedTutors.map((tutor) => (
                    <div
                        key={tutor._id}
                        className={`p-4 rounded-lg shadow-md border transition-all duration-200 ${isDark ? "bg-black border-gray-700 text-white" : "bg-white border-gray-200 text-black"
                            }`}
                    >
                        <h3 className="text-lg font-semibold mb-1">{tutor.name}</h3>
                        <p className="text-sm mb-2 break-all">{tutor.email}</p>

                        <div className="mb-3">
                            {tutor.isTutorVerified ? (
                                <span className="text-green-500 font-medium">Verified</span>
                            ) : tutor.isBlocked ? (
                                <span className="text-red-500 font-medium">Blocked</span>
                            ) : (
                                <span className="text-yellow-500 font-medium">Pending</span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={() => navigate(`/admin/tutors/${tutor._id}`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5"
                            >
                                View
                            </Button>
                            {!tutor.isTutorVerified && (
                                <Button
                                    onClick={() => {
                                        setPendingAction({ tutorId: tutor._id as string, action: "approve" });
                                        setDialogOpen(true)
                                    }}
                                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5"
                                >
                                    Approve
                                </Button>
                            )}
                            {!tutor.isBlocked ? (
                                <Button
                                    onClick={() => {
                                        setPendingAction({ tutorId: tutor._id as string, action: "block" });
                                        setDialogOpen(true);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5"
                                >
                                    Block
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        setPendingAction({ tutorId: tutor._id as string, action: "unblock" });
                                        setDialogOpen(true)
                                    }}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1.5"
                                >
                                    Unblock
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
                <AdminPagination
                    currentPage={currentPage}
                    totalPages={totalFilteredPages}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            <ConfirmDialog
                isOpen={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setPendingAction(null);
                }}
                onConfirm={handleConfirmedAction}
                title="Are you sure?"
                message={`Do you really want to ${pendingAction?.action} this tutor?`}
                confirmText={pendingAction?.action === "approve" ? "Approve" :
                    pendingAction?.action === "block" ? "Block" : "Unblock"}
                cancelText="Cancel"
                isDark={isDark}
            />

        </div>
    );
};

export default TutorManagement;
