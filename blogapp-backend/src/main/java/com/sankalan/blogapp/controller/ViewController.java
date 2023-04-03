package com.sankalan.blogapp.controller;

import com.sankalan.blogapp.model.Viewer;
import com.sankalan.blogapp.service.ViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/views")
@RequiredArgsConstructor
public class ViewController {
    private final ViewService viewService;

    @GetMapping("/unique/{postId}")
    public ResponseEntity<List<Long>> getUniqueUserIds(@PathVariable Long postId){
        List<Long> uniqueUserIds = viewService.getUniqueUserIdsByPostId(postId);
        return new ResponseEntity<>(uniqueUserIds, HttpStatus.OK);
    }


    @PostMapping("/add")
    public ResponseEntity<Viewer> addView(@RequestBody Viewer viewer){
        Viewer viewer1 = viewService.addView(viewer);
        return new ResponseEntity<>(viewer1, HttpStatus.OK);
    }
}
