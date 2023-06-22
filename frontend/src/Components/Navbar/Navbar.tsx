import { useSelector } from "react-redux";
import { Store } from "../../types/Store";
import Button from "../Reusable/Button";
import Wrapper from "../Reusable/Wrapper";
import Title from "../Reusable/Title";
import Link from "../Reusable/Link";
import { css } from "styled-components";

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
      <Title key={2} size="h2">
        {user.username}
      </Title>,
      <Button key={3} onClick={handleLogout}>
        Logout
      </Button>
    );
  }

  return (
    <Wrapper direction="row" justify="flex-end" align="center" css={wrapperCss}>
      <Title size="h1" css={titleCss}>
        Chat App
      </Title>
      {content}
    </Wrapper>
  );
};

export default Navbar;

const wrapperCss = css`
  border-bottom: 1px solid #000;
  ${Title.Component} {
    margin-right: auto;
  }
`;

const titleCss = css`
  flex: 1;
`;
