package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Group;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Group entity.
 */
@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    default Optional<Group> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Group> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Group> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct jhiGroup from Group jhiGroup left join fetch jhiGroup.ceog",
        countQuery = "select count(distinct jhiGroup) from Group jhiGroup"
    )
    Page<Group> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct jhiGroup from Group jhiGroup left join fetch jhiGroup.ceog")
    List<Group> findAllWithToOneRelationships();

    @Query("select jhiGroup from Group jhiGroup left join fetch jhiGroup.ceog where jhiGroup.id =:id")
    Optional<Group> findOneWithToOneRelationships(@Param("id") Long id);
}
