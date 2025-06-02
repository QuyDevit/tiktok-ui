import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { publicRoutes } from "~/routes";
import DefaultLayout from "./layouts";
import { Fragment, useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading } from "./store/features/loadingSlice";
import Loading from "./components/Loading";
import { getInfoUser } from "~/services/users/getInfoUser";
import {
  selectUser,
  setUser,
  setAuthChecking,
} from "./store/features/authSlice";
import Alert from "./components/Alert/Alert";
import { authcookie } from "~/helpers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    let isMounted = true;
    if (!user) {
      if (authcookie.hasValidRefreshToken()) {
        const fetchApi = async () => {
          try {
            const response = await getInfoUser();
            if (isMounted) {
              dispatch(setUser(response.data));
            }
          } catch {
            if (isMounted) {
              authcookie.clearRefreshToken();
              dispatch(setAuthChecking(false));
            }
          }
        };
        fetchApi();
      } else {
        dispatch(setAuthChecking(false));
      }
    }
    return () => {
      isMounted = false;
    };
  }, [user, dispatch]);

  // Lazy load routes
  const lazyRoutes = publicRoutes.map((route) => ({
    ...route,
    component: lazy(() => import(`./pages/${route.component.name}`)),
  }));

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
