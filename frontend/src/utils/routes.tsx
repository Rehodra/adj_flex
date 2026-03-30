import { RouteObject } from "react-router-dom";
//import Authentication from "../pages/Authentication";
import Login from "../pages/Login/Login";
import Signup from "../pages/SignUp/Signup";
//import ProtectedRoute from "../components/ProtectedRoute";
import IndividualSearchPage from "../pages/IndividualSearchPage/IndividualSearchPage";
//import Main from "../pages/Main";
import Search from "../pages/Search/Search";
import User from "../pages/User/User";
import JudgementSearch from "../pages/judgmentSearch/judgmentSearch";
import Dashboard from "../pages/Dashboard/Dashboard";
import Simulator from "../pages/Simulator/Simulator";
import LandingPage from "../pages/LandingPage/LandingPage";
import Leaderboard from "../pages/Leaderboard/Leaderboard";

const routes: RouteObject[] = [
    {
        path: "/user",
        element: <User />
    },

    {
        path: "/search",
        element: <Search />
    },

    {
        path: "/authentication",
        element: <Login />
    },

    {
        path: "/",
        element: <LandingPage />
    },

    {
        path: "/document/:documentID",
        element: <IndividualSearchPage />
    },

    {
        path: "/judgementsearch",
        element: <JudgementSearch />
    },

    {
        path: "/cases",
        element: <Dashboard />
    },

    {
        path: "/dashboard",
        element: <Dashboard />
    },

    {
        path: "/leaderboard",
        element: <Leaderboard />
    },

    {
        path: "/simulate/:caseId",
        element: <Simulator />
    },

    {
        path: "/signup",
        element: <Signup />
    }

];

export default routes;