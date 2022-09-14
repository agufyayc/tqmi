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
 * A LegalEntity.
 */
@Entity
@Table(name = "legal_entity")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LegalEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "legal_entity_name", nullable = false)
    private String legalEntityName;

    @Column(name = "street_address")
    private String streetAddress;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "city")
    private String city;

    @Column(name = "state_province")
    private String stateProvince;

    @OneToMany(mappedBy = "legalEntity")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bod", "ebod", "employees", "legalEntity" }, allowSetters = true)
    private Set<Cell> cells = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "ceog", "legalEntities" }, allowSetters = true)
    private Group group;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LegalEntity id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLegalEntityName() {
        return this.legalEntityName;
    }

    public LegalEntity legalEntityName(String legalEntityName) {
        this.setLegalEntityName(legalEntityName);
        return this;
    }

    public void setLegalEntityName(String legalEntityName) {
        this.legalEntityName = legalEntityName;
    }

    public String getStreetAddress() {
        return this.streetAddress;
    }

    public LegalEntity streetAddress(String streetAddress) {
        this.setStreetAddress(streetAddress);
        return this;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getPostalCode() {
        return this.postalCode;
    }

    public LegalEntity postalCode(String postalCode) {
        this.setPostalCode(postalCode);
        return this;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCity() {
        return this.city;
    }

    public LegalEntity city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateProvince() {
        return this.stateProvince;
    }

    public LegalEntity stateProvince(String stateProvince) {
        this.setStateProvince(stateProvince);
        return this;
    }

    public void setStateProvince(String stateProvince) {
        this.stateProvince = stateProvince;
    }

    public Set<Cell> getCells() {
        return this.cells;
    }

    public void setCells(Set<Cell> cells) {
        if (this.cells != null) {
            this.cells.forEach(i -> i.setLegalEntity(null));
        }
        if (cells != null) {
            cells.forEach(i -> i.setLegalEntity(this));
        }
        this.cells = cells;
    }

    public LegalEntity cells(Set<Cell> cells) {
        this.setCells(cells);
        return this;
    }

    public LegalEntity addCell(Cell cell) {
        this.cells.add(cell);
        cell.setLegalEntity(this);
        return this;
    }

    public LegalEntity removeCell(Cell cell) {
        this.cells.remove(cell);
        cell.setLegalEntity(null);
        return this;
    }

    public Group getGroup() {
        return this.group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public LegalEntity group(Group group) {
        this.setGroup(group);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LegalEntity)) {
            return false;
        }
        return id != null && id.equals(((LegalEntity) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LegalEntity{" +
            "id=" + getId() +
            ", legalEntityName='" + getLegalEntityName() + "'" +
            ", streetAddress='" + getStreetAddress() + "'" +
            ", postalCode='" + getPostalCode() + "'" +
            ", city='" + getCity() + "'" +
            ", stateProvince='" + getStateProvince() + "'" +
            "}";
    }
}
