'use strict';

(function () {
  const fieldsets = document.querySelectorAll(`fieldset`);
  const mapFilters = document.querySelector(`.map__filters`);
  let serverData;

  const successHandler = function (array) {
    serverData = array;
    if (serverData.length > window.pin.maxSimilar) {
      let copyData = serverData.slice(0, window.pin.maxSimilar);
      window.pin.createPins(copyData);
    } else {
      window.pin.createPins(serverData);
    }
    window.util.setDisable(false, mapFilters);
    window.util.setDisable(false, fieldsets);
  };

  let newData;
  const filterAds = function (data) {
    newData = window.filtration.check(data);
    window.pin.remove();
    window.pin.createPins(newData);
  };

  const changeHousingTypeHandler = function (evt) {
    window.filtration.enabled.type = evt.target.value;
    window.debounce.time(filterAds(serverData));
  };
  const changeHousingPriceHandler = function (evt) {
    window.filtration.enabled.price = evt.target.value;
    window.debounce.time(filterAds(serverData));
  };
  const changeHousingRoomsHandler = function (evt) {
    window.filtration.enabled.rooms = evt.target.value;
    window.debounce.time(filterAds(serverData));
  };
  const changeHousingGuestsHandler = function (evt) {
    window.filtration.enabled.guests = evt.target.value;
    window.debounce.time(filterAds(serverData));
  };
  const clickHousingFeaturesHandler = function (evt) {
    if (evt.target.className === `map__checkbox visually-hidden`) {
      const index = window.filtration.enabled.features.indexOf(evt.target.value);
      if (evt.target.checked) {
        window.filtration.enabled.features.push(evt.target.value);
      } else {
        window.filtration.enabled.features.splice(index, 1);
      }
    }
    window.debounce.time(filterAds(serverData));
  };

  const removeClass = function (element) {
    const pinActive = window.pin.mapAds.querySelector(`.map__pin--active`);
    if (pinActive) {
      pinActive.classList.remove(`map__pin--active`);
    }
    element.classList.add(`map__pin--active`);
  };

  const iconPinClickHandler = function (evt) {
    const mapFiltersContainer = window.pin.map.querySelector(`.map__filters-container`);
    // const allPins = window.pin.mapAds.querySelectorAll(`.map__pin:not(.map__pin--main)`);
    const currentCard = window.pin.map.querySelector(`.map__card`);
    const currentPin = evt.currentTarget;
    const targetValue = evt.currentTarget.dataset.value;
    const index = Number(targetValue);

    if (currentCard && currentCard.dataset.value === targetValue) {
      return;
    }

    window.card.closed();
    window.card.attribute(index);
    removeClass(currentPin);

    const fragmentPopup = document.createDocumentFragment();
    if (typeof newData === `undefined`) {
      fragmentPopup.appendChild(window.card.create(serverData[index]));
    } else {
      fragmentPopup.appendChild(window.card.create(newData[index]));
    }
    window.pin.map.insertBefore(fragmentPopup, mapFiltersContainer);

    const closePopupButton = window.pin.map.querySelector(`.popup__close`);
    const closeClickHandler = function () {
      window.card.closed();
      closePopupButton.removeEventListener(`click`, closeClickHandler);
      closePopupButton.removeEventListener(`keydown`, closeEnterHandler);
      document.removeEventListener(`keydown`, closeEscHandler);
    };

    const closeEnterHandler = function (evtKey) {
      window.card.eventEnter(evtKey, window.card.closed);
      closePopupButton.removeEventListener(`keydown`, closeEnterHandler);
      closePopupButton.removeEventListener(`click`, closeClickHandler);
      document.removeEventListener(`keydown`, closeEscHandler);
    };

    const closeEscHandler = function (evtKey) {
      window.card.escEvent(evtKey, window.card.closed);
      document.removeEventListener(`keydown`, closeEscHandler);
      closePopupButton.removeEventListener(`click`, closeClickHandler);
      closePopupButton.removeEventListener(`keydown`, closeEnterHandler);
    };

    closePopupButton.addEventListener(`click`, closeClickHandler);
    closePopupButton.addEventListener(`keydown`, closeEnterHandler);
    document.addEventListener(`keydown`, closeEscHandler);
  };

  window.map = {
    loading: successHandler,
    iconClick: iconPinClickHandler,
    changeHousingType: changeHousingTypeHandler,
    changePrice: changeHousingPriceHandler,
    changeRooms: changeHousingRoomsHandler,
    changeGuests: changeHousingGuestsHandler,
    changeFeatures: clickHousingFeaturesHandler
  };
})();