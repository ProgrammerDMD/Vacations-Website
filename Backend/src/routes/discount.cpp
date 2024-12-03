#include <fstream>
#include "routes/discount.h"
#include "utils/api_responses.h"
#include "objects/discount.h"
#include "jwt/jwt.hpp"
#include "objects/user.h"

using namespace jwt::params;

long getNow() {
    return duration_cast<std::chrono::milliseconds>(
            std::chrono::system_clock::now().time_since_epoch()
    ).count() / 1000;
}

std::string formatTimestamp(long timestamp) {
    std::chrono::duration<long> value(timestamp);
    std::chrono::time_point<std::chrono::system_clock, std::chrono::duration<long> > tp_seconds(value);
    std::chrono::system_clock::time_point tp(tp_seconds);

    time_t time = std::chrono::system_clock::to_time_t(tp);
    std::tm *local_time = std::localtime(&time);

    std::stringstream ss;
    ss << std::put_time(local_time, "%d/%m/%Y %H:%M:%S");
    return ss.str();
}

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

void API::Discount::hasLoyaltyCard(const drogon::HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) {
    if (req->getHeader("Authorization").empty()) {
        callback(API::notAuthorized());
        return;
    }

    jwt::jwt_object jwtToken;
    try {
        jwtToken = jwt::decode(req->getHeader("Authorization"), algorithms({"HS256"}), secret("secret"), verify(true));
    } catch (std::exception &exception) {
        callback(API::notAuthorized());
        LOG_ERROR << exception.what();
        return;
    }

    auto db = app().getDbClient();
    db->execSqlAsync("SELECT sum(cost) FROM transactions WHERE user_id=$1",
         [callback, jwtToken](const drogon::orm::Result &result) {
             Json::Value value;
             value["result"] = "none";

             if (result.empty()) {
                 callback(HttpResponse::newHttpJsonResponse(value));
                 return;
             }

             Objects::User user(jwtToken);
             drogon::orm::Row row = result[0];
             drogon::orm::Field sum = row["sum"];
             if (sum.isNull()) {
                 callback(HttpResponse::newHttpJsonResponse(value));
                 return;
             }

             double sumDouble = sum.as<double>();
             if (sumDouble >= 10000) {
                 value["result"] = "normal";
             }

             // I could write this somewhere else, but I am too lazy
             if (sumDouble > 50000) {
                 try {
                     std::ofstream invitation(user.getUsername() + "-invitatie.txt");
                     invitation << "Dear, " << user.getName() << std::endl;
                     invitation << "\nYou are now a VIP client!" << std::endl;
                     invitation << "\n" << "Sent on " << formatTimestamp(getNow()) << std::endl;
                     invitation.close();
                 } catch (std::exception &exception) {
                     LOG_ERROR << "Couldn't write an invitation!";
                 }
             }

             callback(HttpResponse::newHttpJsonResponse(value));
         },
         [callback](const drogon::orm::DrogonDbException &exception) {
             LOG_ERROR << exception.base().what();
             callback(API::serverError());
         }, jwtToken.payload().get_claim_value<std::string>("id"));
}