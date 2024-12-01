#include "objects/discount.h"
#include <drogon/HttpResponse.h>

using namespace Objects;
using drogon::orm::Row;

Discount::Discount(std::string &&id, std::string &&productId, double amount, long startsAt, long expiresAt) :
        id(std::move(id)),
        productId(std::move(productId)),
        amount(amount),
        startsAt(startsAt),
        expiresAt(expiresAt) {

}

Discount::Discount(const Row &row) {
    id = row["id"].as<std::string>();
    productId = row["product_id"].as<std::string>();
    amount = row["amount"].as<double>();
    startsAt = trantor::Date::fromDbString(row["starts_at"].as<std::string>()).secondsSinceEpoch();
    expiresAt = trantor::Date::fromDbString(row["expires_at"].as<std::string>()).secondsSinceEpoch();
}

std::string Discount::getId() {
    return id;
}

std::string Discount::getProductId() {
    return productId;
}

double Discount::getAmount() {
    return amount;
}

long Discount::getStartingTime() {
    return startsAt;
}

long Discount::getExpiresAt() {
    return expiresAt;
}

Json::Value Discount::toJson() {
    Json::Value result;
    result["id"] = id;
    result["product_id"] = productId;
    result["amount"] = amount;
    result["starts_at"] = std::to_string(startsAt);
    result["expires_at"] = std::to_string(expiresAt);
    return result;
}