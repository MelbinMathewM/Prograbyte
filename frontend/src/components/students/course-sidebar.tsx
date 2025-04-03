import Input from "@/components/ui/Input";
import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectItem 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal } from "lucide-react";
import { Category } from "@/types/course";

interface FilterSidebarProps {
    isDarkMode: boolean;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    categories: Category[];
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    sortOption: string;
    setSortOption: (value: string) => void;
    minPrice: number;
    setMinPrice: (value: number) => void;
    maxPrice: number;
    setMaxPrice: (value: number) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
    isDarkMode, 
    searchQuery, 
    setSearchQuery, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    sortOption, 
    setSortOption, 
    minPrice, 
    setMinPrice, 
    maxPrice, 
    setMaxPrice 
}) => {
    return (
        <Card className={`p-6 rounded-sm ${isDarkMode ? "bg-gray-800 text-white" : "bg-white shadow-lg"}`}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <SlidersHorizontal className="mr-2" /> Filters
            </h2>

            {/* Search Bar */}
            <div className="relative mb-4">
                <Input 
                    type="text" 
                    placeholder="Search courses..." 
                    className={`pr-10 ${isDarkMode ? "bg-gray-700 text-white placeholder-gray-400" : ""} border-gray-400`} 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
            </div>

            {/* Category Filter */}
            <Label className={`block font-semibold mb-2 text-gray-400`}>Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className={`w-full ${isDarkMode ? "bg-gray-700 text-white" : ""}`}>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className={`${isDarkMode ? "bg-gray-700 text-white" : ""}`}>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id as string}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Sorting Option */}
            <Label className="block font-semibold mt-4 mb-2 text-gray-400">Sort By</Label>
            <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className={`w-full ${isDarkMode ? "bg-gray-700 text-white" : ""}`}>
                    <SelectValue placeholder="Select sorting option" />
                </SelectTrigger>
                <SelectContent className={`${isDarkMode ? "bg-gray-700 text-white" : ""}`}>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="rating-high">Rating: High to Low</SelectItem>
                    <SelectItem value="rating-low">Rating: Low to High</SelectItem>
                </SelectContent>
            </Select>

            {/* Price Range */}
            <Label className="block font-semibold mt-4 mb-2 text-gray-400">Price Range ($)</Label>
            <div className={`flex items-center justify-between gap-2 p-2 rounded-lg border ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-100"}`}>
                <input 
                    type="null" 
                    placeholder="0" 
                    className="w-1/2 text-center bg-transparent outline-none" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(Number(e.target.value))} 
                    readOnly
                />
                <span>-</span>
                <input 
                    type="null" 
                    placeholder="5000" 
                    className="w-1/2 text-center bg-transparent outline-none" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))} 
                    readOnly
                />
            </div>
            <Slider 
                defaultValue={[minPrice, maxPrice]} 
                min={0} 
                max={5000} 
                step={5} 
                onValueChange={(values) => { setMinPrice(values[0]); setMaxPrice(values[1]); }} 
                className="mt-4"
            />
        </Card>
    );
};

export default FilterSidebar;
