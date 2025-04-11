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

const UserList = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
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
        <div className={`container py-6 px-6 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
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

            {/* Search & Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full" />
                <Select onValueChange={setFilter} defaultValue="All">
                    <SelectTrigger className="w-full"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Non-Premium">Non-Premium</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={setSortOrder} defaultValue="name">
                    <SelectTrigger className="w-full"><SelectValue placeholder="Sort by" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="date">Date Joined</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Scrollable Table */}
            <div className="w-full overflow-x-auto rounded-lg shadow">
                <table className="min-w-max w-full border-collapse border border-gray-300 bg-white text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border">Name</th>
                            <th className="p-3 border">Email</th>
                            <th className="p-3 border">Joined</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user._id} className="border">
                                <td className="p-3 border">{user.name}</td>
                                <td className="p-3 border">{user.email}</td>
                                <td className="p-3 border">{dayjs(user.createdAt).format('DD MMM YYYY')}</td>
                                <td className="p-3 border">{user.isBlocked ? "Blocked" : "Active"}</td>
                                <td className="p-3 border">
                                    <Button
                                        variant={user.isBlocked ? "destructive" : "default"}
                                        onClick={() => handleAction(user._id as string, user.isBlocked ? "unblock" : "block")}
                                    >
                                        {user.isBlocked ? "Unblock" : "Block"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center space-x-2 mt-4">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
                <Button disabled={indexOfLastUser >= filteredUsers.length} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
            </div>
        </div>
    );
};

export default UserList;
