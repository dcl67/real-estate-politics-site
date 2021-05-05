/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";
import { Link } from "react-router-dom";

// core components

function FooterBlack() {
  return (
    <>
      <footer className="footer" data-background-color="black">
        <Container>
          <nav>
            <ul>
              <li>
                <a
                  href="https://acrecampaigns.org"
                  target="_blank"
                >
                  ACRE Campaigns
                </a>
              </li>
              <li>
                <Link
                  to="/bought-and-sold/">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/bought-and-sold/methodology"
                >
                  Methodology
                </Link>
              </li>
            </ul>
          </nav>
          <div className="copyright" id="copyright">
            © {new Date().getFullYear()}
          </div>
        </Container>
      </footer>
    </>
  );
}

export default FooterBlack;
