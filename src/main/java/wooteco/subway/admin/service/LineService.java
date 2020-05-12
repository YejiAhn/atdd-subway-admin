package wooteco.subway.admin.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Sets;
import wooteco.subway.admin.domain.Line;
import wooteco.subway.admin.domain.Station;
import wooteco.subway.admin.dto.LineResponse;
import wooteco.subway.admin.dto.LineStationCreateRequest;
import wooteco.subway.admin.dto.StationResponse;
import wooteco.subway.admin.repository.LineRepository;
import wooteco.subway.admin.repository.StationRepository;

@Transactional
@Service
public class LineService {
    private final LineRepository lineRepository;
    private final StationRepository stationRepository;

    public LineService(LineRepository lineRepository, StationRepository stationRepository) {
        this.lineRepository = lineRepository;
        this.stationRepository = stationRepository;
    }

    public Line save(Line line) {
        return lineRepository.save(line);
    }

    public List<LineResponse> showLines() {
        List<LineResponse> lineResponses = new ArrayList<>();
        final List<Line> lines = lineRepository.findAll();
        for (Line line : lines) {
            lineResponses.add(
                LineResponse.convert(line, findStationsByLineId(line.findLineStationsId())));
        }
        return lineResponses;
    }

    public void updateLine(Long id, Line line) {
        Line persistLine = lineRepository.findById(id).orElseThrow(RuntimeException::new);
        persistLine.update(line);
        lineRepository.save(persistLine);
    }

    public void deleteLineById(Long id) {
        lineRepository.deleteById(id);
    }

    public void addLineStation(Long id, LineStationCreateRequest request) {
        Line line = lineRepository.findById(id).orElseThrow(RuntimeException::new);
        line.addLineStation(request.toLineStation());
        lineRepository.save(line);
    }

    public void removeLineStation(Long lineId, Long stationId) {
        Line line = lineRepository.findById(lineId).orElseThrow(RuntimeException::new);
        line.removeLineStationById(stationId);
        lineRepository.save(line);
    }

    public LineResponse findLineWithStationsById(Long id) {
        final Line line = lineRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("해당 아이디의 노선이 존재하지 않습니다."));
        return LineResponse.convert(line, new HashSet(line.findLineStationsId()));
    }

    public Set<Station> findStationsByLineId(List<Long> stationIds) {
        return Sets.newHashSet(stationRepository.findAllById(stationIds));
    }

    public List<StationResponse> findStationResponsesWithLineId(Long lineId) {
        final LineResponse lineResponse = findLineWithStationsById(lineId);
        final Set<Station> stations = lineResponse.getStations();
        List<StationResponse> stationResponses = new ArrayList<>();
        for (Station station : stations) {
            stationResponses.add(StationResponse.of(station));
        }
        return stationResponses;
    }

    public Station saveStation(Station station) {
        return stationRepository.save(station);
    }

    public List<Station> findAllStations() {
        return stationRepository.findAll();
    }

    public void deleteStationById(Long id) {
        stationRepository.deleteById(id);
    }

    public Long findStationIdByName(String name) {
        return stationRepository.findIdByName(name);
    }
}
