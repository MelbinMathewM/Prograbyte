import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Profile } from "@/types/user";
import { changeUserStatus, fetchUsers } from "@/api/profile";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import ConfirmDialog from "../ui/confirm-dialog";
import AdminPagination from "./pagination";

const UserList = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
        userId: string;
        action: "block" | "unblock";
    } | null>(null);
    const usersPerPage = 12;
    const { theme } = useTheme();
    const isDark = theme.includes("dark");

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        filterAndSortUsers();
    }, [searchTerm, filter, sortOrder, users]);

    const getUsers = async () => {
        try {
            setLoading(true);
            const response = await fetchUsers();
            setUsers(response.users);
        } catch (error: any) {
            toast.error(error.error || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortUsers = () => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (filter !== "All") {
            filtered = filtered.filter(user =>
                filter === "Blocked" ? user.isBlocked :
                    filter === "Active" ? !user.isBlocked :
                        filter === "Premium" ? user.isPremium :
                            !user.isPremium
            );
        }

        if (sortOrder === "name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === "date") {
            filtered.sort((a, b) => dayjs(b?.createdAt).valueOf() - dayjs(a?.createdAt).valueOf());
        }

        setFilteredUsers(filtered);
        
    };
    
    const totalFilteredPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleConfirmedAction = async () => {
        if (!pendingAction) return;

        const { userId, action } = pendingAction;
        await handleAction(userId, action);
        setDialogOpen(false);
        setPendingAction(null);
    };

    const handleAction = async (userId: string, action: "block" | "unblock") => {
        try {
            const response = await changeUserStatus(userId, action);
            toast.success(response.message);
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? { ...user, isBlocked: action === "block" } : user
                )
            );
        } catch (error: any) {
            toast.error(error.error);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    if (loading) return <p>Loading...</p>;

    return (
        <div className={`container py-6 px-6 ${isDark ? "bg-black/99 text-white" : "bg-white text-gray-900"}`}>
            <nav className="text-gray-400 text-sm mb-4">
                <Link to="/admin/dashboard" className="hover:text-blue-400">Home</Link> &gt;
                <span className="text-gray-400 font-semibold"> Users</span>
            </nav>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Users</h2>
                <Link to="/admin/dashboard" className="flex bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700">
                    <ChevronLeft className="mt-0.5" size={16} /> Back
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`border ${isDark ? "bg-gray-950 text-white border-gray-700" : "bg-background text-foreground border-gray-300"}`}
                />
                <Select onValueChange={setFilter} defaultValue="All">
                    <SelectTrigger className={`border ${isDark ? "bg-gray-950 text-white border-gray-700" : "bg-background text-foreground border-gray-300"}`}>
                        <SelectValue placeholder="Filter by status" /></SelectTrigger>
                    <SelectContent className={`${isDark ? "bg-gray-800 text-white" : ""}`}>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Non-Premium">Non-Premium</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={setSortOrder} defaultValue="name">
                    <SelectTrigger className={`border ${isDark ? "bg-gray-950 text-white border-gray-700" : "bg-background text-foreground border-gray-300"}`}>
                        <SelectValue placeholder="Sort by" /></SelectTrigger>
                    <SelectContent className={`${isDark ? "bg-gray-800 text-white" : ""}`}>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="date">Date Joined</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentUsers.map(user => (
                    <div key={user._id} className={`rounded-sm border shadow-sm p-5 ${isDark ? "bg-gray-950 border-gray-700" : "bg-white border-gray-300"} transition hover:shadow-md`}>
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-500 mt-1">Joined: {dayjs(user.createdAt).format("DD MMM YYYY")}</p>
                        <p className="text-sm mt-1">
                            <span className={`font-medium ${user.isBlocked ? "text-red-500" : "text-green-600"}`}>
                                {user.isBlocked ? "Blocked" : "Active"}
                            </span>
                        </p>
                        <div className="mt-4">
                            <Button
                                onClick={() => {
                                    setPendingAction({ userId: user._id as string, action: user.isBlocked ? "unblock" : "block" });
                                    setDialogOpen(true);
                                }}
                                className={`text-white text-xs px-3 py-1.5 ${user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                            >
                                {user.isBlocked ? "Unblock" : "Block"}
                            </Button>
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
                message={`Do you really want to ${pendingAction?.action} this user?`}
                confirmText={pendingAction?.action === "block" ? "Block" : "Unblock"}
                cancelText="Cancel"
                isDark={isDark}
            />
        </div>
    );
};

export default UserList;
