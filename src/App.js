import "./App.css";
import Header from "./component/fixedHeader";
import InputTag from "./component/inputTag";
import { useState } from "react";
import airplane from "./images/airplane.jpg";
function App() {
  let customJson = require("./json/flight.json");
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [optionDom, setOptionDom] = useState([]);
  const [departDate, setDepartDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [selectType, setSelectType] = useState("oneWay");
  const [filterPrice, setFilterPrice] = useState(50000);

  const getDistance = (
    originCitylatitude,
    originCitylongitude,
    destinationCitylatitude,
    destinationCitylongitude
  ) => {
    let radOCL, radDCL, theta, radtheta, dist;
    if (
      originCitylatitude == destinationCitylatitude &&
      originCitylongitude == destinationCitylongitude
    ) {
      return 0;
    } else {
      radOCL = (Math.PI * originCitylatitude) / 180;
      radDCL = (Math.PI * destinationCitylatitude) / 180;
      theta = originCitylongitude - destinationCitylongitude;
      radtheta = (Math.PI * theta) / 180;
      dist =
        Math.sin(radOCL) * Math.sin(radDCL) +
        Math.cos(radOCL) * Math.cos(radDCL) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;
      return dist;
    }
  };

  const getOptionBody = distance => {
    let optionDom = [];
    originCity != destinationCity ? (
      Object.keys(customJson.flightProvider).map((value, index) => {
        let flightPrice = Math.round(
          distance * customJson.flightProvider[value].ratePerKm
        );
        let departTime = customJson.flightProvider[value].morningDepartTime;
        let nightDepartTime = customJson.flightProvider[value].nightDepartTime;
        let TotalMinute =
          (distance / customJson.flightProvider[value].speedPerHour) * 60;
        let Hour = Math.floor(TotalMinute / 60);
        let Minutes = TotalMinute % 60;
        let arriveTime = `${Hour + departTime}:${Minutes.toFixed()}`;
        let returnArrivedTime = `${Hour +
          nightDepartTime}:${Minutes.toFixed()}`;
        if (flightPrice < filterPrice) {
          optionDom.push(
            <div className="option-container">
              <span className="flight-provider">{value}</span> {"  "}
              <span className="price-container">
                RS.{" "}
                {Math.round(
                  distance * customJson.flightProvider[value].ratePerKm
                )}
                .00
              </span>
              <div className="option-detail">
                <div>
                  {originCity} > {destinationCity}
                </div>
                <div>Distance:- {Math.round(distance)} Km</div>
                <div>AL-202</div>
                <div>Depart:- {departTime} Am</div>
                <div>
                  Arrive:- {arriveTime}
                  {Hour + departTime > 12 ? "PM" : "AM"}
                </div>
              </div>
              {selectType == "Return" && (
                <div className="Return-detail">
                  <div>
                    {destinationCity} > {originCity}
                  </div>
                  <div>Distance:- {Math.round(distance)} Km</div>
                  <div>AL-203</div>
                  <div>Depart:- {nightDepartTime} PM</div>
                  <div>
                    Arrive:- {returnArrivedTime}
                    {Hour + nightDepartTime > 12 ? "PM" : "AM"}
                  </div>
                </div>
              )}
              <div className="flight-image-container">
                <img className="logo" src={airplane} />
                <button onClick={() => alert("flight booked")}>
                  Book This flight
                </button>
              </div>
            </div>
          );
        }
      })
    ) : (
      <div>No flight available</div>
    );
    setOptionDom(optionDom);
  };
  const submit = () => {
    let citys = Object.keys(customJson.city);
    debugger;
    if (
      originCity &&
      destinationCity &&
      citys.includes(originCity) &&
      citys.includes(destinationCity) &&
      departDate
    ) {
      let originCitylatitude = customJson.city[originCity].latitude,
        originCitylongitude = customJson.city[originCity].longitude,
        destinationCitylatitude = customJson.city[destinationCity].latitude,
        destinationCitylongitude = customJson.city[destinationCity].longitude;

      let distance = getDistance(
        originCitylatitude,
        originCitylongitude,
        destinationCitylatitude,
        destinationCitylongitude
      );
      getOptionBody(distance);
    } else {
      alert("please provide valid input.");
    }
  };
  return (
    <div className="App">
      <div>
        <Header />
      </div>
      <div className="tabs">
        <button onClick={() => setSelectType("One Way")}>One Way</button>
        <button onClick={() => setSelectType("Return")}>Return</button>
      </div>
      <div>
        <div className="form-detail">
          <div className="form-inputs">
            <InputTag
              placeholder="enter origin city"
              value={originCity}
              onChange={e => setOriginCity(e.target.value.toLowerCase())}
            />
          </div>
          <div className="form-inputs">
            <InputTag
              placeholder="enter destination city"
              value={destinationCity}
              onChange={e => setDestinationCity(e.target.value.toLowerCase())}
            />
          </div>
          <div className="form-inputs">
            <input
              type="text"
              onFocus={e => (e.target.type = "date")}
              placeholder="depature date"
              onChange={e => setDepartDate(e.target.value)}
            />
          </div>
          {selectType == "Return" && (
            <div className="form-inputs">
              <input
                type="text"
                onFocus={e => (e.target.type = "date")}
                placeholder="return date "
                onChange={e => setReturnDate(e.target.value)}
              />
            </div>
          )}
          <div className="form-inputs">
            {" "}
            <input type="number" placeholder="passengers" />
          </div>

          <div className="form-inputs">
            <button onClick={submit}>submit</button>
          </div>
        </div>
        <div className="filter-price">
          <div>Refine flight search</div>
          <div className="showPrice">
            <span className="lowPrice">10000 Rs</span>
            <span className="maxPrice"> {filterPrice} Rs</span>
          </div>

          <input
            type="range"
            min="10000"
            max="50000"
            className="range-slider"
            value={filterPrice}
            onChange={e => setFilterPrice(e.target.value)}
          />
        </div>
        {optionDom && optionDom.length ? (
          <div className="details-date">
            <span>
              {" "}
              {originCity} > {destinationCity}{" "}
              {selectType == "Return" && `> ${originCity}`}
            </span>
            <span className="dates">
              <div>Depart: {departDate}</div>
              {returnDate && <div>Return: {returnDate}</div>}
            </span>
          </div>
        ) : (
          ""
        )}
        <div className="option-dom">{optionDom}</div>
      </div>
    </div>
  );
}

export default App;
