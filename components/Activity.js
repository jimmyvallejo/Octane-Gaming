import React from 'react'
import Image from 'next/image'

export const Activity = ({item, handleClip}) => {
  return (
    <div className="flex flex-col my-2 " key={item._id}>
    <div className="flex items-center pl-5">
      <Image
        alt="video picture"
        width={40}
        height={40}
        src={item.kind === "comment" ? `/assets/icons/chat.png` : `/assets/icons/heart.png` }
      />
      <p className="ml-3">
        {item.user.username} left a {item.kind} on your{" "}
        <span
          className="border-b cursor-pointer font-semibold"
          onClick={() => handleClip(item.video)}
        >
          video
        </span>{" "}
      </p>
    </div>
  </div>
  )
}
