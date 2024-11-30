#ifndef API_RESPONSES_H
#define API_RESPONSES_H

#include <drogon/HttpResponse.h>

namespace API {
    drogon::HttpResponsePtr notFound();
    drogon::HttpResponsePtr emptyResponse();
    drogon::HttpResponsePtr serverError();
    drogon::HttpResponsePtr badRequest();
}

#endif