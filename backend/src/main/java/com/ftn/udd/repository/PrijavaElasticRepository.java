package com.ftn.udd.repository;

import org.springframework.data.elasticsearch.core.SearchHitsImpl;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.ftn.udd.model.PrijavaIndexed;

public interface PrijavaElasticRepository extends ElasticsearchRepository<PrijavaIndexed, Long> {
    SearchHitsImpl<PrijavaIndexed> searchByImeAndPrezime(String ime, String prezime);

    SearchHitsImpl<PrijavaIndexed> searchByStrucnaSpremaBetween(Long min, Long max);

    // SearchHitsImpl<PrijavaIndexed> searchByCv(String cv);
}
