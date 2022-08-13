import React from "react";
import { useParams } from "react-router-dom";
import apiClient from "../apiClient";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";

import MainPerf from "./MainPerf";
import MainFeed from "./MainFeed";
import ProfileMemberInfo from "./ProfileMemberInfo";
import ProfileAnalyze from "./ProfileAnalyze";
import ProfileTabs from "./ProfileTabs";
import ProfileStage from "./ProfileStage";
import Avatar from "./Avatar";
import Theme from "./Theme";

function Profile(props) {
  //memberNo
  const { memberNo } = useParams();
  //이 member의 아바타
  const [avatar, setAvatar] = React.useState("");

  //화면 width에 따른 화면분할여부
  const [gridItemxs, setGridItemxs] = React.useState(
    window.innerWidth < 1000 ? 12 : 6,
  );

  //memberInfo 초기화
  const [memberInfo, setMemberInfo] = React.useState("");
  //memberInfo 화면분할 update 시 불러오기
  React.useEffect(() => {
    apiClient.getMemberInfo(memberNo).then((data) => {
      setMemberInfo(data);
    });
  }, [memberNo]);

  //공연자/일반 판단 초기화
  const [performer, setPerformer] = React.useState(false);
  //공연자/일반 판단 memberInfo update 시 update
  React.useEffect(() => {
    setPerformer(memberInfo.memberType === "PERFORMER");
  }, [memberInfo]);

  // 자신의 유저페이지인지 판단 초기화
  const [myPage, setMypage] = React.useState(false);
  // 자신의 유저페이지인지 판단 update
  React.useEffect(() => {
    setMypage(sessionStorage.getItem("loginMember") === memberNo);
  }, [sessionStorage.getItem("loginMember"), memberNo]);

  //member Avatar update
  React.useEffect(() => {
    if (!memberNo) {
      return;
    }
    apiClient.getMemberAvatar(memberNo).then((data) => {
      console.log(data);
      setAvatar(data);
    });
  }, [memberNo]);

  //1000보다 큰경우 2화면분할
  const handleGrid = () => {
    const size = window.innerWidth;
    if (size < 1000) {
      setGridItemxs(12);
    } else {
      setGridItemxs(6);
    }
  };
  //화면분할 update
  React.useEffect(() => {
    window.addEventListener("resize", handleGrid);
  }, [window.innerWidth]);

  const tabContent = performer
    ? [
        <MainPerf memberInfo={memberInfo} />,
        <MainFeed memberInfo={memberInfo} />,
        <MainPerf memberInfo={memberInfo} save={true} />,
        <MainFeed memberInfo={memberInfo} save={true} />,
      ]
    : [
        <MainPerf memberInfo={memberInfo} save={true} />,
        <MainFeed memberInfo={memberInfo} save={true} />,
      ];
  const tabText = performer
    ? ["공연/전시 목록", "피드 목록", "공연/전시 북마크", "피드 북마크"]
    : ["공연/전시 북마크", "피드 북마크"];

  const modifyAvatar = () => {
    window.location.href = `/profile/${memberNo}/modify-avatar`;
  };
  return (
    <ThemeProvider theme={Theme}>
      <Container component="main" maxWidth="1920px">
        <Grid
          container
          spacing={2}
          style={{ textAlign: "center", fontFamily: "SBAggroB" }}
        >
          <Grid
            item
            container
            alignItems="flex-end"
            xs={gridItemxs}
            style={{
              backgroundColor: "gray",
              paddingRight: 20,
              paddingBottom: 50,
              position: "relative",
            }}
          >
            {/* Stage start */}
            <ProfileStage />
            <Button
              onClick={modifyAvatar}
              style={{
                display: "flex",
                left: "25%",
                top: "-67%",
              }}
            >
              <Avatar
                avatarResponse={avatar}
                imgWidth={75 * 4}
                imgHeight={100 * 4}
                divWidth={"100%"}
                divHeight={"100%"}

                // style={{
                //   position: "absolute",
                //   display: "flex",
                //   justifyContent: "center",
                //   alignItems: "center",
                // }}
              />
            </Button>
            {/* Stage finish */}
          </Grid>
          <Grid item xs={gridItemxs} style={{ padding: 0 }}>
            <Grid container spacing={3}>
              {
                //프로필
              }
              <Grid item xs={12}>
                <ProfileMemberInfo
                  width="100%"
                  memberInfo={memberInfo}
                  myPage={myPage}
                />
              </Grid>
              {
                //개인분석
              }
              <Grid item xs={12}>
                <ProfileAnalyze
                  width="100%"
                  nickname={memberInfo.nickname}
                  performer={performer}
                  myPage={myPage}
                />
              </Grid>
            </Grid>
          </Grid>
          {
            //공연/전시, 피드 목록
          }
          <Grid item xs={12} style={{ padding: 0, paddingTop: "30px" }}>
            <ProfileTabs tabContent={tabContent} tabText={tabText} />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
export default Profile;
