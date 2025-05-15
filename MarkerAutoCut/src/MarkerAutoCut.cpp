#include "MarkerAutoCut.h"
#include <string>

// 플러그인 정보 정의
DECLARE_PIPL
(
    PluginType = kPluginType_VideoEffect,
    PluginName = PLUGIN_NAME,
    PluginVersion = {PLUGIN_VERSION_MAJOR, PLUGIN_VERSION_MINOR, PLUGIN_VERSION_BUILD, PLUGIN_VERSION_REVISION},
    PluginDescription = "Automatically cuts timeline at marker In/Out points"
)

// 플러그인 메인 함수
extern "C" DllExport PREMPLUGENTRY xPluginMain(prPlugInRef plugInRef, prInt32 selector, prPlugInData* plugInData)
{
    prSuiteError result = kPluginResult_Success;

    switch (selector)
    {
        case kPluginSelector_Startup:
            // 초기화
            break;
        case kPluginSelector_Update:
            // 마커 커팅 로직 실행
            result = ProcessMarkers(plugInData);
            break;
        case kPluginSelector_Shutdown:
            // 정리
            break;
        default:
            result = kPluginResult_Unsupported;
    }

    return result;
}

// 마커를 읽고 커팅하는 함수
prSuiteError ProcessMarkers(prPlugInData* plugInData)
{
    PrSDKMarkerSuite* markerSuite = nullptr;
    PrSDKSequenceSuite* sequenceSuite = nullptr;
    PrSDKTimeSuite* timeSuite = nullptr;

    // Suite 초기화
    prSuiteError result = plugInData->suiteAccess->AcquireSuite(
        kPrSDKMarkerSuite, kPrSDKMarkerSuiteVersion, (const void**)&markerSuite);
    if (result != suiteError_NoError) return result;

    result = plugInData->suiteAccess->AcquireSuite(
        kPrSDKSequenceSuite, kPrSDKSequenceSuiteVersion, (const void**)&sequenceSuite);
    if (result != suiteError_NoError) return result;

    result = plugInData->suiteAccess->AcquireSuite(
        kPrSDKTimeSuite, kPrSDKTimeSuiteVersion, (const void**)&timeSuite);
    if (result != suiteError_NoError) return result;

    // 현재 시퀀스 가져오기
    PrSequenceID seqID = plugInData->sequenceID;
    PrTime ticksPerFrame = 0;
    sequenceSuite->GetTicksPerFrame(seqID, &ticksPerFrame);

    // 마커 목록 가져오기
    PrMarkerList markerList;
    markerSuite->GetMarkerList(seqID, &markerList);

    if (markerList.numMarkers == 0)
    {
        // 마커가 없으면 경고 (UI 없으므로 로그로 대체)
        return suiteError_NoError;
    }

    for (int i = 0; i < markerList.numMarkers; i++)
    {
        PrMarker marker = markerList.markers[i];
        PrTime inPoint, outPoint;
        markerSuite->GetMarkerInOut(marker, &inPoint, &outPoint);

        // In 포인트에서 커팅
        sequenceSuite->SetPlayerPosition(seqID, inPoint);
        sequenceSuite->AddEdit(seqID, nullptr, nullptr);

        // Out 포인트에서 커팅 (In != Out인 경우)
        if (outPoint > inPoint)
        {
            sequenceSuite->SetPlayerPosition(seqID, outPoint);
            sequenceSuite->AddEdit(seqID, nullptr, nullptr);
        }
    }

    // Suite 해제
    plugInData->suiteAccess->ReleaseSuite(kPrSDKMarkerSuite, kPrSDKMarkerSuiteVersion);
    plugInData->suiteAccess->ReleaseSuite(kPrSDKSequenceSuite, kPrSDKSequenceSuiteVersion);
    plugInData->suiteAccess->ReleaseSuite(kPrSDKTimeSuite, kPrSDKTimeSuiteVersion);

    return suiteError_NoError;
}