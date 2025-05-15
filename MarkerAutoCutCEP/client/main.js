function runScript() {
    var csInterface = new CSInterface();
    csInterface.evalScript('$._ext.runAutoEdit()', function(result) {
        document.getElementById('result').innerText = 'Result: ' + result;
    });
}