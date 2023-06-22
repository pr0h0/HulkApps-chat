import { Link as RouterLink } from "react-router-dom";
import { styled } from "styled-components";

interface Props {
  to: string;
  children: React.ReactNode;
}

const Link = ({ children, ...props }: Props) => {
  return <StyledLink {...props}>{children}</StyledLink>;
};

export default Link;

const StyledLink = styled(RouterLink)`
  padding: 1rem;
  border: 1px solid black;
  text-decoration: none;
  cursor: pointer;
`;
