import React, { useEffect } from 'react'
import Image from 'next/image'


const Comment = ( {comment} ) => {
  
  useEffect(() => {
    console.log(comment)
  }, [])
  
    return (
      <div className=" flex items-start justify-start flex flex-col ml-5 mt-5 mb-5">
        <div className="flex">
          <Image
            src={comment.ownerPic}
            width={30}
            height={30}
            className="mr-3"
          />
          <h1 className="text-white">{comment.ownerName}: </h1>
        </div>
        <p className=" min-w-[90%] rounded-md ml-10"> {comment.post}</p>
        <div className='flex items-center mt-2'>
          <p className="text-xs">2d ago</p>
          <button className='text-xs ml-3'>Reply</button>
        </div>
      </div>
    );
}

export default Comment