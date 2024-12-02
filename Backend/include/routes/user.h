#ifndef USER_ROUTE_H
#define USER_ROUTE_H

#include <drogon/HttpController.h>

using namespace drogon;

namespace API {
    class User : public HttpController<User> {
    public:
        METHOD_LIST_BEGIN
            ADD_METHOD_TO(User::createUser, "/users", Post);
            ADD_METHOD_TO(User::login, "/users/login", Post);
        METHOD_LIST_END

        void createUser(
                const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback);

        void login(
                const HttpRequestPtr &req,
                std::function<void(const HttpResponsePtr &)> &&callback);
    };
}

#endif