package com.sankalan.blogapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Viewer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long viewId;
    private Long postId;
    private Long userId;
    private String viewedOn;
}
