#include "routes/transaction.h"
#include "utils/api_responses.h"
#include "objects/user.h"
#include "jwt/jwt.hpp"

using namespace jwt::params;

typedef struct VacationPurchaseRequest {
    std::string id;
    unsigned int quantity;
} VacationPurchaseRequest;

void API::Transaction::purchaseVacations(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) {
    std::shared_ptr<Json::Value> body = req->getJsonObject();
    if (!body || !body->isMember("vacations") || !body->isMember("total")) {
        callback(API::badRequest());
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

    Json::Value vacations = (*body)["vacations"];
    Json::Value total = (*body)["total"];
    if (!vacations.isArray() || vacations.empty() || !total.isDouble()) {
        callback(API::badRequest());
        return;
    }

    std::vector<VacationPurchaseRequest> requests;
    auto purchased = std::make_shared<std::unordered_map<std::string, bool>>();

    for (const auto &item: (*body)["vacations"]) {
        if (!item.isObject() || !item.isMember("id") || !item.isMember("quantity") || !item["id"].isString() || !item["quantity"].isUInt()) {
            callback(API::badRequest());
            return;
        }

        VacationPurchaseRequest request;
        request.id = item["id"].asString();
        request.quantity = item["quantity"].asUInt();

        requests.push_back(request);
        (*purchased)[request.id] = false;
    }

    auto db= app().getDbClient();
    db->newTransactionAsync([callback, requests, purchased, jwtToken, total](const std::shared_ptr<drogon::orm::Transaction> &transaction) {
        if (!transaction) {
            callback(API::serverError());
            return;
        }

        Objects::User user(jwtToken);
        user.newTransaction<void()>(total.asDouble(), transaction, [callback, transaction, requests, purchased]() {
                auto remainingCallbacks = std::make_shared<std::atomic<size_t>>(requests.size());
                auto rollbackFlag = std::make_shared<std::atomic_bool>(false);

                for (VacationPurchaseRequest request: requests) {
                    transaction->execSqlAsync("UPDATE vacations SET quantity = quantity - $1 WHERE id = $2 AND quantity >= $1 AND $1 > 0",
                            [callback, transaction, request, purchased, remainingCallbacks, rollbackFlag](const orm::Result &result) {
                                if (result.affectedRows() > 0) {
                                    (*purchased)[request.id] = true;
                                } else {
                                    rollbackFlag->store(true);
                                }

                                if (--(*remainingCallbacks) == 0) {
                                    if (rollbackFlag->load()) {
                                        transaction->rollback();
                                    }

                                    Json::Value json;
                                    for (const auto &[id, value]: *purchased) {
                                        json[id] = value;
                                    }
                                    callback(HttpResponse::newHttpJsonResponse(json));
                                }
                            },
                            [callback, transaction, request, purchased, remainingCallbacks, rollbackFlag](const orm::DrogonDbException &error) {
                                if (--(*remainingCallbacks) == 0) {
                                    Json::Value json;
                                    for (const auto &[id, value]: *purchased) {
                                        json[id] = value;
                                    }
                                    callback(HttpResponse::newHttpJsonResponse(json));
                                }
                            }, request.quantity, request.id);
                }
            },
            [callback](const drogon::orm::DrogonDbException &exception) {
                LOG_ERROR << exception.base().what();
                callback(API::serverError());
            });
    });
}