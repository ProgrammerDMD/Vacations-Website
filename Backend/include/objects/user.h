#ifndef BACKEND_USER_H
#define BACKEND_USER_H

#include <string>
#include <drogon/orm/Field.h>
#include <drogon/orm/DbClient.h>
#include <json/json_features.h>
#include <drogon/HttpController.h>
#include "jwt/jwt.hpp"

namespace Objects {
    class User {
    private:
        std::string id;
        std::string username;
        std::string name;
        std::string password;
    public:
        explicit User(std::string &&id, std::string &&username, std::string &&name, std::string &&password);

        explicit User(const jwt::jwt_object &token);

        explicit User(const drogon::orm::Row &row);

        std::string getId();

        std::string getUsername();

        std::string getName();

        std::string getPassword();

        // Return a JWT Token
        std::string login();

        template<class T>
        void newTransaction(double total,
                            const std::shared_ptr<drogon::orm::Transaction> &transaction,
                            std::function<T> &&callback,
                            std::function<void(const drogon::orm::DrogonDbException&)>&& exceptionCallback);

        virtual Json::Value toJson();

        bool operator==(User& user);


    };
}

#endif
