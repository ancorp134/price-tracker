import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../assets/css/header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';


function Header() {
  return (
    <Navbar expand="lg" className="bg-dark">
      <Container fluid>
        <Navbar.Brand href="#" className="text-white">
          Price Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="#action1" className="text-white">
              Home
            </Nav.Link>
            <Nav.Link href="#action2" className="text-white">
              Link
            </Nav.Link>
            <NavDropdown
              title="Link"
              id="navbarScrollingDropdown"
              menuVariant="dark" 
              className="dark-dropdown"
            >
              <NavDropdown.Item href="#action3" className="text-white bg-dark">
                Action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action4" className="text-white bg-dark">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5" className="text-white bg-dark">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#" disabled className="bg-dark text-white">
              Link
            </Nav.Link>
          </Nav>
          <FontAwesomeIcon icon={faMoon} style={{ color: "white", fontSize: "20px" }} />
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
