package com.sankalan.blogapp.service;

import com.sankalan.blogapp.model.Post;
import com.sankalan.blogapp.repo.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> findAllPosts(){
        return postRepository.findAll();
    }
    public List<Post> findPostsBySorting(String field){
        return postRepository.findAll(Sort.by(Sort.Direction.DESC,field));
    }

    public Post findPostById(Long id){
        Optional<Post> postOptional = postRepository.findById(id);
        return postOptional.orElse(null);
    }

    public List<Post> findPostByUserId(Long id){
        return postRepository.findByUserId(id);

    }

    public Post createPost(Post post){
        return postRepository.save(post);
    }

    public Post updatePost(Post post){
        return postRepository.save(post);
    }

    public void deletePost(Long id){
        postRepository.deleteById(id);
    }


}
