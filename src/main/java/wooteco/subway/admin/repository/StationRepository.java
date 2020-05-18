package wooteco.subway.admin.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import wooteco.subway.admin.domain.Station;

public interface StationRepository extends CrudRepository<Station, Long> {

    @Query("SELECT id FROM STATION WHERE name = :name")
    Long findIdByName(@Param("name") String name);

    @Override
    List<Station> findAll();

    @Override
    Set<Station> findAllById(Iterable<Long> longs);
}
