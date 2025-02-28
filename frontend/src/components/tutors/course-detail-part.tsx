import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Pencil, Trash2, ChevronRight, Star, X, FileText, PlayCircle, ChevronLeft } from "lucide-react";
import axiosInstance from "../../axios/axiosConfig";
import EditCourseModal from "./edit-course-modal";
import { toast } from "react-toastify";
import EditTopicModal from "./edit-topic-modal";

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

  const saveCourseChanges = async (updatedCourse: Partial<Course>,  files: { poster?: File; video?: File }) => {
    try {
      const formData = new FormData();

      // Append only updated fields
      if (updatedCourse.title) formData.append("title", updatedCourse.title);
      if (updatedCourse.description) formData.append("description", updatedCourse.description);
      if (updatedCourse.category_id) formData.append("category_id", updatedCourse.category_id._id);
      if (updatedCourse.price !== undefined) formData.append("price", String(updatedCourse.price));

      // Append files
      if (files.poster) formData.append("poster", files.poster);
      if (files.video) formData.append("preview_video", files.video);
      
      await axiosInstance.put(`/course/courses/${id}`, formData,{
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCourse((prev) => ({ ...prev!, ...updatedCourse }));
      toast.success("Course updated successfully")
      setIsEditModalOpen(false);
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
    <div className="p-6">
      <nav className="mb-4 text-sm text-gray-500 flex items-center">
        <Link to="/tutor/dashboard" className="hover:text-blue-500">Dashboard</Link>
        <ChevronRight size={16} />
        <Link to="/tutor/courses" className="hover:text-blue-500">My Courses</Link>
        <ChevronRight size={16} />
        <span className="text-gray-700">{course.title}</span>
      </nav>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <Link to="/admin/categories" className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <ChevronLeft className="mt-1" size={18} />
          Back
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="text-gray-600">{course.description}</p>
        <p className="text-gray-400">Category: {course.category_id.name}</p>
        <p className="mt-2 font-semibold">Price: <span className="text-blue-600">${course.price}</span></p>
        <p className="mt-2">Approval Status: {course.approval_status}</p>

        <div className="flex gap-2 mt-4">
          <button onClick={() => setIsEditModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Pencil size={16} className="mr-1" /> Edit Course
          </button>
          <button onClick={deleteCourse} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center">
            <Trash2 size={16} className="mr-1" /> Delete Course
          </button>
        </div>
      </div>

      {course.preview_video_url && course.poster_url && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Poster Image</h3>
            <img src={course.poster_url} alt="poster" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Preview Video</h3>
            <video className="w-full rounded-lg" controls>
              <source src={course.preview_video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">Topics</h3>
        {Object.entries(categorizedTopics).map(([level, topics]) => (
          <div key={level} className="mb-4">
            <h4 className="text-xl font-bold text-gray-700">{level}</h4>
            <ul>
              {topics.map((topic) => (
                <li key={topic._id} className="p-2 border-b flex justify-between items-center">
                  <div className="grid grid-cols sm:grid-cols-3 gap-2">
                    <span className="font-semibold flex-1 text-center pe-3">{topic.title}</span>
                    {topic.video_url && (
                      <a
                        href={topic.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 flex items-center"
                      >
                        <PlayCircle size={16} className="mr-1" /> Video
                      </a>
                    )}
                    {topic.notes_url && (
                      <a
                        href={topic.notes_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 flex items-center"
                      >
                        <FileText size={16} className="mr-1" /> Notes
                      </a>
                    )}
                  </div>
                  <div className="grid grid-cols sm:grid-cols-2 gap-2">
                    <button onClick={() => handleEditClick(topic)} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center">
                      <Pencil size={16} className="mr-1" /> Edit
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center">
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <EditCourseModal course={course} categories={categories} onClose={() => setIsEditModalOpen(false)} onSave={saveCourseChanges} />
      )}

      {selectedTopic && (
        <EditTopicModal
          topic={selectedTopic}
          onClose={handleCloseModal}
          onSave={() => handleSaveTopic}
        />
      )}
    </div>
  );
};

export default TutorCourseDetailPart;
