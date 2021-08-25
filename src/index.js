/*!

=========================================================
* Now UI Kit PRO React - v1.4.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-kit-pro-react
* Copyright 2020 Creative Tim (http://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

// styles
import "assets/css/bootstrap.min.css";
import "assets/scss/now-ui-kit.scss?v=1.4.0";
import "assets/demo/demo.css?v=1.4.0";
import "assets/demo/react-demo.css?v=1.4.0";
import "assets/demo/nucleo-icons-page-styles.css?v=1.4.0";
// pages
import Presentation from "views/Presentation.js";
import States from "views/States";
import Records from "views/Records";
import Methodology from "views/Methodology";
// others

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* <Route
        exact
        path="/bought-and-sold"
        render={(props) => <Presentation {...props}/>}
      /> */}
      <Route
        exact
        strict
        path="/bought-and-sold/"
        render={(props) => <Presentation {...props}/>}
      />
      <Route
        exact
        path="/bought-and-sold/methodology"
        render={(props) => <Methodology {...props}/>}
      />
      <Route
        exact
        path="/bought-and-sold/states"
        render={(props) => <States {...props}/>}
      />
      <Route
        exact
        path="/bought-and-sold/records"
        render={(props) => <Records {...props}/>}
      />
      <Redirect to="/bought-and-sold/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
