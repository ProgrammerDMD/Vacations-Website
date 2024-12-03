#ifndef ROOM_H
#define ROOM_H

#include "objects/product.h"

namespace Objects {
    class Room : public virtual Product {
    protected:
        unsigned int beds;

    public:
        explicit Room(
                const Properties& properties,
                unsigned int beds);

        explicit Room(const drogon::orm::Row& row);

        unsigned int getBeds();

        Json::Value toJson() override;
    };
}

#endif
