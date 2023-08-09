import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { getSignature } from "@app/cloudinary";
import axios from "axios";
import { baseUrl } from "@utils/baseUrl";
import { useParams } from "next/navigation";
import { AuthContext } from "./authProvider";
import { useContext } from "react";
import { useRouter } from "next/navigation";

const ProfileModal = ({
  showModal,
  setShowModal,
  setEdit,
  profileDetails,
  edit,
  setFetch,
  fetch,
}) => {
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(profileDetails.image);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const { authenticateUser } = useContext(AuthContext);

  const router = useRouter();

  const params = useParams();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "#191b1f",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    color: "white",
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1002 * 1002 * 100, // 100 MB
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    console.log(files);
    if (files.length > 0) {
      setPreview(files[0].preview);
      return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }
  }, [files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = files[0];
    try {
      if (!file) return;

      console.log("File:", file);
      const { timestamp } = await getSignature();

      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "ortimyda");
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      formData.append("timestamp", timestamp);

      const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_URL;

      const postedImage = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(postedImage.data.url);

      const data = {
        image: postedImage.data.url,
        username: username,
        email: email,
        current: params.username,
      };

      console.log(data);
      const result = await axios.put(`${baseUrl}/api/editProfile`, data);
      console.log(result.data);

      localStorage.clear();
      localStorage.setItem("authToken", result.data.token);
      authenticateUser();
      setFetch((prev) => !prev);
      handleEdit();
      router.push(`${baseUrl}/profile/${username}`);
      setUsername("");
      setEmail("");
      setFiles([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setEdit((prev) => !prev);
    setShowModal((prev) => !prev);
  };

  return (
    <div className="pt-20">
      {showModal && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={showModal}
          onClose={handleEdit}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style} className="rounded-md shadow-xl">
              <div className="flex justify-around items-center">
                <form
                  className="uploadForm flex items-center flex-col"
                  onSubmit={handleSubmit}
                  enctype="multipart/form-data"
                >
                  <div className="flex items-center justify-around w-full">
                    {preview && (
                      <Image
                        src={preview}
                        alt="user image"
                        width={120}
                        height={120}
                      />
                    )}
                    <div
                      {...getRootProps({
                        className: "dropzone cursor-pointer",
                      })}
                    >
                      <input {...getInputProps({ name: "file" })} />
                      <div className="flex flex-col items-center justify-center gap-4">
                        <ArrowUpTrayIcon className="h-5 w-5 fill-current" />
                        <p>Click or drag and drop image...</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <div className="flex items-center p-2">
                      <h1 className="text-xl w-[20%]">Username:</h1>
                      <TextField
                        placeholder={profileDetails.username}
                        sx={{
                          color: "white",
                          "& .MuiInputBase-input": { color: "white" },
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "violet",
                            },
                          },
                        }}
                        className="w-80 h-[50%] bg-gray-800 text-white text-xl rounded-lg text-white  ml-5 rounded-md"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                      />
                    </div>
                    <div className="flex items-center p-2 mt-4">
                      <h1 className="text-xl w-[20%] relative left-8">
                        Email:
                      </h1>
                      <TextField
                        type="email"
                        placeholder={profileDetails.email}
                        sx={{
                          color: "white",
                          "& .MuiInputBase-input": { color: "white" },
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "violet",
                            },
                          },
                        }}
                        className="w-80 h-[50%] bg-gray-800 text-white text-xl rounded-lg text-white  ml-5 rounded-md"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                    </div>
                    <div className="w-full flex items-center justify-center mt-6 ">
                      <Button
                        className="rounded-md border mr-2 border-purple-600  text-[13.6px]  uppercase  text-white transition-colors hover:border-green-500 hover:text-white"
                        variant={"outlined"}
                        type="submit"
                      >
                        Submit
                      </Button>
                      <Button
                        className="ml-2"
                        onClick={handleEdit}
                        variant="outlined"
                        color="error"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </Box>
          </Fade>
        </Modal>
      )}
    </div>
  );
};

export default ProfileModal;
