import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addUserData } from "./features/user/userFeatures";
import { startUser } from "./Services/login";
import { resumeStore } from "./store/store";
import { Provider } from "react-redux";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.editUser.userData);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();

        if (response.statusCode === 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(null));
        }
      } catch (error) {
        console.log("Error while fetching user:", error.message);
        dispatch(addUserData(null));
      } finally {
        setIsCheckingAuth(false);
      }
    };

    fetchResponse();
  }, [dispatch]);

  useEffect(() => {
    if (!isCheckingAuth && !user) {
      navigate("/");
    }
  }, [user, navigate, isCheckingAuth]);

  if (isCheckingAuth) {
    return null; // Or a loading spinner if preferred
  }

  return (
    <Provider store={resumeStore}>
      <Header user={user} />
      <Outlet />
      <Toaster />
    </Provider>
  );
}

export default App;