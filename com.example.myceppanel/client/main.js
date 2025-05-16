(function () {
    'use strict';
    console.log("main.js 로드 시작");
    
    var csInterface = new CSInterface();
    
    // CSInterface 초기화 확인
    if (!csInterface) {
        console.error("CSInterface 초기화 실패");
        document.getElementById('result').innerText = 'Error: CSInterface not initialized';
        return;
    }

    function runScript() {
        console.log("runScript 호출");
        csInterface.evalScript('$._ext.runAutoEdit()', function(result) {
            console.log("스크립트 결과: " + result);
            document.getElementById('result').innerText = 'Result: ' + result;
        });
    }

    // 버튼에 이벤트 리스너 추가
    document.getElementById('runButton').addEventListener('click', runScript);
})();