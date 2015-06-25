Package.describe({
  summary: "d3.chart - A framework for creating reusable charts with d3.js, packaged for Meteor",
  version: "0.2.1",
  git: "https://github.com/Agnito/meteor-d3-chart.git",
  name: "agnito:d3-chart"
});

Package.onUse(function (api, where) {
  api.use('d3js:d3@3.5.5', 'client');
  api.addFiles('d3.chart.min.js', 'client');
  api.export('Chart', 'client');
  api.export('Layer', 'client');
});

