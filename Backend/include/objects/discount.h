#ifndef BACKEND_DISCOUNT_H
#define BACKEND_DISCOUNT_H

#include <string>
#include <trantor/utils/Date.h>
#include <drogon/orm/Field.h>
#include <json/json_features.h>

namespace Objects {
    class Discount {
    private:
        std::string id;
        std::string productId;
        double amount; // Percentage, where 0.5 = 50%
        long startsAt;
        long expiresAt;

    public:
        explicit Discount(std::string &&id, std::string &&productId, double amount, long startsAt, long expiresAt);

        explicit Discount(const drogon::orm::Row &row);

        std::string getId();

        std::string getProductId();

        double getAmount();

        long getStartingTime();

        long getExpiresAt();

        virtual Json::Value toJson();

        bool operator>(const Discount& discount);

        bool operator>=(const Discount& discount);
    };
}

#endif
