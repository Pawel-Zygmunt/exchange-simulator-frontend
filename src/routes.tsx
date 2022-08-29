import Authorized from "./Authorized";
import SignInPage from "./pages/signinPage";
import SignUpPage from "./pages/singupPage";
import WorkspacePage from "./pages/workspacePage";

interface RoutesType {
  path: string;
  element: React.ReactElement;
  children?: RoutesType[];
}

export const routes = [
  {
    path: "/",
    element: (
      <Authorized>
        <WorkspacePage />
      </Authorized>
    ),
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },

  {
    path: "*",
    element: (
      <div>
        <h1>Nie ma takiej strony</h1>
      </div>
    ),
  },
];

export default routes;
