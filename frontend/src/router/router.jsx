import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import About from "../pages/minipage/About";
import PrivacyPolicy from "../pages/minipage/PrivacyPolicy";
import ContactUs from "../pages/minipage/ContactUs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path:"/about-us",
        element: <About/>
      },
      {
        path:"/privacy-policy",
        element: <PrivacyPolicy/>
      }
    ,
    {
      path:"/contact-us",
      element: <ContactUs/>
    }
    ],
  },
]);

export default router;
