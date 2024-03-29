import { ChangeEvent, useContext, useState } from "react";
import {
  FormControl,
  FilledInput,
  InputLabel,
  Typography,
  Grid,
  Button,
  Link,
} from "@mui/material";
import { LoginType } from "../../Types";
import { loginSchema } from "../../Validation";
import { ValidationError } from "yup";
import ValidationErrorAlert from "../ValidationErrorAlert";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useMutation as useReactMutation } from "@tanstack/react-query";
import { UserTokenContext } from "../../context";

const loginUrl = `${import.meta.env.VITE_AUTH_BACKEND_URL}/login`;

function LoginView() {
  const [loginData, setLoginData] = useState<Partial<LoginType>>({
    email: "",
    password: "",
  });
  const [isLoginEnabled, setIsLoginEnabled] = useState<boolean>(true);
  const [errors, setErrors] = useState<string>();

  const { setToken, setUserId, setTeamId } = useContext(UserTokenContext);

  const { mutateAsync } = useReactMutation({
    mutationKey: ["login"],
    mutationFn: async (data: LoginType) => {
      try {
        const res = await axios.post(loginUrl, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setLoginData({ email: "", password: "" });
        return res.data;
      } catch (ex) {
        if (ex instanceof AxiosError) {
          setIsLoginEnabled(false);
          setErrors(ex.response?.data);
        }
      }
    },
  });

  const navigate = useNavigate();

  const enableLoginButton = () => {
    setIsLoginEnabled(true);
    setErrors("");
  };

  const setLoginDataOnInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    registerTypeKey: keyof LoginType
  ) => {
    setLoginData((prev) => ({
      ...prev,
      [registerTypeKey]: e.target.value,
    }));
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginDataOnInputChange(e, "email");
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginDataOnInputChange(e, "password");
  };

  const handleLinkClick = (address: string) => {
    navigate(address);
  };

  const handleClick = async () => {
    try {
      const valid = await loginSchema.validate(loginData);
      const token = await mutateAsync(valid);
      if (setToken && setUserId && setTeamId && token) {
        setToken(token.token);
        setUserId(token.userId);
        setTeamId(token.userId);
        localStorage.setItem("token", token.token);
        localStorage.setItem("userId", token.userId);
        localStorage.setItem("teamId", token.userId);
        navigate("/loadData");
      }
    } catch (ex) {
      if (ex instanceof ValidationError) {
        setIsLoginEnabled(false);
        setErrors(ex.errors.join(","));
      }
    }
  };

  return (
    <Grid container flexDirection="column" rowGap="1rem" maxWidth="768px">
      <Typography variant="h6">Login</Typography>
      <FormControl>
        <InputLabel>Email</InputLabel>
        <FilledInput
          type="email"
          value={loginData.email}
          onChange={onEmailChange}
          required
        ></FilledInput>
      </FormControl>
      <FormControl>
        <InputLabel>Password</InputLabel>
        <FilledInput
          type="password"
          value={loginData.password}
          onChange={onPasswordChange}
          required
        ></FilledInput>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleClick}
        disabled={!isLoginEnabled}
      >
        Login
      </Button>
      <Link
        onClick={() => {
          handleLinkClick("/register");
        }}
      >
        Click here to register
      </Link>
      <Link
        onClick={() => {
          handleLinkClick("/forgotPassword");
        }}
      >
        Forgot password
      </Link>
      {!isLoginEnabled && errors ? (
        <ValidationErrorAlert
          errors={errors}
          enableButton={enableLoginButton}
        />
      ) : (
        <></>
      )}
    </Grid>
  );
}

export default LoginView;
