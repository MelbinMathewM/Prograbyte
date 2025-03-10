import { FormEvent, useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Grid,
  Paper,
  Container,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useTheme } from "../../contexts/theme-context";
import { ChevronRight } from "lucide-react";
import axiosInstance from "../../axios/axiosConfig";
import { toast } from "react-toastify";

interface Topic {
  course_id: string;
  title: string;
  level: string;
  video: File | null;
  notes: File | null;
  createdAt: dayjs.Dayjs;
  videoPreview?: string | null;
}

const AddTopicPart = () => {
  const { theme } = useTheme();
  const isDarkMode = theme.includes("dark");
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const [topics, setTopics] = useState<Topic[]>([
    { title: "", level: "Basic", course_id: courseId ?? "", video: null, notes: null, createdAt: dayjs(), videoPreview: null },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTopicChange = (index: number, field: keyof Topic, value: any) => {
    setTopics((prev) =>
      prev.map((topic, i) => (i === index ? { ...topic, [field]: value } : topic))
    );
  };

  const handleTopicFileUpload = (index: number, field: "video" | "notes", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setTopics((prev) =>
      prev.map((topic, i) =>
        i === index
          ? {
              ...topic,
              [field]: file,
              ...(field === "video" ? { videoPreview: file ? URL.createObjectURL(file) : null } : {}),
            }
          : topic
      )
    );
  };

  const removeFile = (index: number, field: "video" | "notes") => {
    setTopics((prev) =>
      prev.map((topic, i) =>
        i === index ? { ...topic, [field]: null, ...(field === "video" ? { videoPreview: null } : {}) } : topic
      )
    );
  };

  const addTopic = () => {
    setTopics([...topics, { title: "", level: "Basic", course_id: courseId ?? "", video: null, notes: null, createdAt: dayjs(), videoPreview: null }]);
  };

  const validateTopics = (topics: Topic[]): boolean => {
    const hasError = topics.some((topic, index) => {
      if (!topic.title.trim()) {
        toast.error(`Topic ${index + 1} must have a title.`);
        return true;
      }
      if (!topic.level.trim()) {
        toast.error(`Topic ${index + 1} must have a level.`);
        return true;
      }
      if (!topic.video) {
        toast.error(`Topic ${index + 1} must have a video.`);
        return true;
      }
      if (topic.video && !(topic.video instanceof File)) {
        toast.error(`Invalid video file for Topic ${index + 1}.`);
        return true;
      }
      if (topic.notes && !(topic.notes instanceof File)) {
        toast.error(`Invalid notes file for Topic ${index + 1}.`);
        return true;
      }
      if (topic.video && topic.video.type !== "video/mp4") {
        toast.error(`Video for Topic ${index + 1} must be an MP4 file.`);
        return true;
      }
      if (topic.notes && topic.notes.type !== "application/pdf") {
        toast.error(`Notes for Topic ${index + 1} must be a PDF file.`);
        return true;
      }
      return false;
    });
  
    return !hasError;
  };
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateTopics(topics)) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("course_id", courseId as string);

      topics.forEach((topic, index) => {
        formData.append(`topics[${index}][title]`, topic.title);
        formData.append(`topics[${index}][level]`, topic.level);
        if (topic.video) formData.append(`topics[${index}][video]`, topic.video);
        if (topic.notes) formData.append(`topics[${index}][notes]`, topic.notes);
      });

      await axiosInstance.post("/course/topics",formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

        toast.success("Topics created successfully!");
        setIsLoading(false);
        setTimeout(() => navigate("/tutor/courses"), 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
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
            <span>Add Topic</span>
          </nav>

          {/* Header with Back Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ color: isDarkMode ? "#fff" : "#000" }}
            >
              Add Topics
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(-1)}
              sx={{
                backgroundColor: isDarkMode ? "#444" : "#3b82f6",
                "&:hover": { backgroundColor: isDarkMode ? "#555" : "#2563eb" },
              }}
            >
              Back
            </Button>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {topics.map((topic, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      border: "2px solid",
                      borderColor: isDarkMode ? "#444" : "#ccc",
                      backgroundColor: isDarkMode ? "transparent" : "#fff",
                      padding: "16px",
                      borderRadius: "8px",
                    }}
                  >
                    <Grid container spacing={2}>
                      {/* Topic Title */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Topic Title"
                          value={topic.title}
                          onChange={(e) =>
                            handleTopicChange(index, "title", e.target.value)
                          }
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

                      {/* Difficulty Level */}
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ color: isDarkMode ? "#ccc" : "#000" }}>
                            Difficulty Level *
                          </InputLabel>
                          <Select
                            value={topic.level}
                            label="Difficulty Level"
                            onChange={(e) =>
                              handleTopicChange(index, "level", e.target.value)
                            }
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
                            <MenuItem value="Basic">Basic</MenuItem>
                            <MenuItem value="Intermediate">Intermediate</MenuItem>
                            <MenuItem value="Advanced">Advanced</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Video Upload */}
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="contained"
                          component="label"
                          fullWidth
                          sx={{
                            backgroundColor: isDarkMode ? "#444" : "#1976d2",
                            color: isDarkMode ? "#fff" : "#fff",
                            "&:hover": { backgroundColor: isDarkMode ? "#555" : "#1565c0" },
                          }}
                        >
                          Upload Video
                          <input
                            type="file"
                            hidden
                            onChange={(e) =>
                              handleTopicFileUpload(index, "video", e)
                            }
                            accept="video/*"
                          />
                        </Button>
                        {topic.videoPreview && (
                          <Box mt={2} display="flex" alignItems="center">
                            <video width="100%" controls>
                              <source src={topic.videoPreview} type="video/mp4" />
                            </video>
                            <IconButton
                              onClick={() => removeFile(index, "video")}
                              sx={{ color: isDarkMode ? "#fff" : "#000" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Grid>

                      {/* Notes Upload */}
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="contained"
                          component="label"
                          fullWidth
                          sx={{
                            backgroundColor: isDarkMode ? "#444" : "#1976d2",
                            color: isDarkMode ? "#fff" : "#fff",
                            "&:hover": { backgroundColor: isDarkMode ? "#555" : "#1565c0" },
                          }}
                        >
                          Upload Notes
                          <input
                            type="file"
                            hidden
                            onChange={(e) =>
                              handleTopicFileUpload(index, "notes", e)
                            }
                            accept=".pdf"
                          />
                        </Button>
                        {topic.notes && (
                          <Box mt={1} display="flex" alignItems="center">
                            <Typography
                              sx={{
                                color: isDarkMode ? "#ccc" : "#000",
                                marginRight: "8px",
                              }}
                            >
                              {topic.notes.name}
                            </Typography>
                            <IconButton
                              onClick={() => removeFile(index, "notes")}
                              sx={{ color: isDarkMode ? "#fff" : "#000" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              ))}

              {/* Add Topic Button */}
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  onClick={addTopic}
                  sx={{
                    backgroundColor: isDarkMode ? "#444" : "#1976d2",
                    color: isDarkMode ? "#fff" : "#fff",
                    width: "100%",
                    "&:hover": { backgroundColor: isDarkMode ? "#555" : "#1565c0" },
                  }}
                >
                  Add Topic
                </Button>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="contained"
                  color="success"
                  fullWidth
                >
                  Submit Topics
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Container>
  );

};

export default AddTopicPart;
