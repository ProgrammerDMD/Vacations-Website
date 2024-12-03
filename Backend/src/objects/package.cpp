#include "objects/package.h"
#include "json/value.h"

using namespace Objects;

Package::Package(const Objects::Product::Properties &properties, std::string &&location,
                 const std::list<Feature> &features, unsigned int beds, unsigned int discount) :
        Product(properties),
        Vacation(properties, move(location), features),
        Room(properties, beds),
        discount(discount)
{

}

Package::Package(const drogon::orm::Row &row) : Product(row), Vacation(row), Room(row) {
    discount = row["discount"].as<unsigned int>();
}

unsigned int Package::getDiscount() {
    return discount;
}

Json::Value Package::toJson() {
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
    result["beds"] = beds;
    result["discount"] = discount;
    return result;
}
