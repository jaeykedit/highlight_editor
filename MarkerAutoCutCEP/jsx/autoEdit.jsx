$._ext = {
    runAutoEdit: function() {
        try {
            var project = app.project;
            var sequence = project.activeSequence;
            var videoTrack = sequence.videoTracks[0];
            var projectItem = project.rootItem.children[0];

            var xmlFile = File.openDialog("XML 파일 선택", "*.xml");
            if (!xmlFile) return "XML 파일 선택이 취소되었습니다.";

            if (xmlFile.exists) {
                xmlFile.open("r");
                var xmlContent = xmlFile.read();
                xmlFile.close();
                var xmlDoc = new XML(xmlContent);
                var markers = xmlDoc.elements("marker");
                var markerCount = 0;

                for (var i = 0; i < markers.length(); i++) {
                    var markerIn = parseInt(markers[i].in);
                    videoTrack.insertClip(projectItem, markerIn / sequence.frameRate);
                    markerCount++;
                }
                return "성공적으로 " + markerCount + "개의 마커를 처리했습니다.";
            } else {
                return "XML 파일을 찾을 수 없습니다!";
            }
        } catch (e) {
            return "오류: " + e.toString();
        }
    }
};