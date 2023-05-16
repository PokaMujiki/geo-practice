import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "../styles/navbar.css";

export const Navbar = () => {
  return (
    <nav className="nav">
      <Link to="/" className="dashboard-title">
        Dashboard
      </Link>
      <ul>
        <CustomLink to="/settings">Settings</CustomLink>
        <CustomLink to="/about">About</CustomLink>
      </ul>
    </nav>
  );
};

const CustomLink = ({ to, children, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
};
