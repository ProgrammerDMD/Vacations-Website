#ifndef BACKEND_TRANSACTION_H
#define BACKEND_TRANSACTION_H

#include <drogon/HttpController.h>

using namespace drogon;

namespace API {
    class Transaction : public HttpController<Transaction> {
    public:
        METHOD_LIST_BEGIN
            ADD_METHOD_TO(Transaction::purchaseVacations, "/transaction/vacations", Post);
        METHOD_LIST_END

        void purchaseVacations(
                const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback);
    };
}

#endif
