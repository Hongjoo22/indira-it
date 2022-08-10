import { type } from "@testing-library/user-event/dist/type";
import instance from "axios";

// const instance = axios.create({
//   baseURL: process.env.REACT_APP_MAGAZINE_API_BASE_URL,
// });

const apiClient = {
  //로그인
  login: (loginInfo) => {
    return instance
      .post("/member/login", loginInfo)
      .then((response) => {
        window.sessionStorage.setItem("loginCheck", true);
        window.sessionStorage.setItem("loginMember", response.data.memberNo);
        window.sessionStorage.setItem("accessToken", response.data.accessToken);
        alert("로그인 되었습니다.");
        const href = sessionStorage.getItem("currentHref");
        sessionStorage.removeItem("currentHref");
        window.location.href = href;
        return true;
      })
      .catch((error) => {
        alert("로그인 실패 : " + error);
        alert(error.response.status);
        if (error.response.status === 401) {
          window.location.href = "/email";
        }
        return false;
      });
  },
  //회원가입
  signup: (data) => {
    return instance
      .post("/member/signup", data)
      .then((response) => {
        alert("회원가입 되었습니다." + response.data);
        window.location.href = "/email";
        return true;
      })
      .catch((error) => {
        alert("회원가입 실패 : " + error);
        return false;
      });
  },
  //reset pw
  requestPassword: (data) => {
    instance
      .post("/member/request-password", data)
      .then((response) => {
        console.log(response);
        alert(
          "비밀번호 초기화를 위해 이메일을 전송하였습니다." + response.data
        );
      })
      .catch((error) => {
        alert("비밀번호 초기화 실패 : " + error);
      });
  },
  //프로필수정
  modifyProfile: (data) => {
    instance
      .patch("/member/myinfo", data, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        alert("프로필수정 되었습니다." + response.data);
      })
      .catch((error) => {
        alert("프로필수정 실패 : " + error);
      });
  },

  //이메일 중복체크
  existEmail: (data) => {
    return instance
      .post("/member/signup/email", data)
      .then((response) => {
        alert("사용 가능합니다." + response.data);
        return false;
      })
      .catch((error) => {
        const status = error.response.status;
        if (status === 500) {
          alert("server Error : " + error);
          return error;
        } else if (status === 409) {
          alert("중복된 e-mail 입니다 : " + error);
          return true;
        }
      });
  },

  //닉네임 중복체크
  existNickname: (data) => {
    return instance
      .post("/member/signup/nickname", data)
      .then((response) => {
        alert("사용 가능합니다." + response.data);
        return false;
      })
      .catch((error) => {
        const status = error.response.status;
        if (status === 500) {
          alert("server Error : " + error);
          return error;
        } else if (status === 409) {
          alert("중복된 nickname 입니다 : " + error);
          return true;
        }
      });
  },

  //현재 비밀번호 일치 확인
  pwCurrentCheck: (data) => {
    return instance
      .post(`/member/pw`, data, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log("pwCurrentCheck : " + response.data);
        return response.data;
      })
      .catch((error) => {
        alert("pwCurrentCheck 정보를 불러오는데 실패하였습니다 : " + error);
        return null;
      });
  },

  //팔로워 수 확인
  getFollowerCount: (profileMemberNo) => {
    return instance
      .get(`/profile/${profileMemberNo}/follow/fans/count`)
      .then((response) => {
        console.log("fanCount : " + response.data.fanCount);
        return response.data;
      })
      .catch((error) => {
        alert("FollowerCount 정보를 불러오는데 실패하였습니다 : " + error);
        return null;
      });
  },

  //팔로우 여부 확인
  isFollowing: (data) => {
    const profileMemberNo = data.profileMemberNo;
    console.log(data);
    console.log(profileMemberNo);
    return instance
      .get(`/profile/${profileMemberNo}/follow`, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log("isFollowing : " + response.data.isFollowing);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        alert("isFollowing 정보를 불러오는데 실패하였습니다 : " + error);
        return { isFollowing: false };
      });
  },

  //팔로우 언팔로우 클릭
  follow: (data) => {
    console.log(data);
    console.log(sessionStorage.getItem("accessToken"));
    return data.currentFollow
      ? instance
          .delete(`/profile/${parseInt(data.profileMemberNo)}/follow`, {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          })
          .then((response) => {
            alert("팔로우 취소하였습니다" + response.data);
            return true;
          })
          .catch((error) => {
            console.log(error);
            alert(" 팔로우 취소실패 : " + error);
            return false;
          })
      : instance
          .post(
            `/profile/${parseInt(data.profileMemberNo)}/follow`,
            {},
            {
              headers: {
                accessToken: sessionStorage.getItem("accessToken"),
              },
            }
          )
          .then((response) => {
            alert("팔로우 하였습니다." + response.data);
            return true;
          })
          .catch((error) => {
            console.log(error);
            alert(" 팔로우실패 : " + error);
            return false;
          });
  },

  //내정보 불러오기
  getMyinfo: () => {
    return instance
      .get(`/member/myinfo`, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        alert("Member 정보를 불러오는데 실패하였습니다 : " + error);
        return null;
      });
  },

  //회원정보 불러오기
  getMemberInfo: (memberNo) => {
    return instance
      .get(`/member/${parseInt(memberNo)}`)
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        alert("Member 정보를 불러오는데 실패하였습니다 : " + error);
        return null;
      });
  },

  //관심태그 불러오기
  getInterestTag: (memberNo) => {
    return instance
      .get(`/profile/${memberNo}/interest/tag`)
      .then((response) => {
        console.log(response.data);
        alert("category : " + response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        alert("category 정보를 불러오는데 실패하였습니다 : " + error);
        return null;
      });
  },

  //관심카테고리 불러오기
  getInterestCategory: (memberNo) => {
    return instance
      .get(`/profile/${memberNo}/interest/category`)
      .then((response) => {
        console.log(response.data);
        alert("category : " + response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        alert("category 정보를 불러오는데 실패하였습니다 : " + error);
        return null;
      });
  },

  //호감도 순위정보
  getLikeabilityData: (memberNo) => {
    return instance
      .get(`/profile/${memberNo}/likability/topstars/`)
      .then((response) => {
        alert("likability data : " + response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        alert("likability data를 불러오는데 실패하였습니다 : " + error);
        return null;
      });
  },

  //공연 삭제하기
  perfRemove: (data) => {
    if (window.confirm("삭제하시겠습니까?")) {
      instance
        .delete(`/perf/${data.pfNo}/del`)
        .then((response) => {
          alert("공연이 삭제되었습니다" + response);
        })
        .catch((error) => {
          alert(data + "공연삭제 실패 :" + error);
        });
    } else {
      alert("취소합니다.");
    }
  },

  //공연 등록
  perfNew: (data) => {
    instance
      .post("/perf", data)
      .then((response) => {
        alert("공연등록 되었습니다." + response);
      })
      .catch((error) => {
        alert("공연등록 실패 : " + error);
      });
  },

  //공연 목록 불러오기
  getPerfList: async (pageNumber) => {
    return await instance
      .get(`/perf/list?pageNumber=${pageNumber}`)
      .then((response) => {
        // alert("공연 불러오기 성공");
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        alert("공연 불러오기 실패" + error);
      });
  },

  //피드 목록 불러오기
  getFeedList: () => {
    instance
      .get("/feed/list")
      .then((response) => {
        alert("불러오기 성공");
        return response;
      })
      .catch((error) => {
        alert("피드 불러오기 실패" + error);
        return null;
      });
  },
  //호감도 공연자 Top3
  getPerformerTop3: (data) => {
    return instance
      .get(`/profile/${parseInt(data.profileMemberNo)}/likability/topstars`)
      .then((response) => {
        alert("호감도 공연자 Top3 불러오기 성공");
        return response.data;
      })
      .catch((error) => {
        alert("호감도 공연자 Top3 불러오기 실패" + error);
        return null;
      });
  },

  //공연자에 대한 나의 호감도 data
  getMyLikeabilityData: (data) => {
    return instance
      .get(`/profile/${parseInt(data.profileMemberNo)}/likability`, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(response.data);
        alert("공연자에 대한 나의 호감도 data 불러오기 성공");
        return response.data;
      })
      .catch((error) => {
        alert("공연자에 대한 나의 호감도 data 불러오기 실패" + error);
        return null;
      });
  },

  //피드 등록
  feedNew: (data) => {
    instance
      .post("/feed", data, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("피드 등록 성공");
        return response;
      })
      .catch((error) => {
        alert("피드 등록 실패" + error);
        return error;
      });
  },

  feedModify: (data, feedNo) => {
    instance
      .post(`/feed/${feedNo}/modify`, data, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("피드 수정 성공");
        return response;
      })
      .catch((error) => {
        alert("피드 수정 실패" + error);
        return error;
      });
  },
  getFeedDetail: (feedNo) => {
    return instance
      .get(`/feed/${feedNo}`, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        // console.log(response.data);
        // alert("피드 상세 불러오기 성공");
        return response.data;
      })
      .catch((error) => {
        alert("피드 상세 불러오기 실패" + error);
        return error;
      });
  },

  getFeedTotalLike: (feedNo) => {
    return instance
      .get(`/feed/${feedNo}/like`)
      .then((response) => {
        // console.log(response.data);
        // alert("피드 좋아요 수 불러오기 성공");
        return response.data;
      })
      .catch((error) => {
        alert("피드 좋아요 수 불러오기 실패" + error);
        return error;
      });
  },

  //피드 목록 테스트용(후에 삭제)
  getFeedTest: () => {
    // const change = data.change;
    // const pageNumber = data.pageNumber;
    return instance
      .get(`/feed/list/all?pageNumber=0`)
      .then((response) => {
        console.log(response.data);
        alert("피드 불러오기 성공");
        return response.data;
      })
      .catch((error) => {
        alert("피드 불러오기 실패" + error);
        return null;
      });
  },

  //피드 검색 테스트용(후에 삭제)
  getFeedSearchTest: (data) => {
    return instance
      .get(`/feed/search?pageNumber=0`, {
        params: {
          tags: data,
        },
      })
      .then((response) => {
        console.log(response.data);
        alert("피드 검색 불러오기 성공");
        return response.data;
      })
      .catch((error) => {
        alert("피드 검색 불러오기 실패" + error);
        return error;
      });
  },

  feedRemove: (feedNo) => {
    if (window.confirm("삭제하시겠습니까?")) {
      instance
        .patch(`/feed/${feedNo}/del`)
        .then((response) => {
          alert("피드가 삭제되었습니다" + response);
          window.location.href = "/feed/list";
        })
        .catch((error) => {
          alert("피드 삭제 실패 :" + error + feedNo);
          return error;
        });
    } else {
      alert("취소합니다.");
    }
  },
  //  공연 후기 등록
  perfCommentNew: (performanceNo, data, refreshFunction) => {
    instance
      .post(`/perf/${performanceNo}/review`, data, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        alert("댓글 등록 성공");
        console.log(response.data);
        refreshFunction(response.data);
      })
      .catch((error) => {
        alert("댓글 등록 실패 : " + error);
      });
  },

  //  공연 후기 목록 불러오기(완성)
  getPerfCommentList: (performanceNo) => {
    return instance
      .get(`/perf/${performanceNo}/review/list`)
      .then((response) => {
        alert("불러오기 성공");
        // console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        alert("공연 후기 불러오기 실패" + error);
        return null;
      });
  },
};

export default apiClient;
