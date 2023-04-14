package com.sankalan.blogapp.service;

import com.sankalan.blogapp.model.Viewer;
import com.sankalan.blogapp.repo.ViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ViewService {
    @Autowired
    private final ViewRepository viewRepository;

    public List<Long> getUniqueUserIdsByPostId(Long postId) {
        List<Long> uniqueUserIds = viewRepository.findDistinctUserIdByPostId(postId);
        return uniqueUserIds;
    }

    public Viewer addView(Viewer viewer) {
        return viewRepository.save(viewer);
    }


}
