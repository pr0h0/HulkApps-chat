import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Chat from "./Pages/Chat/Chat";
import { useEffect, useState } from "react";
import { userService } from "./services/user.service";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "./types/Store";
import { setUser } from "./redux/reducers/user";
import client from "./utils/client.axios";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: Store) => state.user);

  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const { data: res, status } = await userService.getUser();
    if (status !== 200 || res.error) {
      setLoading(false);
      return;
    }

    dispatch(setUser(res.data));
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUser();
  }, []); // eslint-disable-line

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {!user && (
          <>
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />
          </>
        )}
        {user && <Route path="/chat" Component={Chat} />}
        <Route
          path="*"
          Component={() => <Navigate to={user ? "/chat" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
