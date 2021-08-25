import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  NavbarBrand,
  Navbar,
  Container,
} from "reactstrap";

function ScrollTransparentNavbar() {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [navbarColor] = React.useState(
    (document.documentElement.scrollTop > 499 || document.body.scrollTop) > 499
      ? ""
      : ""
  );
  return (
    <>
      {collapseOpen ? (
        <div
          id="bodyClick"
          onClick={() => {
            document.documentElement.classList.toggle("nav-open");
            setCollapseOpen(false);
          }}
        />
      ) : null}
      <Navbar className={"fixed-top" + navbarColor} color="white" expand="lg">
        <Container>
          <div className="navbar-translate">
          <NavbarBrand to="/bought-and-sold/" tag={Link} id="navbar-brand">
            <img src={require("assets/img/logo2.png")}
              style={{width: `40%`, height: `auto`, marginRight: `0.8em`}}
              alt="ACRE campaigns logo"
            />
              {/* ACRE Campaigns */}
          </NavbarBrand>
            <Link to="/bought-and-sold/methodology" style={{position: `absolute`, right: `0`, paddingRight: `4%`, marginTop: `1.2%`}}>
              <span style={{fontSize: `18px`}}>Methodology</span>
            </Link>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default ScrollTransparentNavbar;
