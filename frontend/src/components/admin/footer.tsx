const AdminFooter = () => {
    return (
        <footer className="bg-gray-800 text-white p-6">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <p className="text-lg font-semibold">Prograbyte</p>
                    <p className="text-sm">The ultimate platform for learning and growing</p>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-end gap-4">
                    <a href="/admin/dashboard" className="text-sm hover:text-green-400">Dashboard</a>
                    <a href="/admin/settings" className="text-sm hover:text-green-400">Settings</a>
                    <a href="/admin/help" className="text-sm hover:text-green-400">Help</a>
                    <a href="/admin/logout" className="text-sm hover:text-green-400">Logout</a>
                </div>
            </div>

            <div className="border-t border-gray-600 mt-4 pt-4 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Prograbyte. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default AdminFooter;
