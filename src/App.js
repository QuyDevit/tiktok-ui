import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { publicRoutes } from "~/routes";
import DefaultLayout from "./layouts";
import { Fragment, useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading } from "./store/features/loadingSlice";
import Loading from "./components/Loading";
import { getInfoUser } from "~/services/users/getInfoUser";
import { selectUser, setUser } from "./store/features/authSlice";
import Alert from "./components/Alert/Alert";
import { authcookie } from "~/helpers";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    if (!user && authcookie.hasValidRefreshToken()) {
      const fetchApi = async () => {
        try {
          var response = await getInfoUser();
          dispatch(setUser(response.data));
        } catch {
          authcookie.clearRefreshToken();
        }
      };
      fetchApi();
    }
  }, [user]);

  // Lazy load routes
  const lazyRoutes = publicRoutes.map((route) => ({
    ...route,
    component: lazy(() => import(`./pages/${route.component.name}`)),
  }));

  return (
    <Router>
      <div className="App">
        <Alert />
        {isLoading && <Loading />}

        <Routes>
          {lazyRoutes.map((route, index) => {
            var Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            const Page = route.component;
            const isFullWidth = route.isFullWidth || false;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Suspense fallback={<Loading />}>
                    {Layout === Fragment ? (
                      <Page />
                    ) : (
                      <Layout isFullWidth={isFullWidth}>
                        <Page />
                      </Layout>
                    )}
                  </Suspense>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
