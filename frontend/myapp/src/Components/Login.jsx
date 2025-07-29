import React from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

function Login() {
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center align-items-center vh-100">
        <Col md={6} lg={4}>
          <Card
            className="bg-dark text-white my-5 mx-auto"
            style={{ borderRadius: "1rem" }}
          >
            <Card.Body className="p-5 d-flex flex-column align-items-center">
              <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
              <p className="text-white-50 mb-5">
                Please enter your login and password!
              </p>

              <Form className="w-100 px-4">
                <Form.Group className="mb-4">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" size="lg" />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" size="lg" />
                </Form.Group>

                <div className="d-flex justify-content-end mb-3">
                  <a href="#!" className="text-white-50">
                    Forgot password?
                  </a>
                </div>

                <Button
                  variant="outline-light"
                  size="lg"
                  className="w-100 mb-4"
                >
                  Login
                </Button>
              </Form>

              {/* <div className="d-flex flex-row mt-3 mb-5">
                <Button variant="link" className="text-white mx-2 p-0">
                  <FaFacebookF size={24} />
                </Button>
                <Button variant="link" className="text-white mx-2 p-0">
                  <FaTwitter size={24} />
                </Button>
                <Button variant="link" className="text-white mx-2 p-0">
                  <FaGoogle size={24} />
                </Button>
              </div> */}

              <p className="mb-0">
                Don't have an account?{" "}
                <a href="#!" className="text-white-50 fw-bold">
                  Sign Up
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login
