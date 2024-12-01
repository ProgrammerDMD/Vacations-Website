#include "routes/transaction.h"
#include "utils/api_responses.h"

typedef struct VacationPurchaseRequest {
    std::string id;
    unsigned int quantity;
} VacationPurchaseRequest;

void API::Transaction::purchaseVacations(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) {
    std::shared_ptr<Json::Value> body = req->getJsonObject();
    if (!body || !body->isArray()) {
        callback(API::badRequest());
        return;
    }

    std::vector<VacationPurchaseRequest> requests;
    auto purchased = std::make_shared<std::unordered_map<std::string, bool>>();
    for (const auto &item: *body) {
        if (!item.isObject() || !item.isMember("id") || !item.isMember("quantity") || !item["id"].isString() ||
            !item["quantity"].isUInt()) {
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
    db->newTransactionAsync([callback, requests, purchased](const std::shared_ptr<drogon::orm::Transaction> &transaction) {
        if (!transaction) {
            callback(API::serverError());
            return;
        }

        auto remainingCallbacks = std::make_shared<std::atomic<size_t>>(requests.size());
        auto rollbackFlag = std::make_shared<std::atomic_bool>(false);

        for (VacationPurchaseRequest request: requests) {
            transaction->execSqlAsync("UPDATE vacations SET quantity = quantity - $1 WHERE id = $2 AND quantity >= $1",
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
                        for (const auto &[id, value] : *purchased) {
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
    });
}