import { useContext } from "react";
import { UserContext } from "../App";

function useAuth(){
    return useContext(UserContext);
}

export default useAuth;
