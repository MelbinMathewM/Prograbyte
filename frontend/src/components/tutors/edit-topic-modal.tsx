import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import Input from "../ui/Input";
import { Label } from "../../components/ui/label";
import Button from "../../components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { toast } from "react-hot-toast";

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
    isDark?: boolean;
}

const EditTopicModal = ({ topic, onClose, onSave, isDark }: EditTopicModalProps) => {
    const [title, setTitle] = useState(topic.title);
    const [level, setLevel] = useState(topic.level);
    const [videoPreview, setVideoPreview] = useState<string | null>(topic.video_url || null);
    const [notesPreview, setNotesPreview] = useState<string | null>(topic.notes_url || null);
    const [notesFile, setNotesFile] = useState<File | null>(null);
    const [files, setFiles] = useState<{ video?: File }>({});

    const validateTopicForm = (title: string, level: string, videoFile?: File, notesFile?: File | null): string | null => {
        if (!title.trim()) {
            return "Title cannot be empty.";
        }

        if (!["Basic", "Intermediate", "Advanced"].includes(level)) {
            return "Invalid level selected.";
        }

        if (videoFile) {
            const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
            if (!allowedVideoTypes.includes(videoFile.type)) {
                return "Invalid video format. Please upload an MP4, WebM, or Ogg file.";
            }
        }

        if (notesFile) {
            if (notesFile.type !== "application/pdf") {
                return "Invalid file format. Only PDFs are allowed for notes.";
            }
        }

        return null;
    };


    const handleSave = () => {
        const validationError = validateTopicForm(title, level, files.video, notesFile);

        if (validationError) {
            toast.error(validationError);
            return;
        }   

        onSave({
            _id: topic._id,
            title,
            level,
            video_url: files.video ? URL.createObjectURL(files.video) : topic.video_url,
            notes_url: notesFile ? URL.createObjectURL(notesFile) : topic.notes_url,
        });
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className={`mt-2 max-w-3xl ${isDark ? "bg-gray-900 text-white" : "bg-white"} rounded-lg p-6 max-h-[80vh] overflow-y-auto`}>
                <DialogHeader>
                    <DialogTitle className={`${isDark ? "text-white" : "text-black"}`}>Edit Topic</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols gap-4 md:grid-cols-2">
                    <div>
                        <Label className={`${isDark ? "text-gray-200" : "text-black"}`}>Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                        <Label className={`mt-3 ${isDark ? "text-gray-200" : "text-black"}`}>Level</Label>
                        <Select value={level} onValueChange={(value) => setLevel(value as "Basic" | "Intermediate" | "Advanced")}>
                            <SelectTrigger className={`${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}>
                                <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent className={`${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}>
                                <SelectItem value="Basic">Basic</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator className="my-3" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Video Upload */}
                    <div>
                        <Label className={`${isDark ? "text-gray-200" : "text-black"}`}>Preview Video</Label>
                        <Input
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
                        />
                        {videoPreview && (
                            <video key={videoPreview} className="w-full mt-2 rounded-lg shadow-md" controls>
                                <source src={videoPreview} type="video/mp4" />
                            </video>
                        )}
                    </div>

                    {/* PDF Upload & Preview */}
                    <div>
                        <Label className={`${isDark ? "text-gray-200" : "text-black"}`}>Upload Notes (PDF)</Label>
                        <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setNotesFile(file);
                                    setNotesPreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                        {/* Show Original File URL if Available */}
                        {topic.notes_url && !notesFile && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">Current File: {topic.notes_url.split("/").pop()}</p>
                                <div className="mt-2 border border-gray-300 rounded-lg overflow-hidden shadow-md">
                                    <iframe
                                        src={`https://docs.google.com/gview?url=${encodeURIComponent(topic.notes_url)}&embedded=true`}
                                        className="w-full h-40"
                                        title="PDF Preview"
                                    />
                                </div>
                            </div>
                        )}
                        {/* Show New File Name & Preview */}
                        {notesFile && notesPreview && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">New File: {notesFile.name}</p>
                                <div className="mt-2 border border-gray-300 rounded-lg overflow-hidden shadow-md">
                                    <iframe
                                        src={notesPreview}
                                        className="w-full h-32"
                                        title="New PDF Preview"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!title.trim()}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditTopicModal;
