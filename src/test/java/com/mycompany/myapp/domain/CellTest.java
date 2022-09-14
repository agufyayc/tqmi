package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CellTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cell.class);
        Cell cell1 = new Cell();
        cell1.setId(1L);
        Cell cell2 = new Cell();
        cell2.setId(cell1.getId());
        assertThat(cell1).isEqualTo(cell2);
        cell2.setId(2L);
        assertThat(cell1).isNotEqualTo(cell2);
        cell1.setId(null);
        assertThat(cell1).isNotEqualTo(cell2);
    }
}
