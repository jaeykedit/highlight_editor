#include "tinyxml2.h"
#include <iostream>
#include <vector>
#include <string>
#include <cstdlib>

using namespace tinyxml2;

struct Marker {
    std::string comment;
    int in_frame;
    int out_frame;
};

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "사용법: " << argv[0] << " input.xmeml" << std::endl;
        return 1;
    }

    const char* filename = argv[1];
    XMLDocument doc;
    if (doc.LoadFile(filename) != XML_SUCCESS) {
        std::cerr << "XML 파일을 열 수 없습니다: " << filename << std::endl;
        return 1;
    }

    std::vector<Marker> markers;

    XMLElement* root = doc.FirstChildElement("xmeml");
    if (!root) {
        std::cerr << "<xmeml> 태그가 없습니다." << std::endl;
        return 1;
    }

    XMLElement* sequence = root->FirstChildElement("sequence");
    if (!sequence) {
        std::cerr << "<sequence> 태그가 없습니다." << std::endl;
        return 1;
    }

    for (XMLElement* marker = sequence->FirstChildElement("marker"); marker; marker = marker->NextSiblingElement("marker")) {
        const char* comment = marker->FirstChildElement("comment")->GetText();
        const char* in_text = marker->FirstChildElement("in")->GetText();
        const char* out_text = marker->FirstChildElement("out")->GetText();

        if (comment && in_text && out_text) {
            Marker m;
            m.comment = comment;
            m.in_frame = std::atoi(in_text);
            m.out_frame = std::atoi(out_text);
            markers.push_back(m);
        }
    }

    // JSON 출력
    std::cout << "[\n";
    for (size_t i = 0; i < markers.size(); ++i) {
        const Marker& m = markers[i];
        std::cout << "  {\n";
        std::cout << "    \"comment\": \"" << m.comment << "\",\n";
        std::cout << "    \"in\": " << m.in_frame << ",\n";
        std::cout << "    \"out\": " << m.out_frame << "\n";
        std::cout << "  }";
        if (i + 1 < markers.size()) std::cout << ",";
        std::cout << "\n";
    }
    std::cout << "]\n";

    return 0;
}