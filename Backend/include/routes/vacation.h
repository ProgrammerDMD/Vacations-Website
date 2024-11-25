#ifndef VACATION_ROUTE_H
#define VACATION_ROUTE_H

#include <drogon/HttpController.h>

using namespace drogon;

namespace API {
    class Vacation : public HttpController<Vacation> {
    public:
        METHOD_LIST_BEGIN
            // REGEX of UUID
            ADD_METHOD_VIA_REGEX(Vacation::getVacationById,
                                 "/vacation/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", Get);

            ADD_METHOD_TO(Vacation::getVacationByQuery,
                          "/vacations", Post);

            ADD_METHOD_TO(Vacation::getVacations,
                          "/vacations", Get);

            ADD_METHOD_TO(Vacation::getTotalPages,
                          "/vacations/pages", Post);
        METHOD_LIST_END

        void getVacationById(
                const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback,
                const std::string &productId);

        void getVacationByQuery(
                const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback);

        void getVacations(
                const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback);

        void getTotalPages(
                const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback);
    };
}

#endif