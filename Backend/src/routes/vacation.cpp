#include "objects/vacation.h"
#include "routes/vacation.h"
#include "objects/product.h"
#include "utils/api_responses.h"

void API::Vacation::getVacationById(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback, const std::string &productId) {
    auto db = app().getDbClient();
    db->execSqlAsync("SELECT id, name, description, quantity, features, location, price, EXTRACT(EPOCH from created_at) as created_at FROM vacations WHERE id=$1",
                     [callback](const orm::Result &result) {
                         if (result.empty()) {
                             callback(API::notFound());
                             return;
                         }

                         Objects::Vacation vacation(result[0]);
                         callback(HttpResponse::newHttpJsonResponse(vacation.toJson()));
                     }, [callback](const orm::DrogonDbException &exception) {
                LOG_ERROR << exception.base().what();
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_APPLICATION_JSON));
            },
                     productId);
}

void API::Vacation::getVacationByQuery(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) {
    std::shared_ptr<Json::Value> body = req->getJsonObject();
    if (!body) {
        callback(API::emptyResponse());
        return;
    }

    std::string query = body->get("query", "").asString();
    if (query.empty()) {
        callback(API::emptyResponse());
        return;
    }

    unsigned int page = body->get("page", 0).asUInt();
    unsigned int limit = body->get("limit", 10).asUInt();
    unsigned int offset = limit * page;

    std::stringstream ss;
    ss << "SELECT id, name, description, quantity, features, price, location, EXTRACT(EPOCH from created_at) as created_at FROM search_vacations($1) ORDER BY created_at DESC LIMIT ";
    ss << limit;
    ss << " OFFSET ";
    ss << offset;

    auto db = app().getDbClient();
    db->execSqlAsync(
            ss.str(),
            [callback](const orm::Result &result) {
                if (result.empty()) {
                    callback(API::emptyResponse());
                    return;
                }

                Json::Value array(Json::ValueType::arrayValue);
                for (auto &row: result) {
                    Objects::Vacation vacation(row);
                    array.append(vacation.toJson());
                }
                callback(HttpResponse::newHttpJsonResponse(array));
            }, [callback](const orm::DrogonDbException &exception) {
                LOG_ERROR << exception.base().what();
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_APPLICATION_JSON));
            }, query);
}

void API::Vacation::getVacations(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) {
    unsigned int page = req->getOptionalParameter<unsigned int>("page").value_or(0);
    unsigned int limit = req->getOptionalParameter<unsigned int>("limit").value_or(10);
    unsigned int offset = limit * page;

    std::stringstream ss;
    ss << "SELECT id, name, description, quantity, features, price, location, EXTRACT(EPOCH from created_at) as created_at FROM vacations ORDER by created_at DESC LIMIT ";
    ss << limit;
    ss << " OFFSET ";
    ss << offset;

    auto db = app().getDbClient();
    db->execSqlAsync(
            ss.str(),
            [callback](const orm::Result &result) {
                if (result.empty()) {
                    callback(API::emptyResponse());
                    return;
                }

                Json::Value array(Json::ValueType::arrayValue);
                for (auto &row : result) {
                    Objects::Vacation vacation(row);
                    array.append(vacation.toJson());
                }
                callback(HttpResponse::newHttpJsonResponse(array));
            },
            [callback](const orm::DrogonDbException &exception) {
                LOG_ERROR << exception.base().what();
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_APPLICATION_JSON));
            });
}

void API::Vacation::getTotalPages(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) {
    std::shared_ptr<Json::Value> body = req->getJsonObject();
    if (!body) {
        callback(API::emptyResponse());
        return;
    }

    std::string query = body->get("query", "").asString();
    unsigned int limit = body->get("limit", 10).asUInt();

    auto db = app().getDbClient();
    db->newTransactionAsync([callback, query, limit](auto &transaction) {
        if (!transaction) {
            callback(API::serverError());
            return;
        }

        if (!query.empty()) {
            transaction->execSqlAsync("SELECT COUNT(*) FROM search_vacations($1)", [callback, limit](const orm::Result &result) {
                Json::Value json;
                json["limit"] = limit;

                if (result.empty()) {
                    json["pages"] = -1;
                    callback(HttpResponse::newHttpJsonResponse(json));
                    return;
                }

                orm::Row row = result[0];
                json["pages"] = (limit == 0) ? 0 : static_cast<int>(ceil(row["count"].as<double>() / limit));
                callback(HttpResponse::newHttpJsonResponse(json));
            }, [callback](const orm::DrogonDbException &exception) {
                LOG_ERROR << exception.base().what();
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_APPLICATION_JSON));
            }, query);
        } else {
            transaction->execSqlAsync("SELECT COUNT(*) FROM vacations", [callback, limit](const orm::Result &result) {
                Json::Value json;
                json["limit"] = limit;

                if (result.empty()) {
                    json["pages"] = -1;
                    callback(HttpResponse::newHttpJsonResponse(json));
                    return;
                }

                orm::Row row = result[0];
                json["pages"] = (limit == 0) ? 0 : static_cast<int>(ceil(row["count"].as<double>() / limit));
                callback(HttpResponse::newHttpJsonResponse(json));
            }, [callback](const orm::DrogonDbException &exception) {
                LOG_ERROR << exception.base().what();
                callback(HttpResponse::newHttpResponse(k500InternalServerError, CT_APPLICATION_JSON));
            });
        }
    });
}