package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.LegalEntity;
import com.mycompany.myapp.repository.LegalEntityRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LegalEntityResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class LegalEntityResourceIT {

    private static final String DEFAULT_LEGAL_ENTITY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LEGAL_ENTITY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_STREET_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_STREET_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_POSTAL_CODE = "AAAAAAAAAA";
    private static final String UPDATED_POSTAL_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_STATE_PROVINCE = "AAAAAAAAAA";
    private static final String UPDATED_STATE_PROVINCE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/legal-entities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LegalEntityRepository legalEntityRepository;

    @Mock
    private LegalEntityRepository legalEntityRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLegalEntityMockMvc;

    private LegalEntity legalEntity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LegalEntity createEntity(EntityManager em) {
        LegalEntity legalEntity = new LegalEntity()
            .legalEntityName(DEFAULT_LEGAL_ENTITY_NAME)
            .streetAddress(DEFAULT_STREET_ADDRESS)
            .postalCode(DEFAULT_POSTAL_CODE)
            .city(DEFAULT_CITY)
            .stateProvince(DEFAULT_STATE_PROVINCE);
        return legalEntity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LegalEntity createUpdatedEntity(EntityManager em) {
        LegalEntity legalEntity = new LegalEntity()
            .legalEntityName(UPDATED_LEGAL_ENTITY_NAME)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE);
        return legalEntity;
    }

    @BeforeEach
    public void initTest() {
        legalEntity = createEntity(em);
    }

    @Test
    @Transactional
    void createLegalEntity() throws Exception {
        int databaseSizeBeforeCreate = legalEntityRepository.findAll().size();
        // Create the LegalEntity
        restLegalEntityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(legalEntity)))
            .andExpect(status().isCreated());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeCreate + 1);
        LegalEntity testLegalEntity = legalEntityList.get(legalEntityList.size() - 1);
        assertThat(testLegalEntity.getLegalEntityName()).isEqualTo(DEFAULT_LEGAL_ENTITY_NAME);
        assertThat(testLegalEntity.getStreetAddress()).isEqualTo(DEFAULT_STREET_ADDRESS);
        assertThat(testLegalEntity.getPostalCode()).isEqualTo(DEFAULT_POSTAL_CODE);
        assertThat(testLegalEntity.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testLegalEntity.getStateProvince()).isEqualTo(DEFAULT_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void createLegalEntityWithExistingId() throws Exception {
        // Create the LegalEntity with an existing ID
        legalEntity.setId(1L);

        int databaseSizeBeforeCreate = legalEntityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLegalEntityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(legalEntity)))
            .andExpect(status().isBadRequest());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLegalEntityNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = legalEntityRepository.findAll().size();
        // set the field null
        legalEntity.setLegalEntityName(null);

        // Create the LegalEntity, which fails.

        restLegalEntityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(legalEntity)))
            .andExpect(status().isBadRequest());

        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLegalEntities() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        // Get all the legalEntityList
        restLegalEntityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(legalEntity.getId().intValue())))
            .andExpect(jsonPath("$.[*].legalEntityName").value(hasItem(DEFAULT_LEGAL_ENTITY_NAME)))
            .andExpect(jsonPath("$.[*].streetAddress").value(hasItem(DEFAULT_STREET_ADDRESS)))
            .andExpect(jsonPath("$.[*].postalCode").value(hasItem(DEFAULT_POSTAL_CODE)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].stateProvince").value(hasItem(DEFAULT_STATE_PROVINCE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLegalEntitiesWithEagerRelationshipsIsEnabled() throws Exception {
        when(legalEntityRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLegalEntityMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(legalEntityRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLegalEntitiesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(legalEntityRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLegalEntityMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(legalEntityRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getLegalEntity() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        // Get the legalEntity
        restLegalEntityMockMvc
            .perform(get(ENTITY_API_URL_ID, legalEntity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(legalEntity.getId().intValue()))
            .andExpect(jsonPath("$.legalEntityName").value(DEFAULT_LEGAL_ENTITY_NAME))
            .andExpect(jsonPath("$.streetAddress").value(DEFAULT_STREET_ADDRESS))
            .andExpect(jsonPath("$.postalCode").value(DEFAULT_POSTAL_CODE))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.stateProvince").value(DEFAULT_STATE_PROVINCE));
    }

    @Test
    @Transactional
    void getNonExistingLegalEntity() throws Exception {
        // Get the legalEntity
        restLegalEntityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLegalEntity() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();

        // Update the legalEntity
        LegalEntity updatedLegalEntity = legalEntityRepository.findById(legalEntity.getId()).get();
        // Disconnect from session so that the updates on updatedLegalEntity are not directly saved in db
        em.detach(updatedLegalEntity);
        updatedLegalEntity
            .legalEntityName(UPDATED_LEGAL_ENTITY_NAME)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE);

        restLegalEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLegalEntity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLegalEntity))
            )
            .andExpect(status().isOk());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
        LegalEntity testLegalEntity = legalEntityList.get(legalEntityList.size() - 1);
        assertThat(testLegalEntity.getLegalEntityName()).isEqualTo(UPDATED_LEGAL_ENTITY_NAME);
        assertThat(testLegalEntity.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testLegalEntity.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
        assertThat(testLegalEntity.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testLegalEntity.getStateProvince()).isEqualTo(UPDATED_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void putNonExistingLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, legalEntity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(legalEntity)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLegalEntityWithPatch() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();

        // Update the legalEntity using partial update
        LegalEntity partialUpdatedLegalEntity = new LegalEntity();
        partialUpdatedLegalEntity.setId(legalEntity.getId());

        partialUpdatedLegalEntity
            .legalEntityName(UPDATED_LEGAL_ENTITY_NAME)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .city(UPDATED_CITY);

        restLegalEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLegalEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLegalEntity))
            )
            .andExpect(status().isOk());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
        LegalEntity testLegalEntity = legalEntityList.get(legalEntityList.size() - 1);
        assertThat(testLegalEntity.getLegalEntityName()).isEqualTo(UPDATED_LEGAL_ENTITY_NAME);
        assertThat(testLegalEntity.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testLegalEntity.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
        assertThat(testLegalEntity.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testLegalEntity.getStateProvince()).isEqualTo(DEFAULT_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void fullUpdateLegalEntityWithPatch() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();

        // Update the legalEntity using partial update
        LegalEntity partialUpdatedLegalEntity = new LegalEntity();
        partialUpdatedLegalEntity.setId(legalEntity.getId());

        partialUpdatedLegalEntity
            .legalEntityName(UPDATED_LEGAL_ENTITY_NAME)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .postalCode(UPDATED_POSTAL_CODE)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE);

        restLegalEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLegalEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLegalEntity))
            )
            .andExpect(status().isOk());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
        LegalEntity testLegalEntity = legalEntityList.get(legalEntityList.size() - 1);
        assertThat(testLegalEntity.getLegalEntityName()).isEqualTo(UPDATED_LEGAL_ENTITY_NAME);
        assertThat(testLegalEntity.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testLegalEntity.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
        assertThat(testLegalEntity.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testLegalEntity.getStateProvince()).isEqualTo(UPDATED_STATE_PROVINCE);
    }

    @Test
    @Transactional
    void patchNonExistingLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, legalEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLegalEntity() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        int databaseSizeBeforeDelete = legalEntityRepository.findAll().size();

        // Delete the legalEntity
        restLegalEntityMockMvc
            .perform(delete(ENTITY_API_URL_ID, legalEntity.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
