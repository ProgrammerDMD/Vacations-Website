#include "objects/user.h"
#include <drogon/HttpResponse.h>
#include "jwt/jwt.hpp"
#include <iostream>
#include <fstream>

using namespace Objects;
using namespace jwt::params;

User::User(std::string &&id, std::string &&username, std::string &&name, std::string &&password) :
    id(std::move(id)),
    username(std::move(username)),
    name(std::move(name)),
    password(std::move(password)) {
}

User::User(const jwt::jwt_object &token) {
    const jwt::jwt_payload& payload = token.payload();
    id = payload.get_claim_value<std::string>("id");
    username = payload.get_claim_value<std::string>("username");
    name = payload.get_claim_value<std::string>("name");
    password = "";
}

User::User(const drogon::orm::Row &row) {
    id = row["id"].as<std::string>();
    username = row["username"].as<std::string>();
    name = row["name"].as<std::string>();
    password = row["password"].as<std::string>();
}

std::string User::getId() {
    return id;
}

std::string User::getUsername() {
    return username;
}

std::string User::getName() {
    return name;
}

std::string User::getPassword() {
    return password;
}

static std::string SECRET = "secret";
std::string User::login() {
    jwt::jwt_object object{algorithm("HS256"), secret(SECRET)};
    object.add_claim("iss", "localhost")
          .add_claim("exp", std::chrono::system_clock::now() + std::chrono::hours{1})
          .add_claim("id", id)
          .add_claim("username", username)
          .add_claim("name", name);
    return object.signature();
}

template<>
void User::newTransaction<void(void)>(double total,
                                      const std::shared_ptr<drogon::orm::Transaction> &transaction,
                                      std::function<void(void)> &&callback,
                                      std::function<void(const drogon::orm::DrogonDbException&)>&& exceptionCallback)
{
    transaction->execSqlAsync("INSERT INTO transactions(id, user_id, cost) VALUES(uuid_generate_v4(), $1, $2)",
              [callback, transaction](const drogon::orm::Result &result) {
                  if (result.affectedRows() == 0) {
                      transaction->rollback();
                      return;
                  }
                  callback();
              },
              [exceptionCallback](const drogon::orm::DrogonDbException &exception) {
                  exceptionCallback(exception);
              }, id, total);
}

Json::Value User::toJson() {
    Json::Value result;
    result["id"] = id;
    result["username"] = username;
    result["name"] = name;
    result["password"] = password;
    return result;
}