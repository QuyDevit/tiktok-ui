import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { publicRoutes } from "~/routes";
import DefaultLayout from "./layouts";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading } from "./store/features/loadingSlice";
import Loading from "./components/Loading";
import * as userService from "~/services/users/getInfoUser";
import { selectUser, setUser } from "./store/features/authSlice";
import * as authHelper from"~/helpers"

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const isLoading = useSelector(selectIsLoading);
  useEffect(() => {
    if (!user && authHelper.authcookie.hasValidRefreshToken()) {
      const fetchApi = async () => {
        try{
          var response = await userService.getInfoUser();
          dispatch(setUser(response.data))
        }catch{
          authHelper.authcookie.clearRefreshToken();
        }
      };
      fetchApi();
    }
  }, [user]);
  return (
    <Router>
      <div className="App">
        {isLoading && <Loading />}

        <Routes>
          {publicRoutes.map((route, index) => {
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
                  Layout === Fragment ? (
                    <Page />
                  ) : (
                    <Layout isFullWidth={isFullWidth}>
                      <Page />
                    </Layout>
                  )
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
