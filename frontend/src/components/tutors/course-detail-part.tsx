import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, ChevronRight, Star, X, FileText, PlayCircle, ChevronLeft } from "lucide-react";
import axiosInstance from "../../axios/axiosConfig";
import EditCourseModal from "./edit-course-modal";
import { toast } from "react-toastify";
import EditTopicModal from "./edit-topic-modal";
import { useTheme } from "../../contexts/theme-context";
import { Box, Paper, Typography, Button, Grid, CircularProgress } from "@mui/material";

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
  preview_video_url: string;
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
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState<Partial<Course>>({ ...course });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {theme} = useTheme();
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
      const response = await axiosInstance.put(
        `/course/topics/${updatedTopic._id}`,
        updatedTopic
      );

      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic._id === updatedTopic._id ? { ...topic, ...updatedTopic } : topic
        )
      );

      toast.success("Topic updated successfully");
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to update topic");
    }
  };

  if (!course) return <p>Loading...</p>;

  const categorizedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.level]) acc[topic.level] = [];
    acc[topic.level].push(topic);
    return acc;
  }, {} as Record<string, Topic[]>);

  return (
    <Box
        className="p-6"
        sx={{
            backgroundColor: isDarkMode ? 'background.default' : 'background.paper',
            color: isDarkMode ? 'text.primary' : 'text.secondary',
        }}
    >
        <nav className="mb-4 text-sm flex items-center" style={{ color: isDarkMode ? '#ccc' : '#666' }}>
            <Link to="/tutor/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <ChevronRight size={16} />
            <Link to="/tutor/courses" className="hover:text-blue-400">My Courses</Link>
            <ChevronRight size={16} />
            <span>{course.title}</span>
        </nav>

        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
            <Typography variant="h4" component="h2">{course.title}</Typography>
            <Link to="/tutor/courses" className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                <ChevronLeft className="mt-1" size={18} />
                Back
            </Link>
        </div>

        <Paper
            elevation={3}
            sx={{
                padding: 2,
                marginBottom: 4,
                backgroundColor: isDarkMode ? 'background.paper' : 'background.default',
                color: isDarkMode ? 'text.primary' : 'text.secondary',
            }}
        >
            <Typography variant="body1">{course.description}</Typography>
            <Typography variant="body2">Category: {course.category_id.name}</Typography>
            <Typography variant="body1" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                Price: <span className="text-blue-500">${course.price}</span>
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>Approval Status: {course.approval_status}</Typography>
            <Button onClick={() => navigate(`/tutor/courses/${course._id}/add-topic`)}>Add Topic</Button>

            <div className="flex gap-2 mt-4">
                <Button
                    onClick={() => setIsEditModalOpen(true)}
                    variant="contained"
                    sx={{ backgroundColor: isDarkMode ? '#1976d2' : 'primary.main', color: 'white' }}
                    startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <Pencil size={16} />}
                    disabled={isLoading}
                >
                    {isLoading ? "Updating..." : "Edit Course"}
                </Button>

                <Button
                    onClick={deleteCourse}
                    variant="contained"
                    sx={{ backgroundColor: isDarkMode ? '#d32f2f' : 'secondary.main', color: 'white' }}
                    startIcon={<Trash2 size={16} />}
                >
                    Delete Course
                </Button>
            </div>
        </Paper>

        {course.preview_video_url && course.poster_url && (
            <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Poster Image</Typography>
                    <img
                        src={course.poster_url}
                        alt="poster"
                        className="w-full rounded-lg border"
                        style={{ borderColor: isDarkMode ? '#444' : '#ccc' }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Preview Video</Typography>
                    <video className="w-full rounded-lg" controls>
                        <source src={course.preview_video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </Grid>
            </Grid>
        )}

        <Paper
            elevation={3}
            sx={{ padding: 2, backgroundColor: isDarkMode ? 'background.paper' : 'background.default', color: isDarkMode ? 'text.primary' : 'text.secondary' }}
        >
            <Typography variant="h5" component="h3" sx={{ marginBottom: 2 }}>Topics</Typography>
            {Object.entries(categorizedTopics).map(([level, topics]) => (
                <div key={level} className="mb-4">
                    <Typography variant="h6" component="h4">{level}</Typography>
                    <ul>
                        {topics.map((topic) => (
                            <li
                                key={topic._id}
                                className="p-2 border-b flex justify-between items-center"
                                style={{ borderColor: isDarkMode ? '#444' : '#ccc' }}
                            >
                                <div className="grid grid-cols sm:grid-cols-3 gap-2">
                                    <Typography variant="body1" className="font-semibold flex-1 text-center pe-3">{topic.title}</Typography>
                                    {topic.video_url && (
                                        <a href={topic.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 flex items-center">
                                            <PlayCircle size={16} className="mr-1" /> Video
                                        </a>
                                    )}
                                    {topic.notes_url && (
                                        <a href={topic.notes_url} target="_blank" rel="noopener noreferrer" className="text-green-500 flex items-center">
                                            <FileText size={16} className="mr-1" /> Notes
                                        </a>
                                    )}
                                </div>
                                <div className="grid grid-cols sm:grid-cols-2 gap-2">
                                    <Button onClick={() => handleEditClick(topic)} variant="contained" color="primary" startIcon={<Pencil size={16} />}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="secondary" startIcon={<Trash2 size={16} />}>
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </Paper>

        {isEditModalOpen && (
            <EditCourseModal open={true} course={course} categories={categories} onClose={() => setIsEditModalOpen(false)} onSave={saveCourseChanges} isDark={isDarkMode} />
        )}

{selectedTopic && (
        <EditTopicModal
          topic={selectedTopic}
          onClose={handleCloseModal}
          onSave={() => handleSaveTopic}
        />
      )}
    </Box>
);
};

export default TutorCourseDetailPart;