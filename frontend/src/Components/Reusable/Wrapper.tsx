import { RuleSet, styled } from "styled-components";

interface Props {
  children: React.ReactNode;
  direction?: "row" | "column";
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  align?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  flex?: string;
  css?: RuleSet<object>;
}

const Wrapper = ({ children, ...props }: Props) => {
  return <StyledWrapper {...props}>{children}</StyledWrapper>;
};

const StyledWrapper = styled.div<Props>`
  width: 100%;
  display: flex;
  ${(p) => p.flex && `flex: ${p.flex};`}
  ${(p) => p.direction && `flex-direction: ${p.direction};`}
  ${(p) => p.justify && `justify-content: ${p.justify};`}
  ${(p) => p.align && `align-items: ${p.align};`}
  ${(p) => p.wrap && `flex-wrap: ${p.wrap};`}
  ${(p) => p.width && `width: ${p.width};`}
  ${(p) => p.height && `height: ${p.height};`}
  ${(p) => p.margin && `margin: ${p.margin};`}
  ${(p) => p.padding && `padding: ${p.padding};`}
  ${(p) => p.css};
`;

export default Wrapper;
