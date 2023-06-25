import { FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { userService } from "../../services/user.service";
import HelperService from "../../services/helper.service";
import { styled } from "styled-components";

const Register = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(formRef.current as HTMLFormElement);
    const data = Object.fromEntries(formData) as {
      username: string;
      password: string;
    };

    if (!data.username || !data.password)
      return HelperService.showError("Please fill all fields");

    const { status, data: res } = await userService.register(
      data.username,
      data.password
    );
    if (status !== 200 || res.data) {
      HelperService.showError(res.msg);
      return;
    }

    navigate("/login");
  };

  return (
    <Wrapper>
      <Navbar />
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Title>Register</Title>
        <Input type="text" placeholder="Username" name="username" />
        <Input type="password" placeholder="Password" name="password" />
        <Button type="submit">Register</Button>
      </Form>
    </Wrapper>
  );
};

export default Register;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  outline: none;
  font-size: 1rem;
  background-color: #456;
  color: #fff;
  &::placeholder {
    color: #ccc;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: #000;
  color: #fff;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
`;
