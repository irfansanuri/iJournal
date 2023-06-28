import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NotFound from "./NotFound";

function RequireAuth(props) {
  const [user] = useAuth();
  const location = useLocation();
  const [role] = useState(Cookies.get("role"));
  const [roleCode] = useState(props.roleCode);
  const [roleGuide, setRoleGuide] = useState("");

  useEffect(() => {
    switch (role) {
      case "Admin":
        setRoleGuide("6901");
        break;
      case "General Editor":
        setRoleGuide("6902");
        break;
      case "Editor":
        setRoleGuide("6903");
        break;
      case "Reviewer":
        setRoleGuide("6904");
        break;
      case "Author":
        setRoleGuide("6905");
        break;
      default:
    }
  }, [role]);

  return user.accesstoken ? (
    roleCode.includes(roleGuide) ? (
      <Outlet />
    ) : (
      <NotFound />
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  ); //Kalau tak ada from location dgn replace, xboleh patah balik bila tekan back
}

export default RequireAuth;

//if role === role --> <Outlet />
//if not, kalau login --> unauthorized -->
//kalau xlogin --> not found