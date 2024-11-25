#ifndef VACATION_H
#define VACATION_H

#include "objects/product.h"

namespace Objects {
    class Vacation : public virtual Product {
    public:
        enum Feature {
            BREAKFAST = 0,
            PRIVATE_PARKING = 1,
            FREE_WIFI = 2,
            PET_FRIENDLY = 3,
            FITNESS_CENTER = 4
        };

    protected:
        std::string location;
        std::list<Feature> features;

    public:
        explicit Vacation(
            const Properties& properties,
            std::string &&location,
            const std::list<Feature>& features);

        explicit Vacation(const drogon::orm::Row& row);

        std::string getLocation();

        std::list<Feature> getFeatures();

        friend std::istream& operator>>(std::istream& istream, std::list<Feature>& features);

        Json::Value toJson() override;
    };
}

#endif
