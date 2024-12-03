#include "objects/room.h"
#include "json/value.h"

using namespace Objects;

Room::Room(const Objects::Product::Properties &properties, unsigned int beds) :
        Product(properties), beds(beds)
{

}

Room::Room(const drogon::orm::Row &row) : Product(row) {
    beds = row["beds"].as<unsigned int>();
}

unsigned int Room::getBeds() {
    return beds;
}

Json::Value Room::toJson() {
    Json::Value result;
    result["id"] = properties.id;
    result["name"] = properties.name;
    result["description"] = properties.description;
    result["price"] = properties.price;
    result["quantity"] = properties.quantity;
    result["created_at"] = properties.created_at;
    result["beds"] = beds;
    return result;
}