import { useState } from "react";

interface Topic {
    _id: string;
    title: string;
    level: "Basic" | "Intermediate" | "Advanced";
    video_url?: string | null;
    notes_url?: string;
}

interface EditTopicModalProps {
    topic: Topic;
    onClose: () => void;
    onSave: (updatedTopic: Partial<Topic>) => void;
}

const EditTopicModal = ({ topic, onClose, onSave }: EditTopicModalProps) => {
    const [title, setTitle] = useState(topic.title);
    const [level, setLevel] = useState(topic.level);
    const [videoPreview, setVideoPreview] = useState<string | null>(topic.video_url || null);
    const [notesUrl, setNotesUrl] = useState(topic.notes_url || "");
    const [files, setFiles] = useState<{ video?: File }>({});

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({
            _id: topic._id,
            title,
            level,
            video_url: videoPreview,
            notes_url: notesUrl,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Edit Topic</h3>

                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    className="border p-2 w-full mb-3 rounded-md"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                    className="border p-2 w-full mb-3 rounded-md"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as "Basic" | "Intermediate" | "Advanced")}
                >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>

                {/* Video Upload */}
                <label className="text-sm font-semibold mt-3 block">Preview Video</label>
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setFiles({ video: file });
                            if (videoPreview) URL.revokeObjectURL(videoPreview);
                            setVideoPreview(URL.createObjectURL(file));
                        }
                    }}
                    className="w-full p-2 border rounded mt-1"
                />
                {videoPreview && (
                    <video className="w-full mt-2 rounded-lg shadow-md" controls>
                        <source src={videoPreview} type="video/mp4" />
                    </video>
                )}

                {/* Notes URL */}
                <label className="block text-sm font-medium text-gray-700 mt-3">Notes URL</label>
                <input
                    type="url"
                    className="border p-2 w-full mb-3 rounded-md"
                    value={notesUrl}
                    onChange={(e) => setNotesUrl(e.target.value)}
                />

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-3 py-1 border rounded-md hover:bg-gray-100">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className={`px-3 py-1 rounded-md text-white ${
                            title.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!title.trim()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTopicModal;
