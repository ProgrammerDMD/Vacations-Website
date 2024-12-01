#include "objects/coupon.h"
#include <drogon/HttpResponse.h>

using namespace Objects;
using drogon::orm::Row;

Coupon::Coupon(std::string &&code, std::string &&productId, double amount, long startsAt, long expiresAt) :
    code(std::move(code)),
    productId(std::move(productId)),
    amount(amount),
    startsAt(startsAt),
    expiresAt(expiresAt) {

}

Coupon::Coupon(const Row &row) {
    code = row["code"].as<std::string>();
    productId = row["product_id"].as<std::string>();
    amount = row["amount"].as<double>();
    startsAt = trantor::Date::fromDbString(row["starts_at"].as<std::string>()).secondsSinceEpoch();
    expiresAt = trantor::Date::fromDbString(row["expires_at"].as<std::string>()).secondsSinceEpoch();
}

std::string Coupon::getCode() {
    return code;
}

std::string Coupon::getProductId() {
    return productId;
}

double Coupon::getAmount() {
    return amount;
}

long Coupon::getStartingTime() {
    return startsAt;
}

long Coupon::getExpiresAt() {
    return expiresAt;
}

Json::Value Coupon::toJson() {
    Json::Value result;
    result["code"] = code;
    result["product_id"] = productId;
    result["amount"] = amount;
    result["starts_at"] = std::to_string(startsAt);
    result["expires_at"] = std::to_string(expiresAt);
    return result;
}