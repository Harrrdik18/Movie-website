import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function ColorSchemesExample() {
  return (
    
      <Navbar bg="black" expand="lg" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand href="/" className="justify-content-start">CineGlance</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" exact>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/genre">
                Genre
              </Nav.Link>
              <Nav.Link as={NavLink} to="/country">
                Country
              </Nav.Link>
              <Nav.Link as={NavLink} to="/movies">
                Movies
              </Nav.Link>
              <Nav.Link as={NavLink} to="/tv-series">
                TV Series
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  
  );
}

export default ColorSchemesExample;
