import { styled } from "styled-components";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { Store } from "../../types/Store";

const Navbar = () => {
  const user = useSelector((state: Store) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const content = [];
  if (!user) {
    content.push(
      <Link key={0} to="/login">
        Login
      </Link>,
      <Link key={1} to="/register">
        Register
      </Link>
    );
  } else {
    content.push(
      <Title key={2}>{user.username}</Title>,
      <Button key={3} onClick={handleLogout}>
        Logout
      </Button>
    );
  }

  return (
    <Wrapper>
      <Title>Chat App</Title>
      {content}
    </Wrapper>
  );
};

export default Navbar;

const Wrapper = styled.nav`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid #ccc;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  flex: 1;
  text-aling: left;
`;

const Link = styled(RouterLink)`
  text-decoration: none;
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  transition: all 0.2s ease-in-out;
  margin: 0 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin: 0 0.5rem;
`;
