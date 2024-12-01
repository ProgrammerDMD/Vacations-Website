cmake_minimum_required(VERSION 3.29)
project(Backend)

set(CMAKE_CXX_STANDARD 20)

include_directories("include")

add_executable(Backend
        main.cpp
        include/objects/product.h
        include/objects/vacation.h
        include/routes/transaction.h
        include/routes/vacation.h
        include/utils/api_responses.h
        src/objects/product.cpp
        src/routes/vacation.cpp
        src/utils/api_responses.cpp
        src/objects/vacation.cpp
        src/routes/transaction.cpp
        include/objects/coupon.h
        src/objects/coupon.cpp
        include/routes/coupon.h
        src/routes/coupon.cpp
        include/objects/discount.h
        src/objects/discount.cpp
        include/routes/discount.h
        src/routes/discount.cpp
)

find_package(Drogon CONFIG REQUIRED)
find_package(PostgreSQL REQUIRED)

target_link_libraries(Backend PRIVATE
        Drogon::Drogon
        PostgreSQL::PostgreSQL
)
