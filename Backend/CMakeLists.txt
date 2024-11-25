cmake_minimum_required(VERSION 3.29)
project(Backend)

set(CMAKE_CXX_STANDARD 20)

include_directories("include")

add_executable(Backend
        main.cpp
        src/objects/product.cpp
        src/routes/vacation.cpp
        src/utils/api_responses.cpp
        src/objects/vacation.cpp
)

find_package(Drogon CONFIG REQUIRED)
find_package(PostgreSQL REQUIRED)

target_link_libraries(Backend PRIVATE
        Drogon::Drogon
        PostgreSQL::PostgreSQL
)
