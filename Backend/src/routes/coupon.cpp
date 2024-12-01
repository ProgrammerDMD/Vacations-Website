#include "routes/coupon.h"
#include "utils/api_responses.h"
#include "objects/coupon.h"

void API::Coupon::getCoupon(const drogon::HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, std::string code) {
    auto db = app().getDbClient();
    db->execSqlAsync("SELECT * FROM coupons WHERE code=$1", [callback](const drogon::orm::Result &result) {
        if (result.empty()) {
            callback(API::notFound());
            return;
        }

        Objects::Coupon coupon(result[0]);
        callback(HttpResponse::newHttpJsonResponse(coupon.toJson()));
    }, [callback](const drogon::orm::DrogonDbException &exception) {
        LOG_ERROR << exception.base().what();
        callback(API::serverError());
    }, code);
}