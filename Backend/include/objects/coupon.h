#ifndef BACKEND_COUPON_H
#define BACKEND_COUPON_H

#include <string>
#include <trantor/utils/Date.h>
#include <drogon/orm/Field.h>
#include <json/json_features.h>

namespace Objects {
    class Coupon {
    private:
        std::string code;
        std::string productId;
        double amount; // Percentage, where 0.5 = 50%
        long startsAt;
        long expiresAt;

    public:
        explicit Coupon(std::string &&code, std::string &&productId, double amount, long startsAt, long expiresAt);

        explicit Coupon(const drogon::orm::Row &row);

        std::string getCode();

        std::string getProductId();

        double getAmount();

        long getStartingTime();

        long getExpiresAt();

        virtual Json::Value toJson();
    };
}

#endif
