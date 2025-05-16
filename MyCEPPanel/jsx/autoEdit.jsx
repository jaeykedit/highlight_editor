$._ext = {
    runAutoEdit: function() {
        try {
            var project = app.project;
            var sequence = project.activeSequence;
            if (!sequence) throw new Error("활성 시퀀스가 없습니다!");
            var videoTrack = sequence.videoTracks[0];
            var projectItem = project.rootItem.children[0];
            if (!projectItem) throw new Error("프로젝트에 클립이 없습니다!");

            var xmlFile = File.openDialog("XML 파일 선택", "*.xml");
            if (!xmlFile) throw new Error("XML 파일 선택이 취소되었습니다.");

            $.writeln("XML 파일 경로: " + xmlFile.fsName);
            if (!xmlFile.exists) throw new Error("XML 파일을 찾을 수 없습니다!");

            xmlFile.open("r");
            var xmlContent = xmlFile.read();
            xmlFile.close();
            $.writeln("XML 내용 길이: " + xmlContent.length);

            if (!xmlContent || xmlContent.length === 0) {
                throw new Error("XML 파일이 비어 있습니다!");
            }

            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlContent, "application/xml");
            $.writeln("XML 파싱 완료");

            var parserError = xmlDoc.getElementsByTagName("parsererror");
            if (parserError.length > 0) {
                throw new Error("XML 파싱 오류: " + parserError[0].textContent);
            }

            var markers = xmlDoc.getElementsByTagName("chapter-marker");
            $.writeln("마커 수: " + markers.length);
            if (markers.length === 0) {
                throw new Error("XML에 <chapter-marker> 태그가 없습니다!");
            }

            var markerCount = 0;
            var frameRate = sequence.frameRate || 60;
            for (var i = 0; i < markers.length; i++) {
                var startAttr = markers[i].getAttribute("start");
                if (!startAttr) throw new Error("마커 " + i + "에 start 속성이 없습니다!");

                var timeParts = startAttr.match(/(\d+)\/(\d+)s/);
                if (!timeParts) throw new Error("마커 " + i + "의 start 형식이 잘못되었습니다: " + startAttr);
                var numerator = parseInt(timeParts[1]);
                var denominator = parseInt(timeParts[2]);
                var markerInSeconds = numerator / denominator;
                var markerInFrames = Math.round(markerInSeconds * frameRate);
                $.writeln("마커 " + i + ": start = " + markerInSeconds + "초, 프레임 = " + markerInFrames);

                videoTrack.insertClip(projectItem, markerInSeconds);
                markerCount++;
            }
            return "성공적으로 " + markerCount + "개의 마커를 처리했습니다.";
        } catch (e) {
            $.writeln("오류: " + e.toString());
            return "오류: " + e.toString();
        }
    }
};