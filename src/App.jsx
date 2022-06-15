import "antd/dist/antd.css";

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import EchartExample from "./pages/echart-example";
import Main from "./pages/main";
import Login from "./pages/login";
import RouterLink from "./component/router-link";
import { AUTH_MAPPING_DATA } from "./authData";

import { useEffect, useState } from "react";
import { settingToken, api, defaultAxios } from "./environment/api";
const events = require("events");

export const appEventEmitter = new events.EventEmitter();

const App = () => {
  const [router, setRouter] = useState("");
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [permission, setPermission] = useState(
    JSON.parse(localStorage.getItem("permission")) || []
  );

  const GuardedRoute = ({ component: Component, ...rest }) => {
    setRouter(rest.path);
    return (
      <Route
        {...rest}
        render={(props) =>
          // auth ? (
            <Component {...props} />
          // ) : (
          //   <Redirect to="/login/" />
          // )
        }
      />
    );
  };
  useEffect(() => {
    appEventEmitter.on("unauthorization", (msg) => {
      localStorage.removeItem("token");
      // setAuth(false);
    });
  }, []);

  useEffect(() => {
    setAuth(!!token);
    settingToken(token);
  }, [token]);

  // useEffect(() => {
  //   defaultAxios({
  //     url: api.getRolePermission.url,
  //     method: api.getRolePermission.method,
  //   })
  //     .then((res) => {
  //       setPermission(res.data);
  //     })
  //     .catch((err) => {
  //       errorNotification(err?.response?.data);
  //     });
  // }, [router]);

  return (
    <BrowserRouter>
      <div className="flex ">
        {/* {<RouterLink setToken={setToken} permission={['Q1-chart', 'replay-chart']} />} */}
        <div className="flex-1 mb-10">
          <Switch>
            {/* <Route
              path="/login/"
              component={() => (
                <Login setToken={setToken} setPermission={setPermission} />
              )}
            /> */}
            {/* <Route path="/" exact component={Main} /> */}
            {/* <Route
              path="/echart-example"
              component={EchartExample}
            /> */}
            {['replay-chart'].map((data) => (
              <Route
                key={Math.random()}
                path={`/`}
                component={AUTH_MAPPING_DATA[data]}
              />
            ))}
            {/* <Redirect
              from="*"
              to={auth ? "/" : "/login"}
            /> */}
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
