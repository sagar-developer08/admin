import { lazy } from "react";

// use lazy for better code splitting
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Attributes = lazy(() => import("../pages/Attributes"));
const ChildAttributes = lazy(() => import("../pages/ChildAttributes"));
const Products = lazy(() => import("../pages/Products"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Category = lazy(() => import("../pages/Category"));
const CategoryDetails = lazy(() => import("../pages/CategoryDetails"));
const EyeTest = lazy(() => import("../pages/EyeTest"));
const EyeTestDetails = lazy(() => import("../pages/EyeTestDetails"));
const Store = lazy(() => import("../pages/Store"));
const StoreDetails = lazy(() => import("../pages/StoreDetails"));
const TestimonialsDetails = lazy(() => import("../pages/TestimonialsDetails"));
const Testimonials = lazy(() => import("../pages/Testimonials"));
const Customers = lazy(() => import("../pages/Customers"));
const CustomerOrder = lazy(() => import("../pages/CustomerOrder"));
const Orders = lazy(() => import("../pages/Orders"));
const OrderInvoice = lazy(() => import("../pages/OrderInvoice"));
const Coupons = lazy(() => import("../pages/Coupons"));
// const Setting = lazy(() => import("../pages/Setting"));
const Page404 = lazy(() => import("../pages/404"));
const ComingSoon = lazy(() => import("../pages/ComingSoon"));
const EditProfile = lazy(() => import("../pages/EditProfile"));
const Languages = lazy(() => import("../pages/Languages"));
const Currencies = lazy(() => import("../pages/Currencies"));
const Setting = lazy(() => import("../pages/Setting"));
const ContactLens = lazy(() => import("../pages/Contact-lens"));
const ContactLensDetails = lazy(() => import("../pages/Contact-lensDetails"));
const Accessories = lazy(() => import("../pages/Accessories"));
const AccessoriesDetails = lazy(() => import("../pages/AccessoriesDetails"));
const AttributesDetails = lazy(() => import("../pages/AttributesDetails"));
/*
//  * ⚠ These are internal routes!
//  * They will be rendered inside the app, using the default `containers/Layout`.
//  * If you want to add a route to, let's say, a landing page, you should add
//  * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
//  * are routed.
//  *
//  * If you're looking for the links rendered in the SidebarContent, go to
//  * `routes/sidebar.js`
 */

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/products",
    component: Products,
  },
  {
    path: "/contact-lens",
    component: ContactLens,
  },
  {
    path: "/contact-lens/:id",
    component: ContactLensDetails,
  },
  {
    path: "/accessories",
    component: Accessories,
  },
  {
    path: "/accessories/:id",
    component: AccessoriesDetails,
  },
  {
    path: "/attributes",
    component: Attributes,
  },
  {
    path: "/attributes/:id",
    component: AttributesDetails,
  },
  {
    path: "/product/:id",
    component: ProductDetails,
  },
  {
    path: "/categories",
    component: Category,
  },
  {
    path: "/languages",
    component: Languages,
  },
  {
    path: "/currencies",
    component: Currencies,
  },

  {
    path: "/categories/:id",
    component: CategoryDetails,
  },
  {
    path: "/customers",
    component: Customers,
  },
  {
    path: "/customer-order/:id",
    component: CustomerOrder,
  },
  {
    path: "/eye-test",
    component: EyeTest,
  },
  {
    path: "/eye-test/:id",
    component: EyeTestDetails,
  },
  {
    path: "/store",
    component: Store,
  },
  {
    path: "/store/:id",
    component: StoreDetails,
  },
  {
    path: "/testimonials",
    component: Testimonials,
  },
  {
    path: "/testimonials/:id",
    component: TestimonialsDetails,
  },
  {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/order/:id",
    component: OrderInvoice,
  },
  {
    path: "/coupons",
    component: Coupons,
  },
  { path: "/settings", component: Setting },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/coming-soon",
    component: ComingSoon,
  },
  {
    path: "/edit-profile",
    component: EditProfile,
  },
];

export default routes;
