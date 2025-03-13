import { useState, useEffect, useContext, ChangeEvent, FormEvent, useCallback } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import { TutorContext } from "../../contexts/tutor-context";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosConfig";
import { useTheme } from "../../contexts/theme-context";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CropImageModal from "../ui/crop-image-modal";
import { getCroppedPosterImage } from "../../libs/courseImageCropper";

interface Category {
  _id: string;
  name: string;
}

interface Course {
  title: string;
  description: string;
  category_id: string;
  tutor_id: string;
  price: string;
  poster: File | null;
  preview_video: File | null;
  createdAt: dayjs.Dayjs;
}

interface CroppedArea {
  width: number;
  height: number;
  x: number;
  y: number;
}

const AddCoursePart = () => {
  const { tutor } = useContext(TutorContext) || {};
  const { id: tutorId } = tutor || {};
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme.includes("dark");

  const [course, setCourse] = useState<Course>({
    title: "",
    description: "",
    category_id: "",
    tutor_id: tutorId || "",
    price: "",
    poster: null,
    preview_video: null,
    createdAt: dayjs(),
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get<Category[]>("/course/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setCourse((prev) => ({ ...prev, [name as keyof Course]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourse((prev) => ({ ...prev, preview_video: file }));
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handlePosterUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setModalOpen(true);
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedPosterImage(imageSrc, croppedAreaPixels);
      console.log(croppedBlob,'hswhwi')
      if(!croppedBlob) return;

      const croppedFile = new File([croppedBlob], "cropped_poster.jpg", { type: "image/jpeg" });
      setPosterPreview(URL.createObjectURL(croppedFile));
      setCourse((prev) => ({ ...prev, poster: croppedFile }));
      setModalOpen(false);
    } catch (error) {
      setModalOpen(false);
    }
  };

  const removeVideo = () => {
    setCourse((prev) => ({ ...prev, preview_video: null }));
    setVideoPreview(null);
  };

  const removePoster = () => {
    setCourse((prev) => ({ ...prev, poster: null }));
    setPosterPreview(null);
  };

  const validateCourse = (course: Course): boolean => {
    if (!course.title.trim() || !course.description.trim() || !course.category_id || !course.price.trim()) {
      toast.error("Please fill in all required fields.");
      return false;
    }

    const priceNumber = Number(course.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast.error("Price must be a valid positive number.");
      return false;
    }

    if (!course.poster) {
      toast.error("Poster image is required.");
      return false;
    }

    if (course.poster) {
      const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedImageTypes.includes(course.poster.type)) {
        toast.error("Invalid poster format. Please upload a PNG, JPG, or JPEG image.");
        return false;
      }
    }

    if (!course.preview_video) {
      toast.error("At least one of Preview Video is required.");
      return false;
    }

    if (course.preview_video) {
      const allowedVideoTypes = ["video/mp4", "video/webm"];
      if (!allowedVideoTypes.includes(course.preview_video.type)) {
        toast.error("Invalid video format. Please upload an MP4 or WEBM file.");
        return false;
      }
    }

    return true;
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCourse((prev) => ({ ...prev, tutor_id: tutorId ?? "" }));

    if (!validateCourse(course)) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(course).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value as Blob | string);
        }
      });
      formData.append("tutor_id", tutorId ?? "");

      const response = await axiosInstance.post("/course/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data._id) {
        toast.success("Course created successfully!");
        setIsLoading(false);
        setTimeout(() => {
          navigate(`/tutor/courses/${response.data._id}/add-topic`);
        }, 1000);
      }
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

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          backgroundColor: isDarkMode ? "#1e1e1e" : "#f9fafb",
          color: isDarkMode ? "#fff" : "#000",
        }}
      >
        <Box sx={{ padding: "20px" }}>
          {/* Breadcrumb Navigation */}
          <nav
            className="mb-4 text-sm flex items-center"
            style={{ color: isDarkMode ? "#bbb" : "#666" }}
          >
            <Link to="/tutor/dashboard" className="hover:text-blue-500">
              Dashboard
            </Link>
            <ChevronRight size={16} />
            <Link to="/tutor/courses" className="hover:text-blue-500">
              My Courses
            </Link>
            <ChevronRight size={16} />
            <span>Add Course</span>
          </nav>

          {/* Title & Back Button */}
          <div className="flex justify-between items-center mb-4">
            <Typography
              variant="h4"
              component="h4"
              sx={{ color: isDarkMode ? "#fff" : "#000" }}
            >
              Add Course
            </Typography>

            <Link
              to="/tutor/courses"
              className={`flex px-4 py-2 rounded-md transition-colors ${isDarkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              <ChevronLeft className="mt-1" size={18} />
              Back
            </Link>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Title"
                  name="title"
                  value={course.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    input: { color: isDarkMode ? "#fff" : "#000" },
                    label: { color: isDarkMode ? "#bbb" : "#000" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: isDarkMode ? "#666" : "#ccc" },
                      "&:hover fieldset": { borderColor: isDarkMode ? "#888" : "#888" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={course.price}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    input: { color: isDarkMode ? "#fff" : "#000" },
                    label: { color: isDarkMode ? "#bbb" : "#000" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: isDarkMode ? "#666" : "#ccc" },
                      "&:hover fieldset": { borderColor: isDarkMode ? "#888" : "#888" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  label="Description"
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  fullWidth
                  required
                  sx={{
                    input: { color: isDarkMode ? "#fff" : "#000" },
                    label: { color: isDarkMode ? "#bbb" : "#000" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: isDarkMode ? "#666" : "#ccc" },
                      "&:hover fieldset": { borderColor: isDarkMode ? "#888" : "#888" },
                    },
                  }}
                />
              </Grid>

              {/* Category Selection */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: isDarkMode ? "#bbb" : "#000" }}>
                    Category *
                  </InputLabel>
                  <Select
                    name="category_id"
                    label="Category"
                    value={course.category_id}
                    onChange={handleSelectChange}
                    required
                    sx={{
                      color: isDarkMode ? "#fff" : "#000",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: isDarkMode ? "#666" : "#ccc",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: isDarkMode ? "#888" : "#888",
                      },
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* File Upload Section */}
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    backgroundColor: isDarkMode ? "#444" : "#1976d2",
                    color: isDarkMode ? "#fff" : "#fff",
                    "&:hover": { backgroundColor: isDarkMode ? "#555" : "#1565c0" },
                  }}
                >
                  Upload Poster Image
                  <input type="file" hidden onChange={handlePosterUpload} accept="image/*" />
                </Button>
                {posterPreview && (
                  <Box mt={2}>
                    <img src={posterPreview} alt="Course Poster" width="200px" />
                    <IconButton onClick={removePoster} sx={{ color: isDarkMode ? "#ddd" : "#000" }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              <CropImageModal 
                modalOpen={modalOpen} 
                setModalOpen={setModalOpen} 
                imageSrc={imageSrc} 
                crop={crop} 
                setCrop={setCrop} 
                zoom={zoom} 
                setZoom={setZoom} 
                onCropComplete={onCropComplete} 
                getCroppedImage={handleCroppedImage} 
                isDark={isDarkMode} 
                aspectRatio={window.innerWidth / window.innerHeight}
              />

              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    backgroundColor: isDarkMode ? "#444" : "#1976d2",
                    color: isDarkMode ? "#fff" : "#fff",
                    "&:hover": { backgroundColor: isDarkMode ? "#555" : "#1565c0" },
                  }}
                >
                  Upload Preview Video
                  <input type="file" hidden onChange={handleFileUpload} accept="video/*" />
                </Button>
                {videoPreview && (
                  <Box mt={2}>
                    <video src={videoPreview} width="200px" controls />
                    <IconButton onClick={removeVideo} sx={{ color: isDarkMode ? "#ddd" : "#000" }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    backgroundColor: isDarkMode ? "#2e7d32" : "#4caf50",
                    color: isDarkMode ? "#fff" : "#fff",
                    "&:hover": { backgroundColor: isDarkMode ? "#388e3c" : "#388e3c" },
                  }}
                >
                  Add Course
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddCoursePart;
