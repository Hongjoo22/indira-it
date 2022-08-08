import apiClient from "../apiClient";
import React from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import styledButton from "../css/button.module.css";

const theme = createTheme();

export default function Signup() {
  //frontend image update
  const [imgUrl, setImgUrl] = React.useState("");
  //nickname update
  const [nickname, setNickname] = React.useState("");
  //nickname 중복확인
  const [nicknameCheck, setNicknameCheck] = React.useState(false);
  //email update
  const [email, setEmail] = React.useState("");
  //email 중복확인
  const [emailCheck, setEmailCheck] = React.useState(false);
  //nickname 길이확인
  const [nicknameLength, setNicknameLength] = React.useState(true);
  //password 길이확인
  const [pwLength, setPwLength] = React.useState(true);
  //password 일치확인
  const [pwSame, setPwSame] = React.useState(true);

  //image 업로드
  const changeImage = (e) => {
    setImgUrl(URL.createObjectURL(e.target.files[0]));
  };

  //nickname Change
  const changeNickname = (e) => {
    setNickname(e.target.value);
    setNicknameCheck(false);
  };

  //email Change
  const changeEmail = (e) => {
    setEmail(e.target.value);
    setEmailCheck(false);
  };

  //중복체크
  const sameCheck = (string) => {
    if (string === "email") {
      if (emailCheck) {
        alert("email 중복확인이 이미 완료되었습니다.");
        return;
      }
      apiClient.existEmail({ email: email }).then((data) => {
        if (data === false) {
          setEmailCheck(true);
        } else {
          console.log("emailCheck : " + data);
        }
      });
    } else if (string === "nickname") {
      if (nicknameCheck) {
        alert("nickname 중복확인이 이미 완료되었습니다.");
        return;
      }
      apiClient.existNickname({ nickname: nickname }).then((data) => {
        if (data === false) {
          setNicknameCheck(true);
        } else {
          console.log("nicknameCheck : " + data);
        }
      });
      //닉네임 2~20자
      const nicknameLength = nickname.length;
      const nicknameLengthCheck = nicknameLength >= 2 && nicknameLength <= 20;
      setNicknameLength(nicknameLengthCheck);
    }
  };

  //입력된 값이 올바른지 확인
  const checkValue = (data) => {
    //닉네임 2~20자
    const nicknameLength = data.nickname.length;
    const nicknameCheck = nicknameLength >= 2 && nicknameLength <= 20;
    setNicknameLength(nicknameCheck);
    //password 8~20자
    const pwLength = data.password.length;
    const pwCheck = pwLength >= 8 && pwLength <= 20;
    setPwLength(pwCheck);
    //paswword 일치확인
    const pwSame = data.password === data.passwordCheck;
    setPwSame(pwSame);

    return nicknameCheck && pwCheck && pwSame;
  };

  //회원가입버튼 클릭
  const handleSubmit = (event) => {
    if (!emailCheck || !nicknameCheck) {
      return;
    }

    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(event.currentTarget);
    console.log(formData.values);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      nickname: formData.get("nickname"),
      profileImage: formData.get("profileImage"),
      passwordCheck: formData.get("passwordCheck"),
      profileMessage: formData.get("profileMessage"),
    };
    console.log(formData);

    //입력된 값이 올바른지 확인
    if (!checkValue(data)) {
      return;
    }
    apiClient.signup(formData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            style={{ textAlign: "center" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={9}>
                {imgUrl === "" ? (
                  <AccountCircleIcon
                    fontSize="large"
                    sx={{ fontSize: "100px" }}
                  ></AccountCircleIcon>
                ) : (
                  <img
                    src={imgUrl}
                    alt=""
                    style={{
                      objectFit: "cover",
                      width: "100px",
                      height: "100px",
                      borderRadius: "40%",
                    }}
                  ></img>
                )}
              </Grid>
              <Grid item xs={3} style={{ position: "relative" }}>
                <Button
                  style={{
                    position: "absolute",
                    width: "80px",
                    height: "30px",
                    bottom: "0px",
                    right: "0px",
                    backgroundColor: "#CCCCCC",
                    color: "black",
                  }}
                >
                  찾아보기
                </Button>
                <input
                  style={{
                    position: "absolute",
                    width: "80px",
                    height: "30px",
                    bottom: "0px",
                    right: "0px",
                    opacity: "0%",
                  }}
                  id="profileImage"
                  className="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={changeImage}
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  autoComplete="given-name"
                  name="nickname"
                  required
                  fullWidth
                  id="nickname"
                  label="닉네임"
                  onChange={changeNickname}
                />
              </Grid>
              <Grid item xs={3} style={{ position: "relative" }}>
                <Button
                  style={{
                    position: "absolute",
                    width: "80px",
                    height: "30px",
                    bottom: "0px",
                    right: "0px",
                    backgroundColor: "#CCCCCC",
                    color: "black",
                  }}
                  onClick={() => sameCheck("nickname")}
                >
                  중복확인
                </Button>
              </Grid>
              {nicknameCheck ? (
                <Grid item xs={12}>
                  <div style={{ color: "green" }}>nickname 중복확인 완료</div>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <div style={{ color: "red" }}>nickname 중복확인이 필요합니다.</div>
                </Grid>
              )}
              {nicknameLength ? (
                <div></div>
              ) : (
                <Grid item xs={12}>
                  <div style={{ color: "red" }}>
                    닉네임은 2~20자의 길이로 설정해주세요.
                  </div>
                </Grid>
              )}
              <Grid item xs={9}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={changeEmail}
                />
              </Grid>
              <Grid item xs={3} style={{ position: "relative" }}>
                <Button
                  style={{
                    position: "absolute",
                    width: "80px",
                    height: "30px",
                    bottom: "0px",
                    right: "0px",
                    backgroundColor: "#CCCCCC",
                    color: "black",
                  }}
                  onClick={() => sameCheck("email")}
                >
                  중복확인
                </Button>
              </Grid>
              {emailCheck ? (
                <Grid item xs={12}>
                  <div style={{ color: "green" }}>email 중복확인 완료</div>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <div style={{ color: "red" }}>email 중복확인이 필요합니다.</div>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="비밀번호"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  autoFocus
                />
              </Grid>
              {pwLength ? (
                <div></div>
              ) : (
                <Grid item xs={12}>
                  <div style={{ color: "red" }}>
                    비밀번호는 8~20자의 길이로 설정해주세요.
                  </div>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordCheck"
                  label="비밀번호 확인"
                  type="password"
                  id="passwordCheck"
                  autoComplete="new-password"
                />
              </Grid>
              {pwSame ? (
                <div></div>
              ) : (
                <Grid item xs={12}>
                  <div style={{ color: "red" }}>
                    비밀번호가 일치하지 않습니다.
                  </div>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  id="description"
                  label="소개글 입력"
                  name="description"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  required
                  control={
                    <Checkbox defaultValue="allowExtraEmails" color="primary" />
                  }
                  label="이메일 전송에 동의합니다."
                />
              </Grid>
            </Grid>
            <div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    로그인
                  </Link>
                </Grid>
              </Grid>
            </div>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
