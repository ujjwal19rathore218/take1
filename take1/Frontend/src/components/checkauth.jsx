import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useCheckAuth = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getuser = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/auth/login/success`, { withCredentials: true });
        console.log("response", response);
      } catch (error) {
        navigate("/login");
        console.log(BACKEND_URL);
      } finally {
        setLoading(false);
      }
    };

    getuser();
  }, [navigate, BACKEND_URL]);

  return loading;
};

export default useCheckAuth;