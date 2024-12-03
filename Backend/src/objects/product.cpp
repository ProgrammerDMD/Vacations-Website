#include "objects/product.h"
#include <drogon/HttpResponse.h>

using std::string;
using namespace Objects;
using drogon::orm::Row;

Product::Product(const Properties &properties) : properties{
    properties.id,
    properties.name,
    properties.description,
    properties.price,
    properties.quantity,
    properties.created_at
} {
}

Product::Product(const Row &row) {
    properties.id = row["id"].as<string>();
    properties.name = row["name"].as<string>();
    properties.description = row["description"].as<string>();
    properties.price = row["price"].as<double>();
    properties.quantity = row["quantity"].as<unsigned int>();
    properties.created_at = row["created_at"].as<long long>();
}

string Product::getId() {
    return properties.id;
}

string Product::getName() {
    return properties.name;
}

string Product::getDescription() {
    return properties.description;
}

double Product::getPrice() {
    return properties.price;
}

unsigned int Product::getQuantity() {
    return properties.quantity;
}

long long Product::getCreatedAt() {
    return properties.created_at;
}

Json::Value Product::toJson() {
    Json::Value result;
    result["id"] = properties.id;
    result["name"] = properties.name;
    result["description"] = properties.description;
    result["price"] = properties.price;
    result["quantity"] = properties.quantity;
    result["created_at"] = properties.created_at;
    return result;
}

Product& Product::operator--() {
    this->properties.quantity -= 1;
    return *this;
}

Product& Product::operator++() {
    this->properties.quantity += 1;
    return *this;
}
