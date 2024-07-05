import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";

// Layout
import RootLayout from "./layouts/RootLayout";

// Pages
import Transactions from "./pages/Transactions";
import Content from "./components/Content";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";

// Firebase
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase/config";

const App = () => {
  const [userDetails, setUserDetails] = useState(null);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true); // I can handle the state of the app using the loading screen to know if a user is authenticated
=======
>>>>>>> origin/main

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
<<<<<<< HEAD
        
        } else {
          setUserDetails(null);
          console.log("User data Not Found, Please sign-up");
=======
          // console.log("User details loaded:", docSnap.data());
        } else {
          setUserDetails(null);
          console.log("No user data found in Firestore");
>>>>>>> origin/main
        }
      } else {
        setUserDetails(null);
        console.log("User is not logged in");
      }
<<<<<<< HEAD
      setLoading(false); // So if User is authenticated, we Set loading state to false
=======
>>>>>>> origin/main
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from onAuthStateChanged
  }, []);

<<<<<<< HEAD
  // Show a loading screen, we can maybe make this fancy too.
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div>Loading...</div>
      </div>
    );
  }

=======
>>>>>>> origin/main
  // Create routes based on user authentication state
  const routes = createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route
        index
        element={userDetails ? <Navigate to="/dashboard" /> : <Home />}
      />
      <Route
        path="signup"
        element={userDetails ? <Navigate to="/dashboard" /> : <SignUp />}
      />
      <Route
        path="login"
        element={userDetails ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="dashboard"
        element={userDetails ? <Dashboard /> : <Navigate to="/login" />}
      >
        <Route index element={<Content />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>
    </Route>
  );

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

<<<<<<< HEAD

const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Here we set the height of the loading container to the entire screen
  },
};
=======
>>>>>>> origin/main
export default App;
