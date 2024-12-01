#include "routes/discount.h"
#include "utils/api_responses.h"
#include "objects/discount.h"

void API::Discount::getDiscounts(const drogon::HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) {
    auto db = app().getDbClient();
    db->execSqlAsync("SELECT * FROM discounts", [callback](const drogon::orm::Result &result) {
        Json::Value array(Json::ValueType::arrayValue);
        for (const auto& row : result) {
            Objects::Discount discount(row);
            array.append(discount.toJson());
        }
        callback(HttpResponse::newHttpJsonResponse(array));
    }, [callback](const drogon::orm::DrogonDbException &exception) {
        LOG_ERROR << exception.base().what();
        callback(API::serverError());
    });
}

long getNow() {
    return duration_cast<std::chrono::milliseconds>(
            std::chrono::system_clock::now().time_since_epoch()
    ).count() / 1000;
}

// Hard code limited discounts
static std::unordered_map<std::string, long> limitedDiscounts{
        {"be36db6e-a7a4-4025-97cb-6204917c2ae1", getNow() + 120},
        {"5e2f0456-d386-401a-828d-27c766144412", getNow() + 120},
        {"8c2cf248-39ba-4cd9-ae19-8b36155afb27", getNow() + 120},
        {"f9eb7719-9135-4a94-9c98-4be0120a7180", getNow() + 120},
        {"335f509e-b63a-41a0-828c-d0e36a2fdba8", getNow() + 120}
};

void API::Discount::getLimitedDiscounts(const drogon::HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) {
    auto db = app().getDbClient();
    db->execSqlAsync("SELECT * FROM discounts", [callback](const drogon::orm::Result &result) {
        Json::Value value;
        for (const auto& [productId, expiresAt] : limitedDiscounts) {
            value[productId] = std::to_string(expiresAt);
        }

        callback(HttpResponse::newHttpJsonResponse(value));
    }, [callback](const drogon::orm::DrogonDbException &exception) {
        LOG_ERROR << exception.base().what();
        callback(API::serverError());
    });
}