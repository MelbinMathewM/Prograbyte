import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2, FileText, PlayCircle, Video, IndianRupee, Gift } from "lucide-react";
import axiosInstance from "@/configs/axiosConfig";
import EditCourseModal from "./edit-course-modal";
import { toast } from "react-toastify";
import EditTopicModal from "./edit-topic-modal";
import { useTheme } from "@/contexts/theme-context";
import { CircularProgress } from "@mui/material";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Course, Topics, Topic, Category, IOffer } from "@/types/course";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Dialog } from "@headlessui/react";
import { createLiveSchedule } from "@/api/live";
import { fetchCourseDetail, fetchTopicsByCourse } from "@/api/course";
import { applyOfferToCourse, fetchOffers, removeOfferFromCourse } from "@/api/offer";
import { FaGift } from "react-icons/fa";
import BreadcrumbHeader from "./breadcrumb";

const TutorCourseDetailPart = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topics | null>(null);
  const [topic, setTopic] = useState<Topic[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedScheduleTopic, setSelectedScheduleTopic] = useState<Topic | null>(null);
  const [scheduleData, setScheduleData] = useState({ date: "", time: "", duration: "", description: "" });
  const [offers, setOffers] = useState<IOffer[]>([]);
  const [showOfferPanel, setShowOfferPanel] = useState(false);

  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark-theme";

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetchCourseDetail(id as string);
        console.log(response.course)
        setCourse(response.course);
      } catch (err) {
        console.error("Error fetching course details");
      }
    };
    fetchCourse();
  }, [id]);

  const refetchCourse = async () => {
    try {
      const response = await fetchCourseDetail(id as string);
      setCourse(response.course);
    } catch (err) {
      console.error("Error fetching course details");
    }
  };

  useEffect(() => {
    const fetchTopics = async () => {
      if (!course) return;
      try {
        const response = await fetchTopicsByCourse(course?._id);
        setTopics(response.topicList);
        setTopic(response.topicList.topics);
      } catch (err) {
        console.error("Error fetching topics");
      }
    };
    fetchTopics();
  }, [course]);

  useEffect(() => {
    const getOffers = async () => {
      try {
        const response = await fetchOffers();
        setOffers(response.offers);
      } catch (err: any) {
        console.log(err.error);
      }
    }
    getOffers();
  }, [])

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
      const response = await axiosInstance.delete(`/course/courses/${id}`);
      alert(response.data.message);
      navigate('/tutor/courses');
    } catch (err) {
      console.error("Error deleting course");
    }
  };

  const handleRemoveTopic = async (topicId: string) => {
    try {
      const response = await axiosInstance.delete(`/course/topics/${topics?._id}/${topicId}`)
      toast.success(response.data.message);
      setTopic((prevTopics) => prevTopics.filter((topic) => topic._id !== topicId));
    } catch (err: any) {
      toast.error(err.response.data.error)
    }
  }

  const openScheduleModal = (topic: any) => {
    setSelectedScheduleTopic(topic);
    setIsScheduleOpen(true);
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleData.date || !scheduleData.time || !scheduleData.duration || !scheduleData.description) {
      alert("Please fill in all fields.");
      return;
    }

    const scheduledDateTime = new Date(`${scheduleData.date}T${scheduleData.time}`);

    const liveData = {
      course_id: course?._id as string,
      topic_id: selectedScheduleTopic?._id as string,
      tutor_id: course?.tutor_id as string,
      title: selectedScheduleTopic?.title as string,
      description: scheduleData?.description,
      scheduled_date: scheduledDateTime,
      duration: parseInt(scheduleData.duration, 10),
      status: "scheduled" as const,
    };

    console.log("Scheduling live for:", liveData);
    try {
      const response = await createLiveSchedule(liveData);
      setIsScheduleOpen(false);
      toast.success(response.message);
      setScheduleData({ date: "", time: "", duration: "", description: "" });
    } catch (err: any) {
      toast.error(err.response.data.error);
    }

  };

  const handleApplyOffer = async (courseId: string, offerId: string) => {
    try {
      const response = await applyOfferToCourse(courseId, offerId);
      toast.success(response.message);
      refetchCourse();
    } catch (err: any) {
      toast.error(err.error);
    }
  };

  const handleRemoveOffer = async (courseId: string) => {
    try {
      const response = await removeOfferFromCourse(courseId);
      toast.success(response.message);
      refetchCourse();
    } catch (err: any) {
      toast.error(err.error);
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

  const handleSaveTopic = async (formData: FormData) => {
    const topicId = formData.get("topicId");
    try {
      console.log(...formData, 'll')
      const response = await axiosInstance.put(
        `/course/topics/${topics?._id}/${topicId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }
      );

      setTopic((prevTopics) =>
        prevTopics.map((topic) =>
          topic._id === topicId ? { ...topic, ...formData } : topic
        )
      );

      toast.success(response.data.message);
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
    <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Breadcrumb Navigation */}
      <BreadcrumbHeader
        paths={[
          { label: "Dashboard", href: "/tutor/dashboard" },
          { label: "Course", href: "/tutor/courses" },
          { label: "Course Details" }
        ]}
        title="Course Details"
      />


      {/* Course Info */}
      <Card className={`p-4 mb-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
        <p>{course.description}</p>
        <p className="font-bold pt-2">Category: {course?.category_id?.name}</p>

        {course.offer ? (
          <div className="mt-2 font-bold flex flex-wrap items-center gap-x-3 gap-y-1">
            {/* Discounted Price */}
            <div className="flex items-center gap-0 text-green-600 text-lg font-bold">
              <IndianRupee size={16} />
              <span>{Math.floor((course.price - (course.price * course.offer.discount) / 100))}</span>
            </div>

            {/* Original Price */}
            <div className="flex items-center gap-0 text-gray-500 line-through text-sm">
              <IndianRupee size={14} />
              <span>{course.price}</span>
            </div>


            {/* Discount Badge */}
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
              {course.offer.discount}% OFF
            </span>

            {/* Expiry Date */}
            <span className="text-xs text-gray-400 font-normal">
              Valid till {new Date(course.offer.expiryDate).toLocaleDateString()}
            </span>
          </div>
        ) : (
          <p className="mt-2 font-bold text-blue-600 text-lg flex items-center gap-0">
            Price: &nbsp;<IndianRupee size={16} /> {course.price}
          </p>
        )}


        <p className="mt-2">Approval Status: {course.approval_status}</p>

        <div className="flex gap-2 mt-4">
          <Button onClick={() => setIsEditModalOpen(true)} variant="default" className="flex items-center gap-2" disabled={isLoading}>
            {isLoading ? <CircularProgress size={16} color="inherit" /> : <Pencil size={16} />}
            {isLoading ? "Updating..." : "Edit Course"}
          </Button>
          <Button onClick={deleteCourse} variant="destructive" className="flex items-center gap-2">
            <Trash2 size={16} /> Delete Course
          </Button>
          <Button onClick={() => setShowOfferPanel(!showOfferPanel)} variant="success" className="flex items-center gap-2">
            <FaGift /> Offers
          </Button>
        </div>

        {showOfferPanel && (
          <div className={`mt-6 border rounded-sm p-5 shadow-sm transition-all duration-300 ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            <h3 className={`flex items-center gap-2 text-xl font-bold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>< Gift /> Available Offers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {offers.map((offer) => {
                const isApplied = course?.offer?._id === offer?._id;
                return (
                  <div
                    key={offer._id}
                    className={`flex flex-col justify-between p-4 rounded-sm shadow-sm border transition-all duration-200 hover:shadow-md ${isDarkMode ? "bg-gray-850 border-gray-700" : "bg-white border-gray-200"
                      }`}
                  >
                    <div>
                      <p className={`font-semibold text-lg ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{offer.title}</p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{offer.description}</p>
                      <p className={`text-sm font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}>{offer.discount}% OFF</p>
                    </div>
                    <div className="mt-4 text-right">
                      {isApplied ? (
                        <Button
                          variant="destructive"
                          className="text-sm px-4 py-2 w-full"
                          onClick={() => handleRemoveOffer(course._id)}
                        >
                          Remove Offer
                        </Button>
                      ) : (
                        <Button
                          className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 w-full"
                          onClick={() => handleApplyOffer(course._id, offer._id)}
                        >
                          Apply Offer
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


      </Card>

      {course.preview_video_urls && course.poster_url && (
        <Card className={`p-4 mb-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
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
      <Card className={`p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Topics</h3>
          <Button onClick={() => navigate(`/tutor/courses/${course._id}/add-topic`)}>Add Topic</Button>
        </div>
        <Table>
          <TableHeader className={` ${isDarkMode ? "hover:bg-gray-950" : "hover:bg-gray-200"}`}>
            <TableRow>
              <TableHead className={` ${isDarkMode ? "text-white" : "text-gray-800"} font-semibold`}>Title</TableHead>
              <TableHead className={` ${isDarkMode ? "text-white" : "text-gray-800"} font-semibold`}>Level</TableHead>
              <TableHead className={` ${isDarkMode ? "text-white" : "text-gray-800"} font-semibold`}>Video</TableHead>
              <TableHead className={` ${isDarkMode ? "text-white" : "text-gray-800"} font-semibold`}>Notes</TableHead>
              <TableHead className={` ${isDarkMode ? "text-white" : "text-gray-800"} text-center font-semibold`}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(categorizedTopics).map(([_, topics]) =>
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
                    <button className="text-red-500 flex items-center gap-1 cursor-pointer" onClick={() => {
                      setSelectedTopicId(topic._id);
                      setIsConfirmOpen(true);
                    }}>
                      <Trash2 size={16} /> Delete
                    </button>
                    <button onClick={() => openScheduleModal(topic)} className="text-blue-600 flex items-center gap-1 cursor-pointer">
                      <Video size={16} /> Schedule Live
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {isEditModalOpen && (
        <EditCourseModal
          open={true}
          course={course}
          categories={categories}
          onClose={() => setIsEditModalOpen(false)}
          onSave={saveCourseChanges}
          isDark={isDarkMode}
        />
      )}

      {selectedTopic && (
        <EditTopicModal
          topic={selectedTopic}
          onClose={handleCloseModal}
          onSave={handleSaveTopic}
          isDark={isDarkMode}
        />
      )}

      {isScheduleOpen && (
        <Dialog open={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Panel className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-lg w-full max-w-md p-6 space-y-4`}>
              <Dialog.Title className="text-xl font-bold">Schedule Live Class</Dialog.Title>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    className={`w-full rounded p-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border'}`}
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Time</label>
                  <input
                    type="time"
                    className={`w-full rounded p-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border'}`}
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Duration (minutes)</label>
                  <input
                    type="number"
                    className={`w-full rounded p-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border'}`}
                    placeholder="60"
                    value={scheduleData.duration}
                    onChange={(e) => setScheduleData({ ...scheduleData, duration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    className={`w-full rounded p-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border'}`}
                    placeholder="Enter live class details..."
                    value={scheduleData.description}
                    onChange={(e) => setScheduleData({ ...scheduleData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button onClick={() => setIsScheduleOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={handleScheduleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Schedule</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (selectedTopicId) handleRemoveTopic(selectedTopicId);
          setIsConfirmOpen(false);
        }}
        title="Confirm Deletion"
        message="Are you sure you want to remove this topic?"
        confirmText="Remove"
        cancelText="Cancel"
        isDark={isDarkMode}
      />
    </Card>
  );
};

export default TutorCourseDetailPart;