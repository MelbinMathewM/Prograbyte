import { Card, CardContent } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";

const DashboardPart = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Top Courses */}
                <Card className="dark:bg-gray-800">
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Top Courses</h3>
                        <ul className="text-gray-600 dark:text-gray-400">
                            <li>🚀 React Masterclass</li>
                            <li>🔢 Data Structures</li>
                            <li>🎨 UI/UX Fundamentals</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Top Tutors */}
                <Card className="dark:bg-gray-800">
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Top Tutors</h3>
                        <ul className="text-gray-600 dark:text-gray-400">
                            <li>👩‍🏫 Sarah Johnson</li>
                            <li>🧑‍🏫 John Doe</li>
                            <li>👩‍💻 Emily Smith</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Revenue Graph */}
                <Card className="col-span-1 md:col-span-2 xl:col-span-3 dark:bg-gray-800">
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Analytics Overview</h3>
                        <Bar 
                            data={{
                                labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                                datasets: [
                                    {
                                        label: "Earnings ($)",
                                        data: [400, 600, 800, 700, 1000],
                                        backgroundColor: "#3b82f6",
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                scales: {
                                    y: { beginAtZero: true }
                                }
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
};

export default DashboardPart;
