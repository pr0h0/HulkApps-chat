import styled, { RuleSet } from "styled-components";

interface Props {
  type?: string;
  id?: string;
  placeholder?: string;
  label?: string;
  name?: string;
  css?: RuleSet<object>;
  labelCss?: RuleSet<object>;
}

const Input = ({ labelCss, label, ...props }: Props) => {
  return (
    <Label css={labelCss}>
      {label}
      <StyledInput {...props} />
    </Label>
  );
};

export default Input;

const StyledInput = styled.input<Props>`
  padding: 8px;
  width: 100%;
  ${(p) => p.css}
`;

const Label = styled.label<{ css?: RuleSet<object> }>`
  width: 100%;
  ${(p) => p.css}
`;
