import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, ChevronRight, FileText, PlayCircle, ChevronLeft } from "lucide-react";
import axiosInstance from "../../axios/axiosConfig";
import EditCourseModal from "./edit-course-modal";
import { toast } from "react-toastify";
import EditTopicModal from "./edit-topic-modal";
import { useTheme } from "../../contexts/theme-context";
import { CircularProgress } from "@mui/material";
import { Card } from "../ui/card";
import Button from "../ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface Topics {
  _id: string;
  course_id: string;
  topics: Topic[];
}

interface Topic {
  _id: string;
  title: string;
  level: "Basic" | "Intermediate" | "Advanced";
  video_url: string;
  notes_url: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category_id: { _id: string, name: string };
  price: number;
  rating: number | null;
  preview_video_urls: [string];
  poster_url: string;
  approval_status: "Pending" | "Approved" | "Rejected";
}

interface Category {
  _id: string,
  name: string,
  type: string
}

const TutorCourseDetailPart = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topics | null>(null);
  const [topic, setTopic] = useState<Topic[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState<Partial<Course>>({ ...course });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme.includes("dark");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/course/courses/${id}`);
        setCourse(response.data);
        setUpdatedCourse(response.data);
      } catch (err) {
        console.error("Error fetching course details");
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (!course) return;
      try {
        const response = await axiosInstance.get(`/course/topics/${course._id}`);
        setTopics(response.data);
        setTopic(response.data.topics);
      } catch (err) {
        console.error("Error fetching topics");
      }
    };
    fetchTopics();
  }, [course]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axiosInstance.get('/course/categories');
      setCategories(response.data);
    }
    fetchCategories();
  }, []);

  const deleteCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axiosInstance.delete(`/course/${id}`);
      alert("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course");
    }
  };

  const validateCourse = (course: Partial<Course>, files: { poster?: File; video?: File }): boolean => {
    if (!course.title?.trim()) {
      toast.error("Course title is required.");
      return false;
    }
    if (!course.description?.trim()) {
      toast.error("Course description is required.");
      return false;
    }
    if (!course.category_id?._id) {
      toast.error("Please select a category.");
      return false;
    }
    if (course.price === undefined || isNaN(course.price) || course.price < 0) {
      toast.error("Price must be a valid positive number.");
      return false;
    }

    // ✅ Validate file types (if uploaded)
    if (files.poster && !["image/jpeg", "image/png"].includes(files.poster.type)) {
      toast.error("Only JPEG or PNG images are allowed for the poster.");
      return false;
    }
    if (files.video && !["video/mp4", "video/webm"].includes(files.video.type)) {
      toast.error("Only MP4 or WebM videos are allowed for the preview.");
      return false;
    }

    return true;
  };


  const saveCourseChanges = async (updatedCourse: Partial<Course>, files: { poster?: File; video?: File }) => {
    try {
      if (!validateCourse(updatedCourse, files)) return;
      setIsLoading(true);
      const formData = new FormData();

      // Append only updated fields
      if (updatedCourse.title) formData.append("title", updatedCourse.title);
      if (updatedCourse.description) formData.append("description", updatedCourse.description);
      if (updatedCourse.category_id) formData.append("category_id", updatedCourse.category_id._id);
      if (updatedCourse.price !== undefined) formData.append("price", String(updatedCourse.price));

      // Append files
      if (files.poster) formData.append("poster", files.poster);
      if (files.video) formData.append("preview_video", files.video);

      await axiosInstance.put(`/course/courses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCourse((prev) => ({ ...prev!, ...updatedCourse }));
      toast.success("Course updated successfully")
      setIsEditModalOpen(false);
      setIsLoading(false);
    } catch (error: any) {
      if (error.response) {
        const backendMessage = error.response.data.error || "An error occurred";
        toast.error(backendMessage);
      } else if (error.request) {
        toast.error("Server is not responding. Please try again later.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleEditClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleCloseModal = () => {
    setSelectedTopic(null);
  };

  const handleSaveTopic = async (updatedTopic: Partial<Topic>) => {
    try {

      const filteredTopic: Partial<Topic> = Object.fromEntries(
        Object.entries(updatedTopic).filter(([_, v]) => v !== undefined)
      );

      const response = await axiosInstance.put(
        `/course/topics/${updatedTopic._id}`,
        filteredTopic
      );

      setTopic((prevTopics) =>
        prevTopics.map((topic) =>
          topic._id === updatedTopic._id ? { ...topic, ...updatedTopic } : topic
        )
      );

      toast.success("Topic updated successfully");
      handleCloseModal();
    } catch (error: any) {
      if (error.response) {
        const backendMessage = error.response.data.error || "An error occurred";
        toast.error(backendMessage);
      } else if (error.request) {
        toast.error("Server is not responding. Please try again later.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  if (!course) return <p>Loading...</p>;

  const categorizedTopics = topic.reduce((acc, topic) => {
    if (!acc[topic.level]) acc[topic.level] = [];
    acc[topic.level].push(topic);
    return acc;
  }, {} as Record<string, Topic[]>);

  return (
    <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Breadcrumb Navigation */}
      <nav className="mb-4 text-sm flex items-center text-gray-500">
        <Link to="/tutor/dashboard" className="hover:text-blue-500">Dashboard</Link>
        <ChevronRight size={16} />
        <Link to="/tutor/courses" className="hover:text-blue-500">My Courses</Link>
        <ChevronRight size={16} />
        <span>{course.title}</span>
      </nav>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{course.title}</h2>
        <Link to="/tutor/courses" className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <ChevronLeft className="mt-1" size={18} /> Back
        </Link>
      </div>

      {/* Course Info */}
      <Card className="p-4 mb-4">
        <p className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-600'}`}>{course.description}</p>
        <p className={`font-bold pt-2 ${isDarkMode ? 'bg-gray-900text-white' : 'bg-white text-gray-600'}`}>Category: {course.category_id.name}</p>
        <p className="mt-2 font-bold">Price: <span className="text-blue-600">${course.price}</span></p>
        <p className="mt-2">Approval Status: {course.approval_status}</p>

        <div className="flex gap-2 mt-4">
          <Button onClick={() => setIsEditModalOpen(true)} variant="default" className="flex items-center gap-2" disabled={isLoading}>
            {isLoading ? <CircularProgress size={16} color="inherit" /> : <Pencil size={16} />}
            {isLoading ? "Updating..." : "Edit Course"}
          </Button>
          <Button onClick={deleteCourse} variant="destructive" className="flex items-center gap-2">
            <Trash2 size={16} /> Delete Course
          </Button>
        </div>
      </Card>

      {course.preview_video_urls && course.poster_url && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Poster Image */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Poster Image</h3>
              <img
                src={course.poster_url}
                alt="Course Poster"
                className="w-full rounded-lg shadow-md"
              />
            </div>

            {/* Preview Video */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Preview Video</h3>
              <video className="w-full rounded-lg shadow-md" controls>
                <source src={course.preview_video_urls?.[0]} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </Card>
      )}

      {/* Topics Table */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold mb-4">Topics</h3>
          <Button onClick={() => navigate(`/tutor/courses/${course._id}/add-topic`)}>Add Topic</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="items-center flex justify-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(categorizedTopics).map(([level, topics]) => (
              topics.map((topic) => (
                <TableRow key={topic._id}>
                  <TableCell>{topic.title}</TableCell>
                  <TableCell>{topic.level}</TableCell>
                  <TableCell>
                    {topic.video_url && (
                      <a href={topic.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 flex items-center gap-1">
                        <PlayCircle size={16} /> Video
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {topic.notes_url && (
                      <a href={topic.notes_url} target="_blank" rel="noopener noreferrer" className="text-green-500 flex items-center gap-1">
                        <FileText size={16} /> Notes
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-5 justify-center">
                    <button onClick={() => handleEditClick(topic)} className="text-purple-500 flex items-center gap-1 cursor-pointer">
                      <Pencil size={16} /> Edit
                    </button>
                    <button className="text-red-500 flex items-center gap-1 cursor-pointer">
                      <Trash2 size={16} /> Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </Card>
      {isEditModalOpen && (
        <EditCourseModal open={true} course={course} categories={categories} onClose={() => setIsEditModalOpen(false)} onSave={saveCourseChanges} isDark={isDarkMode} />
      )}

      {selectedTopic && (
        <EditTopicModal
          topic={selectedTopic}
          onClose={handleCloseModal}
          onSave={() => handleSaveTopic}
          isDark={isDarkMode}
        />
      )}
    </Card>
  );
};

export default TutorCourseDetailPart;