package com.sankalan.blogapp.controller;

import com.sankalan.blogapp.model.Post;
import com.sankalan.blogapp.service.PostService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Post>> getAllPosts(){
        List<Post> posts = postService.findAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/all/sortedBy/{field}")
    public ResponseEntity<List<Post>> getAllPosts(@PathVariable String field){
        List<Post> posts = postService.findPostsBySorting(field);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/findByPostId/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable("id") Long id){
        Post post = postService.findPostById(id);
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @GetMapping("/findByUserId/{id}")
    @Transactional
    public ResponseEntity<List<Post>> getPostByUserId(@PathVariable("id") Long id){
        List<Post> post = postService.findPostByUserId(id);
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Post> addPost(@RequestBody Post post){
        Post post2 = postService.createPost(post);
        return new ResponseEntity<>(post2, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable("id") Long id, @RequestBody Post post){
        Post existingPost = postService.findPostById(id);
        if (existingPost == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        existingPost.setTitle(post.getTitle());
        existingPost.setContent(post.getContent());
        existingPost.setUpdatedOn(post.getUpdatedOn());
        Post updatedPost = postService.updatePost(existingPost);
        return new ResponseEntity<>(updatedPost, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePost(@PathVariable("id") Long id){
        postService.deletePost(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
