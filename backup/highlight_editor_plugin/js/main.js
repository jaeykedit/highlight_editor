function cutMarkers() {
  var cs = new CSInterface();

  fetch("marker_data.json")
    .then(res => res.json())
    .then(data => {
      var jsxCode = "var markers = " + JSON.stringify(data) + ";\n";
      jsxCode += "var fps = 60.0;\n";
      jsxCode += `for (var i = 0; i < markers.length; i++) {
  var m = markers[i];
  var inSec = m.in / fps;
  var outSec = m.out / fps;
  var seq = app.project.activeSequence;
  if (seq && seq.videoTracks && seq.videoTracks[0]) {
    var track = seq.videoTracks[0];
    for (var j = 0; j < track.clips.numItems; j++) {
      var clip = track.clips[j];
      if (clip.start.seconds <= inSec && clip.end.seconds >= outSec) {
        clip.split(outSec);
        clip.split(inSec);
        break;
      }
    }
  }
}`;
      cs.evalScript(jsxCode);
    });
}
