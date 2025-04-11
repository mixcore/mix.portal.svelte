import Link from 'next/link';
import { Container, Nav, Navbar as BsNavbar } from 'react-bootstrap';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <BsNavbar expand="lg" className={styles.navbar}>
      <Container>
        <Link href="/" passHref legacyBehavior>
          <BsNavbar.Brand className={styles.brand}>Mixcore</BsNavbar.Brand>
        </Link>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/admin/dashboard" passHref legacyBehavior>
              <Nav.Link>Dashboard</Nav.Link>
            </Link>
            <Link href="/admin/post/list" passHref legacyBehavior>
              <Nav.Link>Posts</Nav.Link>
            </Link>
            <Link href="/admin/page/list" passHref legacyBehavior>
              <Nav.Link>Pages</Nav.Link>
            </Link>
            <Link href="/admin/media/list" passHref legacyBehavior>
              <Nav.Link>Media</Nav.Link>
            </Link>
            <Link href="/admin/user/list" passHref legacyBehavior>
              <Nav.Link>Users</Nav.Link>
            </Link>
            <Link href="/admin/setting" passHref legacyBehavior>
              <Nav.Link>Settings</Nav.Link>
            </Link>
          </Nav>
          <Nav>
            <Link href="/admin/profile" passHref legacyBehavior>
              <Nav.Link>Profile</Nav.Link>
            </Link>
            <Nav.Link href="/api/auth/signout">Logout</Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
} 