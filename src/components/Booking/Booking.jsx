import React, { useState, useEffect } from "react";
import "./Booking.scss";
import axios from "axios";

function Booking({ destinationResult }) {
  //defining restaurant and hotels results
  const [restaurantResults, setRestaurantResults] = useState([]);
  const [hotelResults, setHotelResults] = useState([]);

  //two isloaded states for restaurant and hotels results
  const [isLoadedRestaurants, setIsLoadedRestaurants] = useState(false);
  const [isLoadedHotels, setIsLoadedHotels] = useState(false);

  // defining the options for the request

  //13065 category is for restaurants, 19014 for the hotels, we fetch results for the 5 best rated in a circle of 5km radius around given coordinates

  const restaurantsOptions = {
    method: "GET",

    url: `https://api.foursquare.com/v3/places/search?ll=${destinationResult.coordinates[0]}%2C${destinationResult.coordinates[1]}&radius=5000&categories=13065&fields=rating%2Cdescription%2Clocation%2Cfsq_id%2Cname%2Ctel%2Cphotos%2Cstats&sort=RATING&limit=5`,
    headers: {
      accept: "application/json",
      Authorization: import.meta.env.VITE_APP_FOURSQUARE_API_KEY,
    },
  };

  const hotelsOptions = {
    method: "GET",
    url: `https://api.foursquare.com/v3/places/search?ll=${destinationResult.coordinates[0]}%2C${destinationResult.coordinates[1]}&radius=5000&categories=19014&fields=rating%2Cdescription%2Clocation%2Cfsq_id%2Cname%2Ctel%2Cphotos%2Cstats&sort=RATING&limit=5`,
    headers: {
      accept: "application/json",
      Authorization: import.meta.env.VITE_APP_FOURSQUARE_API_KEY,
    },
  };

  //fetching the results from the API and removing the unicode characters from the address
  useEffect(() => {
    axios
      .request(restaurantsOptions)
      .then(function (response) {
        const temporaryResults = response.data.results.map((restaurant) => {
          // removing
          return {
            ...restaurant,
            location: {
              ...restaurant.location,
              formatted_address: restaurant.location.formatted_address
                .replace(/\\u0026/g, "&")
                .replace(/\\u00e9s/g, "és"),
            },
          };
        });
        console.log(temporaryResults);
        setRestaurantResults(temporaryResults);
        setIsLoadedRestaurants(true);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .request(hotelsOptions)
      .then(function (response) {
        const temporaryResults = response.data.results.map((hotel) => {
          return {
            ...hotel,
            location: {
              ...hotel.location,
              formatted_address: hotel.location.formatted_address
                .replace(/\\u0026/g, "&")
                .replace(/\\u00e9s/g, "és"),
            },
          };
        });
        console.log(temporaryResults);
        setHotelResults(temporaryResults);
        setIsLoadedHotels(true);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  if (isLoadedHotels && isLoadedRestaurants) {
    return (
      <div className="booking-container">
        {restaurantResults && (
          <div className="restaurants">
            <h2>Restaurants</h2>
            <div className="restaurants-list">
              {restaurantResults.map((restaurant) => (
                <div key={restaurant.fsq_id} className="restaurant-displayed">
                  <p>{restaurant.name}</p>
                  <p>
                    {restaurant.location &&
                      restaurant.location.formatted_address}
                  </p>
                  <p>{restaurant.rating}</p>
                  <p>{restaurant.stats && restaurant.stats.total_ratings}</p>
                  {restaurant.photos && restaurant.photos[0] && (
                    <img
                      src={`${restaurant.photos[0].prefix}100x100${restaurant.photos[0].suffix}`}
                      alt="restaurant"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {hotelResults && (
          <div className="hotels">
            <h2>Hotels</h2>
            <div className="hotels-list">
              {hotelResults.map((hotel) => (
                <div key={hotel.fsq_id} className="hotel-displayed">
                  <p>{hotel.name}</p>
                  <p>{hotel.location && hotel.location.formatted_address}</p>
                  <p>{hotel.rating}</p>
                  <p>{hotel.stats && hotel.stats.total_ratings}</p>
                  {hotel.photos && hotel.photos[0] && (
                    <img
                      src={`${hotel.photos[0].prefix}100x100${hotel.photos[0].suffix}`}
                      alt="hotel"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
}

export default Booking;
