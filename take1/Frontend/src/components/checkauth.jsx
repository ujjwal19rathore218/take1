import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useCheckAuth = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/login");
        setLoading(false);
        return;
      }
      try {
        // Example protected endpoint
        await axios.get(`${BACKEND_URL}/api/balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // If successful, user is authenticated
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem("jwtToken");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [navigate, BACKEND_URL]);

  return loading;
};

export default useCheckAuth;
