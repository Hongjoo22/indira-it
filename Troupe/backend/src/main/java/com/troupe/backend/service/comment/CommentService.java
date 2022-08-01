package com.troupe.backend.service.comment;

import com.troupe.backend.domain.comment.Comment;
import com.troupe.backend.domain.feed.Feed;
import com.troupe.backend.domain.member.Member;
import com.troupe.backend.dto.comment.CommentForm;
import com.troupe.backend.dto.converter.CommentConverter;
import com.troupe.backend.repository.comment.CommentRepository;
import com.troupe.backend.repository.feed.FeedRepository;
import com.troupe.backend.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {
    @Autowired
    MemberRepository memberRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    FeedRepository feedRepository;

    @Autowired
    CommentConverter commentConverter;


    public  void insert(CommentForm request){
        try{
            Member member = memberRepository.findById(request.getMemberNo()).get();
            Feed feed = feedRepository.findById(request.getFeedNo()).get();
            LocalDateTime localDateTime = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
            Date now = java.sql.Timestamp.valueOf(localDateTime);
            Comment comment = null;
            if(request.getParentCommentNo()==0){
                Comment parentComment = commentRepository.findById(request.getParentCommentNo()).get();
                comment = Comment.builder().feed(feed).parentComment(parentComment).createdTime(now).member(member).build();
            }
            else{
                comment = Comment.builder().feed(feed).createdTime(now).member(member).build();
            }
            commentRepository.save(comment);
        }catch (Exception e){
            log.info(e.toString());
        }
    }

    public void update(CommentForm request){
        Optional<Comment> comment = commentRepository.findById(request.getCommentNo());

        if(comment.isPresent()){
            Comment updateComment = commentConverter.toEntity(request);
            commentRepository.save(updateComment);
        }else return;

    }
}
