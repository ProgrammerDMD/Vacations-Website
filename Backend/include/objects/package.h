#ifndef BACKEND_PACKAGE_H
#define BACKEND_PACKAGE_H

#include "room.h"
#include "vacation.h"

namespace Objects {
class Package : public virtual Vacation, public virtual Room {
    protected:
        unsigned int discount;

    public:
        explicit Package(
                const Properties& properties,
                std::string &&location,
                const std::list<Feature>& features,
                unsigned int beds,
                unsigned int discount);

        explicit Package(const drogon::orm::Row& row);

        unsigned int getDiscount();

        Json::Value toJson() override;
    };
}

#endif
