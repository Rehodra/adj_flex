import type { RouteObject } from "react-router";
//import Authentication from "../pages/Authentication";
import Login from "../pages/Login/Login";
import Signup from "../pages/SignUp/Signup";
//import ProtectedRoute from "../components/ProtectedRoute";
import IndividualSearchPage from "../pages/IndividualSearchPage/IndividualSearchPage";
//import Main from "../pages/Main";
import Search from "../pages/Search/Search";                                                                                                                                                                                                    
import User from "../pages/User/User";
import JudgementSearch from "../pages/judgmentSearch/judgmentSearch";
import Cases from "../pages/Cases/Cases";
import LandingPage from "../pages/LandingPage/LandingPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import Leaderboard from "../pages/Leaderboard/Leaderboard";
import Simulator from "../pages/Simulator/Simulator";

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
        element: <Cases />
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
        path: "/simulator/:caseId",
        element: <Simulator />
    },

    {
        path: "/simulator",
        element: <Cases />
    },

    {
        path: "/signup",
        element: <Signup />
    }

];

export default routes;
