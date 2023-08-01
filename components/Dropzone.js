"use client";

import { useCallback, useEffect, useState, useContext } from "react";
import { AuthContext } from "./authProvider";
import { ClipContext } from "./clipProvider";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import axios from "axios";
import { getSignature } from "@app/cloudinary";
import { baseUrl } from "@utils/baseUrl";
import { TextField } from "@mui/material";



const Dropzone = ({ className }) => {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [description, setDescription] = useState("")
  const { authUser } = useContext(AuthContext)
  const {setuploadCount} = useContext(ClipContext)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "video/*": [],
    },
    maxSize: 1024 * 1024 * 100, // 100 MB
    maxFiles: 1,
    onDrop,
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const file = files[0];
    try {
    if (!file) return;

     console.log("File:", file)
    const { timestamp, signature } = await getSignature();

   
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "ortimyda");
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);



    const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;

    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    const result = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Post to Cloudinary:" ,result.data)
    
     const videoObj = {
        ownerId: authUser.id,
        ownerName : authUser.username,
        url: result.data.url,
        description: description,
        image: authUser.image
     }

     console.log("VideoObj:", videoObj)
    const postedToDb = await axios.post(`${baseUrl}api/fileUpload`, videoObj)

    const dbResult = postedToDb.data

    console.log("DbResult:", dbResult)
    setuploadCount(count => count + 1) 
    setDescription("")
     removeFile(files[0].name);
    } catch (error) {
         if (error.response) {
           console.log("Data", error.response.data);
           console.log("Status", error.response.status);
           console.log("Headers", error.response.headers);
         } else if (error.request) {
           console.log("Request", error.request);
         } else {
           console.log("Error", error.message);
         }
    }
  }
  



  return (
    <div className=" max-w-xl flex flex-col items-center pl-20 ml-40">
      <Image
        src={`https://www.svgrepo.com/show/366049/upload.svg`}
        width={80}
        height={80}
        alt="upload"
      />
      <form
        className="uploadForm py-10"
        onSubmit={handleSubmit}
        enctype="multipart/form-data"
      >
        <div
          {...getRootProps({
            className: className,
          })}
        >
          <input {...getInputProps({ name: "file" })} />
          <div className="flex flex-col items-center justify-center gap-4">
            <ArrowUpTrayIcon className="h-5 w-5 fill-current" />
            {isDragActive ? (
              <p>Drop the video here ...</p>
            ) : (
              <p>Drag & drop the clip here, or click to select clip</p>
            )}
          </div>
        </div>

        <section className="mt-10">
          <div className=" flex justify-center">
            <TextField
              variant="filled"
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
              className="mb-4 text-red-500"
              value={description}
              sx={{
                "& .MuiFilledInput-root": {
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "white",
                  },
                  "&.Mui-focused": {
                    borderColor: "white",
                  },
                },
                "& .MuiFilledInput-input": {
                  color: "white",
                },
                "& .MuiFormLabel-root": {
                  color: "white",
                },
                width: "480px",
              }}
            />
          </div>
          <div className="flex mt-10 gap-4">
            <button
              type="button"
              onClick={removeAll}
              className="mt-1 rounded-md border border-rose-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white"
            >
              Remove all files
            </button>
            <button
              type="submit"
              className="ml-auto mt-1 rounded-md border border-purple-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-purple-400 hover:text-white"
            >
              Upload
            </button>
          </div>

          {/* Accepted files */}
          <h3 className="title mt-10 border-b pb-3 text-lg font-semibold text-stone-600">
            Accepted
          </h3>
          {files.length > 0 && (
            <div className="flex flex-col items-center">
              <Image
                src="https://www.svgrepo.com/show/520494/video-course.svg"
                alt={files[0].name}
                width={150}
                height={60}
                className="rounded-md"
              />

              <p className="mt-2 text-[12px] font-medium text-stone-500">
                {files[0].name}
              </p>
              <button
                type="button"
                className="flex px-3 mt-5 items-center justify-center rounded-md border border-red-400 bg-red-600 transition-colors hover:bg-white hover:text-black hover:border-white"
                onClick={() => removeFile(files[0].name)}
              >
                Remove
              </button>
            </div>
          )}

          {/* Rejected Files */}
          <h3 className="title mt-24 border-b pb-3 text-lg font-semibold text-stone-600">
            Rejected
          </h3>
          <ul className="mt-6 flex flex-col">
            {rejected.map(({ file, errors }) => (
              <li key={file.name} className="flex items-start justify-between">
                <div>
                  <p className="mt-2 text-sm font-medium text-stone-500">
                    {file.name}
                  </p>
                  <ul className="text-[12px] text-red-400">
                    {errors.map((error) => (
                      <li key={error.code}>{error.message}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  className="mt-1 rounded-md border border-rose-400 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white"
                  onClick={() => removeRejected(file.name)}
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      </form>
    </div>
  );
};

export default Dropzone;
