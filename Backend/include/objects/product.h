#ifndef PRODUCT_H
#define PRODUCT_H

#include <drogon/orm/Field.h>
#include <json/json_features.h>

namespace Objects {
    class Product {
    public:
        typedef struct Properties {
            std::string id;
            std::string name;
            std::string description;
            double price;
            unsigned int quantity;
            long long created_at;
        } Properties;
    protected:
        Properties properties;
    public:
        explicit Product(const Properties& properties);

        explicit Product(const drogon::orm::Row &row);

        std::string getId();

        std::string getName();

        std::string getDescription();

        double getPrice();

        unsigned int getQuantity();

        long long getCreatedAt();

        virtual Json::Value toJson();
    };
}
#endif
