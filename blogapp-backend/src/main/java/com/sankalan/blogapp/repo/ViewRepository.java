package com.sankalan.blogapp.repo;

import com.sankalan.blogapp.model.Viewer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ViewRepository extends JpaRepository<Viewer, Long> {
    @Query("SELECT DISTINCT v.userId FROM Viewer v WHERE v.postId = :postId")
    List<Long> findDistinctUserIdByPostId(@Param("postId") Long postId);
}
