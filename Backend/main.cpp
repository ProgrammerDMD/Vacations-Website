#include <drogon/drogon.h>

using namespace drogon;

int main() {
    app().setLogPath("")
        .setLogLevel(trantor::Logger::kDebug)
        .addListener("0.0.0.0", 3001)
        .setThreadNum(4)
        .addDbClient(orm::PostgresConfig("localhost", 5432, "postgres", "postgres", "admin", 4, "default"))
        // .enableRunAsDaemon()
        .run();
    return 0;
}
