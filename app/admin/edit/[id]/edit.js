'use client'
import React, { useEffect , useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify';
import { TextField, Button, Box } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';



const Edit = ({id, result}) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const{register, handleSubmit, reset, formState:{errors}} = useForm();
  const [loading, setLoading] = useState(false);


  //mount the already sotred values if available
  useEffect(() => {
     if(result){
      reset({
        title:result.title,
        description:result.description,
        category: result.category,
        author: result.author
      })

     }
  }, [result, reset])
  
  useEffect(() => {
    if (status === "loading") return // wait for session to load

    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/check-admin")
        const data = await res.json()

        if (!data.success ||data.data !== "admin") {
          toast.error("Access denied. You are not an admin.")
          setTimeout(() => router.push("/blogs"), 2000) // wait before redirect
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        toast.error("Something went wrong")
        setTimeout(() => router.push("/blogs"), 2000)
      }
    }

    if (session) {
      checkAdmin()
    } else {
      // not logged in
      setTimeout(() => router.push("/blogs"), 2000)
    }
  }, [session, status])
//send the updated value to backend
const onSubmit = async (data) => {
  setLoading(true);
  try {
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('title', data.title);
    formdata.append('description', data.description);
    formdata.append('category', data.category);
    formdata.append('author', data.author);

    if (data.file?.[0]) {
      formdata.append('file', data.file[0]);
    }

    const request = await fetch('/api/blogapi', {
      method: "PUT",
      body: formdata
    });

    const response = await request.json();

    if (response.success) {
      toast.success("Data updated successfully");
      setTimeout(() => router.push('/blogs'), 1500);
    } else {
      toast.error(response.message || 'Failed to update the record');
    }
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Some error occurred while updating the data");
  } finally {
    setLoading(false);
  }
};



  return (
    <div>
      <ToastContainer />
      <Box  component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{width:'45%', margin:'auto', mt:4, display:'flex', flexDirection:'column', gap:2}}
      >
   <h1 className="text-center font-bold text-2xl">Edit Blog</h1>
   <TextField  {...register("title",{required:"Title is required"})}/>
   {errors.title && <span className="font-bold text-red-600">{errors.title.message}</span>}
   <TextField  {...register("category" , {required:"category is required"})}/>
   {errors.category && <span className="font-bold text-red-600">{errors.category.message}</span>}
   <TextField   multiline {...register("description", {required:"description is required"})}/>
   {errors.description && <span className="font-bold text-red-600">{errors.description.message}</span>}
   <input  type="file" {...register("file")}/>
   <Button variant='contained' color="primary" type="submit" disabled={loading}>{loading ? 'updating...':'update'}</Button>
      </Box>
    </div>
  )
}

export default Edit
