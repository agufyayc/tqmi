package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Group.
 */
@Entity
@Table(name = "jhi_group")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Group implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "group_name", nullable = false)
    private String groupName;

    @JsonIgnoreProperties(value = { "cell" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Employee ceog;

    @OneToMany(mappedBy = "group")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "cells", "group" }, allowSetters = true)
    private Set<LegalEntity> legalEntities = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Group id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupName() {
        return this.groupName;
    }

    public Group groupName(String groupName) {
        this.setGroupName(groupName);
        return this;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Employee getCeog() {
        return this.ceog;
    }

    public void setCeog(Employee employee) {
        this.ceog = employee;
    }

    public Group ceog(Employee employee) {
        this.setCeog(employee);
        return this;
    }

    public Set<LegalEntity> getLegalEntities() {
        return this.legalEntities;
    }

    public void setLegalEntities(Set<LegalEntity> legalEntities) {
        if (this.legalEntities != null) {
            this.legalEntities.forEach(i -> i.setGroup(null));
        }
        if (legalEntities != null) {
            legalEntities.forEach(i -> i.setGroup(this));
        }
        this.legalEntities = legalEntities;
    }

    public Group legalEntities(Set<LegalEntity> legalEntities) {
        this.setLegalEntities(legalEntities);
        return this;
    }

    public Group addLegalEntity(LegalEntity legalEntity) {
        this.legalEntities.add(legalEntity);
        legalEntity.setGroup(this);
        return this;
    }

    public Group removeLegalEntity(LegalEntity legalEntity) {
        this.legalEntities.remove(legalEntity);
        legalEntity.setGroup(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Group)) {
            return false;
        }
        return id != null && id.equals(((Group) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Group{" +
            "id=" + getId() +
            ", groupName='" + getGroupName() + "'" +
            "}";
    }
}
