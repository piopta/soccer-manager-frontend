import { ChangeEvent, useState } from "react";
import {
  FormControl,
  FilledInput,
  InputLabel,
  Typography,
  Grid,
  Button,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BiSad } from "react-icons/bi";
import axios, { AxiosError } from "axios";
import { useMutation as useReactMutation } from "@tanstack/react-query";
import InfoAlert from "../InfoAlert";
import ValidationErrorAlert from "../ValidationErrorAlert";

const forgotPasswordUrl = `${
  import.meta.env.VITE_AUTH_BACKEND_URL
}/forgotPassword`;

function ForgotPasswordView() {
  const [email, setEmail] = useState<string>("");
  const [response, setResponse] = useState<string>();
  const [errors, setErrors] = useState<string>("");
  const navigate = useNavigate();

  const { mutateAsync } = useReactMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: async (email: string) => {
      try {
        const res = await axios.post(
          forgotPasswordUrl,
          {
            email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setEmail("");
        return res.data;
      } catch (ex) {
        if (ex instanceof AxiosError) {
          setErrors(ex.response?.data);
        }
      }
    },
  });

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLinkClick = (address: string) => {
    navigate(address);
  };

  const handleClick = async () => {
    const res = await mutateAsync(email);
    setResponse(res.message);
  };

  return (
    <Grid container flexDirection="column" rowGap="1rem" maxWidth="768px">
      <Typography variant="h6">Forgot password</Typography>
      <FormControl>
        <InputLabel>Email</InputLabel>
        <FilledInput
          type="email"
          value={email}
          onChange={onEmailChange}
          required
        ></FilledInput>
      </FormControl>

      <Button variant="contained" onClick={handleClick} startIcon={<BiSad />}>
        Forgot password
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
          handleLinkClick("/login");
        }}
      >
        Click here to login
      </Link>
      {response && <InfoAlert messages={[response]} />}
      {errors ? <ValidationErrorAlert errors={errors} /> : <></>}
    </Grid>
  );
}

export default ForgotPasswordView;
