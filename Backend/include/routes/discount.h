#ifndef DISCOUNT_ROUTE_H
#define DISCOUNT_ROUTE_H

#include <drogon/HttpController.h>

using namespace drogon;

namespace API {
    class Discount : public HttpController<Discount> {
    public:
        METHOD_LIST_BEGIN
            ADD_METHOD_TO(Discount::getDiscounts, "/discounts", Get);
            ADD_METHOD_TO(Discount::getLimitedDiscounts, "/discounts/limited", Get);
        METHOD_LIST_END

        void getDiscounts(
                const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback);

        void getLimitedDiscounts(
                const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback);
    };
}

#endif
