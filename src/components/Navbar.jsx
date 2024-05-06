import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function ColorSchemesExample() {
  return (
    <>
      <Navbar bg="transparent" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand href="#home" className="justify-content-start">NEW MOVIE</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="#home">New Movie</Nav.Link>
            <Nav.Link href="#features">Genre</Nav.Link>
            <Nav.Link href="#pricing">Country</Nav.Link>
            <Nav.Link href="#pricing">Movie</Nav.Link>
            <Nav.Link href="#pricing">TV Series</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;