import { Pencil, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { addSkill, deleteSkill, editSkill } from "@/api/profile";
import toast from "react-hot-toast";
import { SkillProps } from "@/types/user";
import ConfirmDialog from "@/components/ui/confirm-dialog";

const SkillPart: React.FC<SkillProps> = ({ skills, isDark, userId, setSkills }) => {

    const [newSkill, setNewSkill] = useState("");
    const [editingSkill, setEditingSkill] = useState<string | null>(null);
    const [editSkillValue, setEditSkillValue] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [isEditingSkill, setIsEditingSkill] = useState(false);

    const startEditing = (skill: string) => {
        setEditingSkill(skill);
        setEditSkillValue(skill);
    };

    const handleAddSkill = async () => {
        if (!userId || !newSkill.trim()) return;
        try {
            const response = await addSkill(userId as string, newSkill);
            if (response.error) throw new Error(response.error);

            setSkills(response.skills);
            setNewSkill("");
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error.response.data.error);
        }
    };

    const confirmRemoveSkill = (skill: string) => {
        setSelectedSkill(skill);
        setIsConfirmOpen(true);
    };

    const handleRemoveSkill = async () => {
        if (!userId || !selectedSkill) return;
        console.log('jiii')
        try {
            const response = await deleteSkill(userId as string, selectedSkill);
            if (response.error) throw new Error(response.error);

            setSkills(response.skills);
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error.response.data.error);
        } finally {
            setIsConfirmOpen(false);
            setSelectedSkill(null);
        }
    };

    const handleUpdateSkill = async (oldSkill: string) => {
        if (!editSkillValue.trim() || !userId || editSkillValue === oldSkill) {
            setEditingSkill(null);
            return;
        }

        try {
            const response = await editSkill(userId as string, oldSkill, editSkillValue);
            setSkills([...skills].map((s) => (s === oldSkill ? editSkillValue : s)));
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error.response.data.error);
        } finally {
            setEditingSkill(null);
        }
    }
    return (
        <div className={`p-6 col-span-1 md:col-span-3 rounded-lg shadow-md transition-all ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex w-full sm:mx-auto justify-between items-center">
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-700"}`}>Skills</h2>
                <Pencil
                    className="text-gray-500 cursor-pointer hover:text-blue-500 transition-all"
                    size={18}
                    onClick={() => setIsEditingSkill(true)}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                    <div key={index} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-full flex items-center group transition-all duration-200">
                        {editingSkill === skill ? (
                            <input
                                type="text"
                                className="bg-transparent border-none focus:outline-none text-white w-24"
                                value={editSkillValue}
                                onChange={(e) => setEditSkillValue(e.target.value)}
                                onBlur={() => handleUpdateSkill(skill)}
                                autoFocus
                            />
                        ) : (
                            <span onClick={() => startEditing(skill)} className="cursor-pointer">{skill}</span>
                        )}
                        <X
                            className="ml-2 cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                            size={14}
                            onClick={() => confirmRemoveSkill(skill)}
                        />
                    </div>
                ))}
            </div>

            {/* Confirmation Modal */}
            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleRemoveSkill}
                title="Confirm Delete"
                message="Are you sure you want to remove this skill?"
                confirmText="Remove"
                cancelText="Cancel"
                isDark={isDark}
            />

            {/* Add Skill Input */}
            <div className="mt-4 flex items-center gap-2">
                {isEditingSkill && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter a skill"
                            className={`border rounded-lg p-1 px-2 transition-all ${isDark ? "bg-gray-800 text-white border-gray-700" : "border-gray-300"
                                }`}
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            autoFocus
                        />
                        <button
                            className="bg-gray-500 hover:bg-green-600 text-white p-2 rounded-lg flex items-center gap-1 transition-all"
                            onClick={() => {
                                handleAddSkill();
                                setIsEditingSkill(false);
                            }}
                        >
                            <Plus size={16} />
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center gap-1 transition-all"
                            onClick={() => {
                                setIsEditingSkill(false);
                            }}
                        >
                            <X size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default SkillPart;