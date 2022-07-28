package com.troupe.backend.domain.avatar;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "tb_avatar_clothes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class AvatarClothes implements Serializable {
    @Id
    private Integer clothesNo;

    private String clothesUrl;
}
