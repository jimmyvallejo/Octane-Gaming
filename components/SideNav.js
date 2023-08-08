import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Martel_Sans } from "next/font/google";
import { useContext } from "react";
import { AuthContext } from "./authProvider";

const martelSans = Martel_Sans({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
});

const SideNav = () => {
  const { changeLogout, authUser, authFollowers } = useContext(AuthContext);

  return (
    <section className={martelSans.className}>
      <div className="sideNav fixed h-screen flex flex-col items-start tracking-normal  uppercase font-bold">
        <div className="flex flex-col justify-start w-full mt-3 border-b border-gray-500">
          {authUser && (
            <div className="flex  flex-col items-center  justify-around h-60 mr-5 w-full pointer text-xl">
              <div className="flex flex-row items-center justify-between w-[97%] rounded py-3 hover:bg-gray-800">
                <div className="flex flex-row items-center ml-3">
                  <Image
                    src={`/assets/icons/customer.png`}
                    width={35}
                    height={35}
                    alt="profile"
                  />

                  <Link
                    className="ml-2 text-l mt-2 text-gray-300 "
                    href={`/profile`}
                  >
                    Profile
                  </Link>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between w-[97%] rounded py-3 hover:bg-gray-800">
                <div className="flex flex-row items-center ml-3">
                  <Image
                    src={`https://www.svgrepo.com/show/508322/upload.svg`}
                    width={35}
                    height={35}
                    alt="profile"
                  />
                  <Link
                    className="ml-2 text-l mt-2 text-gray-300"
                    href={`/upload`}
                  >
                    Upload
                  </Link>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between w-[97%] rounded py-3 hover:bg-gray-800 ">
                <div className="flex flex-row items-center ml-3 cursor-pointer ">
                  <Image
                    src="/assets/icons/shutdown.png"
                    width={32}
                    height={32}
                    alt="logout"
                  />
                  <a
                    className="ml-3 text-l  text-gray-300"
                    onClick={changeLogout}
                  >
                    Logout
                  </a>
                </div>
              </div>
            </div>
          )}
          {!authUser && <h1 className="text-md ml-2 mb-1 mt-2">Sign in to use DashBoard</h1>}
        </div>
        {authUser && 
        <div className="flex flex-col justify-between  rounded py-3 mt-3 w-full ">
          <h1 className="flex justify-center mr-4 text-sm tracking-normal">Recent Followers</h1>
        {authUser && authUser.followers.length > 0 && authFollowers && authFollowers.slice(0, 5).map((follower, index) =>  {
        return (
        
            <div key={index} className="flex flex-row items-center my-3 rounded  hover:bg-gray-800 w-[97%] ml-1 border border-gray-800 p-2">
                  <Image
                    src={follower.image}
                    width={35}
                    height={35}
                    alt="profile"
                    className="ml-2"
                  />

                  <h1
                    className="ml-2 text-l  text-gray-300 "
                   
                  >
                    {follower.username}
                  </h1>
                </div>



        )
        })
      }
      </div>
}
      </div>
    </section>
  );
};

export default SideNav;
