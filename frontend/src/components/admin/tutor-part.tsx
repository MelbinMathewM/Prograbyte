import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { changeTutorStatus, fetchTutors } from "@/api/profile";
import { Profile } from "@/types/user";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import AdminPagination from "@/components/admin/pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TutorManagement = () => {
    const [tutors, setTutors] = useState<Profile[]>([]);
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

    const handleAction = async (tutorId: string, action: "approve" | "block" | "unblock") => {
        try {
            const response = await changeTutorStatus(tutorId, action);
            toast.success(response.message);
            setTutors((prevTutors) =>
                prevTutors.map((tutor) =>
                    tutor._id === tutorId
                        ? {
                            ...tutor,
                            isTutorVerified: action === "approve" ? true : tutor.isTutorVerified,
                            isBlocked: action === "block" ? true : action === "unblock" ? false : tutor.isBlocked,
                        }
                        : tutor
                )
            );
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const filteredTutors = tutors
        .filter((tutor) => tutor.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((tutor) =>
            filterStatus === "All" ||
            (filterStatus === "Verified" && tutor.isTutorVerified) ||
            (filterStatus === "Blocked" && tutor.isBlocked)
        )
        .sort((a, b) => sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

    const tutorsPerPage = 12;
    const totalFilteredPages = Math.ceil(filteredTutors.length / tutorsPerPage);
    const paginatedTutors = filteredTutors.slice((currentPage - 1) * tutorsPerPage, currentPage * tutorsPerPage);

    return (
        <div className="container-fluid py-6 px-6 overflow-x-hidden">
            {/* Breadcrumb Navigation */}
            <nav className="text-gray-400 text-sm mb-4">
                <Link to="/admin/dashboard" className="hover:text-blue-400">Home</Link> &gt;
                <span className="text-gray-400 font-semibold"> Tutors</span>
            </nav>

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Tutors</h2>
                <Link to="/admin/categories" className="flex bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700">
                    <ChevronLeft className="mt-0.5" size={16} /> Back
                </Link>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input type="text" placeholder="Search tutors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                <Select onValueChange={(value) => setFilterStatus(value)} defaultValue="All">
                    <SelectTrigger className="bg-white text-gray-900">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900">
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={(value) => setSortOrder(value)} defaultValue="asc">
                    <SelectTrigger className="bg-white text-gray-900">
                        <SelectValue placeholder="Sort by name" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900">
                        <SelectItem value="asc">A - Z</SelectItem>
                        <SelectItem value="desc">Z - A</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table Wrapper - Fix Horizontal Scroll Issue */}
            <div className="relative w-full">
                {/* This wrapper ensures only the table is scrollable */}
                <div className="w-full overflow-x-auto">
                    <table className="border border-gray-300 rounded-md table-auto table-responsive scrollable">
                        <thead>
                            <tr className="bg-gray-100 hover:bg-gray-200">
                                <th className="text-left px-4 py-2">Name</th>
                                <th className="text-left px-4 py-2">Email</th>
                                <th className="text-left px-4 py-2">Status</th>
                                <th className="text-left px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTutors.map((tutor) => (
                                <tr key={tutor._id} className="border-b hover:bg-gray-200">
                                    <td className="px-4 py-2 whitespace-nowrap">{tutor.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{tutor.email}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {tutor.isTutorVerified ? (
                                            <span className="text-green-600 font-medium">Verified</span>
                                        ) : tutor.isBlocked ? (
                                            <span className="text-red-600 font-medium">Blocked</span>
                                        ) : (
                                            <span className="text-yellow-600 font-medium">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                                        <Button onClick={() => navigate(`/admin/tutors/${tutor._id}`)} className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5">
                                            View
                                        </Button>
                                        {!tutor.isTutorVerified && (
                                            <Button onClick={() => handleAction(tutor._id, "approve")} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5">
                                                Approve
                                            </Button>
                                        )}
                                        {!tutor.isBlocked ? (
                                            <Button onClick={() => handleAction(tutor._id, "block")} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5">
                                                Block
                                            </Button>
                                        ) : (
                                            <Button onClick={() => handleAction(tutor._id, "unblock")} className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1.5">
                                                Unblock
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                <AdminPagination currentPage={currentPage} totalPages={totalFilteredPages} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    );
};

export default TutorManagement;
