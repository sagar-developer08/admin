import { BsFileFont } from "react-icons/bs";
import {
  FiGrid,
  FiUsers,
  FiUser,
  FiCompass,
  FiSettings,
  FiSlack,
  FiGlobe,
  FiTarget,
  FiMapPin,
  FiCircle
} from "react-icons/fi";

/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const sidebar = [
  {
    path: "/dashboard", // the url
    icon: FiGrid, // icon
    name: "Dashboard", // name that appear in Sidebar
  },

  {
    icon: FiSlack,
    name: "Catalog",
    routes: [
      {
        path: "/products",
        name: "Products",
      },
      {
        path: "/contact-lens",
        name: "ContactLens",
      },
      {
        path: "/accessories",
        name: "Accessories",
      },
      {
        path: "/categories",
        name: "Categories",
      },
      {
        path: "/attributes",
        name: "Brands",
      },
      {
        path: "/coupons",
        name: "Coupons",
      },
    ],
  },

  {
    path: "/customers",
    icon: FiUsers,
    name: "Customers",
  },
  {
    path: "/orders",
    icon: FiCompass,
    name: "Orders",
  },

  {
    path: "/eye-test",
    icon: FiUser,
    name: "Book & Eye Test",
  },
  {
    path: "/store",
    icon: FiMapPin,
    name: "Store Locator",
  },
  {
    path: "/testimonials",
    icon: FiCircle,
    name: "Testimonials",
  },

  // {
  //   path: "/settings",
  //   icon: FiSettings,
  //   name: "StoreSetting",
  // },
  // {
  //   icon: FiGlobe,
  //   name: "International",
  //   routes: [
  //     {
  //       path: "/languages",
  //       name: "Languages",
  //     },
  //     {
  //       path: "/currencies",
  //       name: "Currencies",
  //     },
  //   ],
  // },
  // {
  //   icon: FiTarget,
  //   name: "ViewStore",
  //   path: "http://localhost:4000",
  //   outside: "store",
  // },

  // {
  //   icon: FiSlack,
  //   name: "Pages",
  //   routes: [
  //     // submenu

  //     {
  //       path: "/404",
  //       name: "404",
  //     },
  //     {
  //       path: "/coming-soon",
  //       name: "Coming Soon",
  //     },
  //   ],
  // },
];

export default sidebar;
