package com.troupe.backend.controller.member;

import com.troupe.backend.domain.avatar.*;
import com.troupe.backend.dto.avatar.response.*;
import com.troupe.backend.dto.converter.AvatarConverter;
import com.troupe.backend.service.member.AvatarService;
import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@Api("아바타 REST API")
@RequestMapping("/avatar")
@RestController
@RequiredArgsConstructor
public class AvatarController {
    private final AvatarService avatarService;

    @GetMapping("/clothes")
    private ResponseEntity getClothesList() {
        List<AvatarClothes> clothesList =  avatarService.findAllClothes();
        List<AvatarClothesResponse> response = AvatarConverter.getAvatarClothesResponseList(clothesList);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/eye")
    private ResponseEntity getEyeList() {
        List<AvatarEye> eyeList =  avatarService.findAllEye();
        List<AvatarEyeResponse> response = AvatarConverter.getAvatarEyeResponseList(eyeList);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/hair")
    private ResponseEntity getHairList() {
        List<AvatarHair> hairList =  avatarService.findAllHair();
        List<AvatarHairResponse> response = AvatarConverter.getAvatarHairResponseList(hairList);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/mouth")
    private ResponseEntity getMouthList() {
        List<AvatarMouth> mouthList =  avatarService.findAllMouth();
        List<AvatarMouthResponse> response = AvatarConverter.getAvatarMouthResponseList(mouthList);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/nose")
    private ResponseEntity getNoseList() {
        List<AvatarNose> noseList =  avatarService.findAllNose();
        List<AvatarNoseResponse> response = AvatarConverter.getAvatarNoseResponseList(noseList);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/shape")
    private ResponseEntity getShapeList() {
        List<AvatarShape> shapeList =  avatarService.findAllShape();
        List<AvatarShapeResponse> response = AvatarConverter.getAvatarShapeResponseList(shapeList);

        return new ResponseEntity(response, HttpStatus.OK);
    }
}
