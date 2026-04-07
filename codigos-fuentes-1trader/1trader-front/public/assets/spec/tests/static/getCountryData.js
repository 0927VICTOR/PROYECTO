"use strict";

describe("getCountriesData: use static method getCountriesData", function () {

  var countryData;

  beforeEach(function () {
    intlSetup();
    countryData = window.intlTelInputGlobals.getCountriesData();
  });

  afterEach(function () {
    intlTeardown();
    countryData = null;
  });

  it("gets the country data object", function () {
    expect(countryData.length).toEqual(totalCountries);
  });

});
