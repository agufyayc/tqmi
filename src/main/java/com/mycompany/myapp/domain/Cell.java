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
 * A Cell.
 */
@Entity
@Table(name = "cell")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Cell implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "cell_name", nullable = false)
    private String cellName;

    @JsonIgnoreProperties(value = { "cell" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Employee bod;

    @JsonIgnoreProperties(value = { "cell" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Employee ebod;

    @OneToMany(mappedBy = "cell")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "cell" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "cells", "group" }, allowSetters = true)
    private LegalEntity legalEntity;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Cell id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCellName() {
        return this.cellName;
    }

    public Cell cellName(String cellName) {
        this.setCellName(cellName);
        return this;
    }

    public void setCellName(String cellName) {
        this.cellName = cellName;
    }

    public Employee getBod() {
        return this.bod;
    }

    public void setBod(Employee employee) {
        this.bod = employee;
    }

    public Cell bod(Employee employee) {
        this.setBod(employee);
        return this;
    }

    public Employee getEbod() {
        return this.ebod;
    }

    public void setEbod(Employee employee) {
        this.ebod = employee;
    }

    public Cell ebod(Employee employee) {
        this.setEbod(employee);
        return this;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public void setEmployees(Set<Employee> employees) {
        if (this.employees != null) {
            this.employees.forEach(i -> i.setCell(null));
        }
        if (employees != null) {
            employees.forEach(i -> i.setCell(this));
        }
        this.employees = employees;
    }

    public Cell employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public Cell addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setCell(this);
        return this;
    }

    public Cell removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setCell(null);
        return this;
    }

    public LegalEntity getLegalEntity() {
        return this.legalEntity;
    }

    public void setLegalEntity(LegalEntity legalEntity) {
        this.legalEntity = legalEntity;
    }

    public Cell legalEntity(LegalEntity legalEntity) {
        this.setLegalEntity(legalEntity);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cell)) {
            return false;
        }
        return id != null && id.equals(((Cell) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cell{" +
            "id=" + getId() +
            ", cellName='" + getCellName() + "'" +
            "}";
    }
}
