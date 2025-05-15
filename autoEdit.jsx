// Premiere Pro ExtendScript: XML 마커 기반 자동 편집
var project = app.project;
var sequence = project.activeSequence;
var videoTrack = sequence.videoTracks[0];
var projectItem = project.rootItem.children[0]; // 편집에 사용할 클립

// XML 파일 읽기
var xmlFile = new File("C:\Users\admin\Documents\highlight_recorder\dist");
if (xmlFile.exists) {
    xmlFile.open("r");
    var xmlContent = xmlFile.read();
    xmlFile.close();

    // XML 파싱
    var xmlDoc = new XML(xmlContent);
    var markers = xmlDoc..marker;

    // 마커 순회 및 편집
    for (var i = 0; i < markers.length(); i++) {
        var markerName = markers[i].name;
        var markerIn = parseInt(markers[i].in); // 프레임 단위
        var markerComment = markers[i].comment;

        // 클립 삽입
        videoTrack.insertClip(projectItem, markerIn / sequence.frameRate);

        // 효과 적용 (예: Zoom)
        if (markerComment.indexOf("Zoom") !== -1) {
            var clip = videoTrack.clips[videoTrack.clips.length - 1];
            var scaleComponent = clip.components[0];
            if (scaleComponent) {
                var scaleParam = scaleComponent.properties[1];
                scaleParam.setValue(150, true); // 150% 스케일
            }
        }
    }
} else {
    alert("XML 파일을 찾을 수 없습니다!");
}