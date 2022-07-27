package com.troupe.backend.repository.member;

import com.troupe.backend.domain.member.Member;
import com.troupe.backend.domain.member.MemberType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class MemberRepositoryTest {
    @Autowired
    MemberRepository memberRepository;

    /** 저장, 조회 테스트 */
    @Test
    public void saveAndFindTest() {
        Member savedMember = memberRepository.save(new Member("doyoung"));

        // 저장한 회원 조회
        assertThat(savedMember.getEmail()).isEqualTo("email");
        assertThat(savedMember.getPassword()).isEqualTo("password");
        assertThat(savedMember.getNickname()).isEqualTo("doyoung");
        assertThat(savedMember.getDescription()).isEqualTo("description");
        assertThat(savedMember.getMemberType()).isEqualTo(MemberType.AUDIENCE);
        assertThat(savedMember.isRemoved()).isEqualTo(false);
        assertThat(savedMember.getClothes().getClothesNo()).isEqualTo(1);
        assertThat(savedMember.getEye().getEyeNo()).isEqualTo(1);
        assertThat(savedMember.getHair().getHairNo()).isEqualTo(1);
        assertThat(savedMember.getMouth().getMouthNo()).isEqualTo(1);
        assertThat(savedMember.getNose().getNoseNo()).isEqualTo(1);
        assertThat(savedMember.getShape().getShapeNo()).isEqualTo(1);

        // 저장하지 않은 회원 조회
        assertThat(memberRepository.findByNickname("invalidNickname").isPresent()).isEqualTo(false);
    }

    /** 저장, 수정 테스트 */
    @Test
    public void saveAndUpdateTest() {
        // 회원 저장
        Member savedMember = memberRepository.save(new Member("oldNick"));

        // 저장된 회원 수정
        savedMember.setNickname("newNick");
        savedMember.setPassword("newPW");
        savedMember.setMemberType(MemberType.PERFORMER);

        // 수정 내역 반영되었는지 조회
        Member foundMember = memberRepository.findByNickname("newNick").get();
        assertThat(foundMember.getPassword()).isEqualTo("newPW");
        assertThat(foundMember.getMemberType()).isEqualTo(MemberType.PERFORMER);

        // 기존 닉네임은 DB에 없는지 확인
        assertThat(memberRepository.findByNickname("oldNick").isPresent()).isEqualTo(false);
    }

    /** 저장, 삭제 테스트 */
    @Test
    public void saveAndDeleteTest() {
        // 회원 등록
        Member savedMember = memberRepository.save(new Member("hello"));
        assertThat(memberRepository.findByNickname("hello").isPresent()).isEqualTo(true);

        // 회원 삭제
        memberRepository.delete(savedMember);
        assertThat(memberRepository.findByNickname("hello").isPresent()).isEqualTo(false);
    }
}
