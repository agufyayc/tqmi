package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Cell;
import com.mycompany.myapp.repository.CellRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Cell}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CellResource {

    private final Logger log = LoggerFactory.getLogger(CellResource.class);

    private static final String ENTITY_NAME = "cell";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CellRepository cellRepository;

    public CellResource(CellRepository cellRepository) {
        this.cellRepository = cellRepository;
    }

    /**
     * {@code POST  /cells} : Create a new cell.
     *
     * @param cell the cell to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cell, or with status {@code 400 (Bad Request)} if the cell has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cells")
    public ResponseEntity<Cell> createCell(@Valid @RequestBody Cell cell) throws URISyntaxException {
        log.debug("REST request to save Cell : {}", cell);
        if (cell.getId() != null) {
            throw new BadRequestAlertException("A new cell cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Cell result = cellRepository.save(cell);
        return ResponseEntity
            .created(new URI("/api/cells/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cells/:id} : Updates an existing cell.
     *
     * @param id the id of the cell to save.
     * @param cell the cell to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cell,
     * or with status {@code 400 (Bad Request)} if the cell is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cell couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cells/{id}")
    public ResponseEntity<Cell> updateCell(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Cell cell)
        throws URISyntaxException {
        log.debug("REST request to update Cell : {}, {}", id, cell);
        if (cell.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cell.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cellRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Cell result = cellRepository.save(cell);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cell.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cells/:id} : Partial updates given fields of an existing cell, field will ignore if it is null
     *
     * @param id the id of the cell to save.
     * @param cell the cell to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cell,
     * or with status {@code 400 (Bad Request)} if the cell is not valid,
     * or with status {@code 404 (Not Found)} if the cell is not found,
     * or with status {@code 500 (Internal Server Error)} if the cell couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cells/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Cell> partialUpdateCell(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Cell cell
    ) throws URISyntaxException {
        log.debug("REST request to partial update Cell partially : {}, {}", id, cell);
        if (cell.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cell.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cellRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Cell> result = cellRepository
            .findById(cell.getId())
            .map(existingCell -> {
                if (cell.getCellName() != null) {
                    existingCell.setCellName(cell.getCellName());
                }

                return existingCell;
            })
            .map(cellRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cell.getId().toString())
        );
    }

    /**
     * {@code GET  /cells} : get all the cells.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cells in body.
     */
    @GetMapping("/cells")
    public List<Cell> getAllCells(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Cells");
        if (eagerload) {
            return cellRepository.findAllWithEagerRelationships();
        } else {
            return cellRepository.findAll();
        }
    }

    /**
     * {@code GET  /cells/:id} : get the "id" cell.
     *
     * @param id the id of the cell to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cell, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cells/{id}")
    public ResponseEntity<Cell> getCell(@PathVariable Long id) {
        log.debug("REST request to get Cell : {}", id);
        Optional<Cell> cell = cellRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(cell);
    }

    /**
     * {@code DELETE  /cells/:id} : delete the "id" cell.
     *
     * @param id the id of the cell to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cells/{id}")
    public ResponseEntity<Void> deleteCell(@PathVariable Long id) {
        log.debug("REST request to delete Cell : {}", id);
        cellRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
