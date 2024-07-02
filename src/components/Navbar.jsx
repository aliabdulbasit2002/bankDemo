import { User } from "@nextui-org/react";
import { FaBitcoin } from "react-icons/fa6";
import { auth, db } from "../firebase/config";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("User data not found in Firestore");
        }
      } else {
        setUserDetails(null); // Clear userDetails if no user is authenticated
        console.log("User is not logged in");
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from onAuthStateChanged
  }, []);

  // Destructure firstName and lastName with default values to avoid errors
  const { firstName = "", lastName = "" } = userDetails || {};

  return (
    <nav className="p-3 grid grid-cols-12">
      <div className="col-span-2 flex items-center relative">
        <div className="flex gap-x-2 items-center">
          <FaBitcoin className="text-3xl" />
          <h3>Bitbance</h3>
        </div>
        <div className="bg-slate-200 h-[40px] w-[2px] rounded-3xl absolute right-2"></div>
      </div>
      <div className="col-span-7 flex items-center">
        <p className="text-xl">Hey {firstName && `${firstName}`} 👋</p>
      </div>
      <div className="col-span-3 flex items-center pl-5">
        <User
          name={`${firstName} ${lastName}`}
          description="Product Designer"
          avatarProps={{
            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          }}
          className=""
        />
      </div>
    </nav>
  );
};

export default Navbar;
