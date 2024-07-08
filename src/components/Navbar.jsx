import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function ColorSchemesExample() {
  return (
    <>
      <Navbar bg="transparent" expand="lg" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand href="#home" className="justify-content-start">CineGlance</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Genre</Nav.Link>
              <Nav.Link href="#pricing">Country</Nav.Link>
              <Nav.Link href="#Movies">Movies</Nav.Link>
              <Nav.Link href="#TV">TV Series</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;
