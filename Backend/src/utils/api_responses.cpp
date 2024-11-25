#include "utils/api_responses.h"

#include <drogon/HttpAppFramework.h>

namespace API {
    drogon::HttpResponsePtr notFound() {
        Json::Value json;
        json["message"] = "The requested object wasn't found!";

        drogon::HttpResponsePtr response = drogon::HttpResponse::newHttpJsonResponse(json);
        return response;
    }

    drogon::HttpResponsePtr emptyResponse() {
        drogon::HttpResponsePtr response = drogon::HttpResponse::newHttpResponse(drogon::HttpStatusCode::k200OK, drogon::ContentType::CT_APPLICATION_JSON);
        response->setBody("{}");
        return response;
    }

    drogon::HttpResponsePtr serverError() {
        return drogon::HttpResponse::newHttpResponse(drogon::HttpStatusCode::k500InternalServerError, drogon::ContentType::CT_APPLICATION_JSON);
    }
}