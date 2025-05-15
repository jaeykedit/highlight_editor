cmake_minimum_required(VERSION 3.20)
project(MarkerAutoCut)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Premiere Pro SDK 경로
set(PREMIERE_SDK_PATH "~/Premiere_Pro_2024_SDK") # Mac/Windows 경로로 변경

# 소스 파일
set(SOURCES src/MarkerAutoCut.cpp)

# 헤더 경로
include_directories(${PREMIERE_SDK_PATH}/Headers)

# 플러그인 출력
add_library(MarkerAutoCut SHARED ${SOURCES})

# Mac 설정
if(APPLE)
    set_target_properties(MarkerAutoCut PROPERTIES SUFFIX ".prmp")
    target_link_libraries(MarkerAutoCut "-framework CoreFoundation")
endif()

# Windows 설정
if(WIN32)
    set_target_properties(MarkerAutoCut PROPERTIES SUFFIX ".prmp")
endif()

# 출력 경로
set_target_properties(MarkerAutoCut PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/MediaCore"
)