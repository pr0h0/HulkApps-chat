import { RuleSet, styled } from "styled-components";

interface Props {
  size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: string;
  weight?: "bold" | "normal";
  align?: "flex-start" | "center" | "flex-end";
  textTransform?: "uppercase" | "lowercase" | "capitalize";
  css?: RuleSet<object>;
  children: React.ReactNode;
}

const Title = ({
  size = "h1",
  color = "black",
  weight = "normal",
  align = "flex-start",
  textTransform,
  css,
  children,
}: Props) => {
  return (
    <StyledTitle
      as={size}
      color={color}
      weight={weight}
      align={align}
      textTransform={textTransform}
      css={css}
    >
      {children}
    </StyledTitle>
  );
};

export default Title;

const StyledTitle = styled.h1<Props>`
  color: ${(p) => p.color};
  font-weight: ${(p) => p.weight};
  display: flex;
  align-items: center;
  justify-content: ${(p) => p.align}};
  text-transform: ${(p) => p.textTransform};
  ${(p) => p.css};
`;

Title.Component = StyledTitle;
