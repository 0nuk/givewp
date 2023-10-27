var cc = DataStudioApp.createCommunityConnector();

function getAuthType() {
  var AuthTypes = cc.AuthType;
  return cc
    .newAuthTypeResponse()
    .setAuthType(AuthTypes.NONE)
    .build();
}

function getConfig(request) {
  var config = cc.getConfig();
  config
      .newTextInput()
      .setId('url')
      .setName('URL:')
      .setPlaceholder('example.com')
  config
      .newTextInput()
      .setId('key')
      .setName('API PUBLIC KEY:')
      .setPlaceholder('KEY')
  config
    .newTextInput()
    .setId('token')
    .setName('API TOKEN:')
    .setPlaceholder('TOKEN')
  config.setDateRangeRequired(true);
  return config.build();
}

function getFields(request) {
  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();
  var types = cc.FieldType;

  fields.newMetric()
    .setId('donations')
    .setName('Donations (Quantity)')
    .setType(types.NUMBER)

  fields.newMetric()
    .setId('earnings')
    .setName('Earnings (EUR)')
    .setType(types.CURRENCY_EUR)

  fields.newDimension()
    .setId('day')
    .setName('Day')
    .setType(types.YEAR_MONTH_DAY);

  return fields;
}

function getSchema(request) {
  var fields = getFields(request).build();
  return { schema: fields };
}

function responseToRows(requestedFields, response) {
  // Transform parsed data and filter for requested fields
  return response.map(function(earnings) {
    var row = [];
    requestedFields.asArray().forEach(function (field) {
      switch (field.getId()) {
        case 'day':
          return row.push(earnings.day);
        case 'earnings':
          return row.push(earnings.earnings);
        case 'donations':
          return row.push(earnings.donations);
        default:
          return row.push('');
      }
    });
    return { values: row };
  });
}

function getData(request) {
  var requestedFieldIds = request.fields.map(function(field) {
    return field.name;
  });
  var requestedFields = getFields().forIds(requestedFieldIds);

  // Fetch and parse data from API
  var url = [
    'https://',
    request.configParams.url,
    '/give-api/v1/stats/?',
    'key=',
    request.configParams.key,
    '&token=',
    request.configParams.token,
    '&date=range',
    '&type=earnings',
    '&startdate=',
    request.dateRange.startDate,
    '&enddate=',
    request.dateRange.endDate,
  ];
  var urlCant = [
    'https://',
    request.configParams.url,
    '/give-api/v1/stats/?',
    'key=',
    request.configParams.key,
    '&token=',
    request.configParams.token,
    '&date=range',
    '&type=donations',
    '&startdate=',
    request.dateRange.startDate,
    '&enddate=',
    request.dateRange.endDate,
  ];
  var responseCant = UrlFetchApp.fetch(urlCant.join(''));
  var response = UrlFetchApp.fetch(url.join(''));
  var parsedResponse = JSON.parse(response);
  var parsedResponseCant = JSON.parse(responseCant);

  const convertedArray = Object.keys(parsedResponse.earnings).map(day => ({
    "earnings": parsedResponse.earnings[day],
    "day": day,
    "donations": parsedResponseCant.sales[day]
}));
  var rows = responseToRows(requestedFields, convertedArray);

  return {
    schema: requestedFields.build(),
    rows: rows
  };
}


