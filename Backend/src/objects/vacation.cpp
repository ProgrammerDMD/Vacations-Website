#include "objects/vacation.h"
#include <drogon/HttpResponse.h>

using namespace Objects;
using std::string;
using std::list;
using std::istream;
using drogon::orm::Row;

Vacation::Vacation(const Properties &properties, string &&location, const list<Feature>& features) :
    Product(properties), location(move(location)), features(features) {

}

Vacation::Vacation(const Row &row) : Product(row) {
    location = row["location"].as<string>();
    features = row["features"].as<list<Feature>>();
}

istream& Objects::operator>>(istream& is, list<Vacation::Feature>& features) {
    char c;
    while (is >> c) {
        if (c == '{' || c == ',') continue;
        if (c == '}' || c == '\n') {
            break;
        }

        int number = 0;
        while (isdigit(c)) {
            number = number * 10 + (c - '0');
            if (!(is >> c)) break;
        }

        if (number < 0 || number > 5) {
            LOG_WARN << "Detected number out of range";
            continue;
        }
        features.emplace_back(static_cast<Vacation::Feature>(number));
    }
    return is;
}

string Vacation::getLocation() {
    return location;
}

list<Vacation::Feature> Vacation::getFeatures() {
    return features;
}

Json::Value Vacation::toJson() {
    Json::Value result;
    result["id"] = properties.id;
    result["name"] = properties.name;
    result["description"] = properties.description;
    result["price"] = properties.price;
    result["quantity"] = properties.quantity;
    result["created_at"] = properties.created_at;
    result["location"] = location;

    Json::Value array(Json::arrayValue);
    for (auto &feature : features) {
        array.append(feature);
    }

    result["features"] = array;
    return result;
}