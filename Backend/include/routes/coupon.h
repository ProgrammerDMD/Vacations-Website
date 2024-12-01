#ifndef COUPON_ROUTE_H
#define COUPON_ROUTE_H

#include <drogon/HttpController.h>

using namespace drogon;

namespace API {
    class Coupon : public HttpController<Coupon> {
    public:
        METHOD_LIST_BEGIN
            ADD_METHOD_TO(Coupon::getCoupon, "/coupon/{1}", Get);
        METHOD_LIST_END

        void getCoupon(
                const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback,
                std::string code);
    };
}

#endif
