import { FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Button from "../../Components/Reusable/Button";
import Form from "../../Components/Reusable/Form";
import Input from "../../Components/Reusable/Input";
import Title from "../../Components/Reusable/Title";
import Wrapper from "../../Components/Reusable/Wrapper";
import { userService } from "../../services/user.service";
import HelperService from "../../services/helper.service";

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
    <Wrapper direction="column" flex="1">
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
