import { FormEvent, useRef } from "react";
import Form from "../../Components/Reusable/Form";
import Input from "../../Components/Reusable/Input";
import Button from "../../Components/Reusable/Button";
import Navbar from "../../Components/Navbar/Navbar";
import Wrapper from "../../Components/Reusable/Wrapper";
import { userService } from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/reducers/user";
import Title from "../../Components/Reusable/Title";
import HelperService from "../../services/helper.service";
import client from "../../utils/client.axios";

const Login = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(formRef.current as HTMLFormElement);
    const data = Object.fromEntries(formData) as {
      username: string;
      password: string;
    };

    const { status, data: res } = await userService.login(
      data.username,
      data.password
    );

    if (status !== 200 || res.error) {
      HelperService.showError(res.msg);
      return;
    }

    const token = (res.data as any).token; // eslint-disable-line
    localStorage.setItem("token", token);

    window.location.href = "/chat";
  };

  return (
    <Wrapper direction="column" flex="1">
      <Navbar />
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Title>Login</Title>
        <Input type="text" placeholder="Username" name="username" />
        <Input type="password" placeholder="Password" name="password" />
        <Button type="submit">Login</Button>
      </Form>
    </Wrapper>
  );
};

export default Login;
