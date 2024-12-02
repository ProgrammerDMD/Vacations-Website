#include "routes/user.h"
#include "objects/user.h"
#include "utils/api_responses.h"

bool isValidName(std::string &name) {
    return name.length() >= 3 && name.length() <= 20;
}

bool isValidUsername(std::string &username) {
    return username.length() >= 3 && username.length() <= 16;
}

bool isValidPassword(std::string &password) {
    return !password.empty();
}

void API::User::createUser(const drogon::HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) {
    std::shared_ptr<Json::Value> body = req->getJsonObject();
    if (!body || !body->isMember("username") || !body->isMember("name") || !body->isMember("password")) {
        callback(API::badRequest());
        return;
    }

    std::string username = body->get("username", "").asString();
    std::string name = body->get("name", "").asString();
    std::string password = body->get("password", "").asString();

    if (!(isValidName(name) && isValidUsername(username) && isValidPassword(password))) {
        callback(API::badRequest());
        return;
    }

    auto db = app().getDbClient();
    db->execSqlAsync(
            "INSERT INTO users (id, username, name, password) \n"
            "VALUES (uuid_generate_v4(), $1, $2, $3) \n"
            "ON CONFLICT (username) DO NOTHING \n"
            "RETURNING *;",
            [callback](const drogon::orm::Result &result) {
                if (result.affectedRows() == 0) {
                    callback(API::conflict());
                    return;
                }

                Objects::User user(result[0]);
                Json::Value value;
                value["token"] = user.login();

                callback(HttpResponse::newHttpJsonResponse(value));
            },
            [callback](const drogon::orm::DrogonDbException &exception) {
                LOG_ERROR << exception.base().what();
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_APPLICATION_JSON));
            }, username, name, password);
}

void API::User::login(const drogon::HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) {
    std::shared_ptr<Json::Value> body = req->getJsonObject();
    if (!body || !body->isMember("username") || !body->isMember("password")) {
        callback(API::badRequest());
        return;
    }

    std::string username = body->get("username", "").asString();
    std::string password = body->get("password", "").asString();

    if (!(isValidUsername(username) && isValidPassword(password))) {
        callback(API::badRequest());
        return;
    }

    auto db = app().getDbClient();
    db->execSqlAsync(
            "SELECT * FROM users WHERE username=$1 AND password=$2",
            [callback](const drogon::orm::Result &result) {
                if (result.empty()) {
                    callback(API::notFound());
                    return;
                }

                Objects::User user(result[0]);
                Json::Value value;
                value["token"] = user.login();

                callback(HttpResponse::newHttpJsonResponse(value));
            },
            [callback](const drogon::orm::DrogonDbException &exception) {
                LOG_ERROR << exception.base().what();
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_APPLICATION_JSON));
            }, username, password);
}