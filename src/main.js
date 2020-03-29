var tilesPerRow = 5;
var tileSize = 15;
var barPadding = 20;
var maxValue = 100;
var numVisibleCountries = 10;

var barWidth = (tilesPerRow * tileSize) + barPadding;

let colors = ["#ffd275", "#e8ae68", "#a57f60", "#e3a587", "#e48775", "#b5ead7", "#e2f0cb", "#a7d8cf", "#b5bdc4", "#fdddaa"];

var selectedYear = 2016, selectedMode = "top10";

function initializeData(rawData) {
  let reducedProperties;
  reducedProperties = rawData.map(function(d) {
    return {
      name: d.country,
      year: +d.year,
      age: +d.all
    }
  });

  return reducedProperties;
}

function updateFilteredData() {
  filteredData = data.filter(function(d) {
    return d.year === selectedYear;
  });
  filteredData = _.sortBy(filteredData, function(d) {
    return selectedMode === "top10" ? -d.age : d.age;
  });
  filteredData = filteredData.slice(0, numVisibleCountries);
}

function getTiles(num) {
  var tiles = [];

  for(var i = 0; i < num; i++) {
    var rowNumber = Math.floor(i / tilesPerRow);
    tiles.push({
      x: (i % tilesPerRow) * tileSize,
      y: -(rowNumber + 1) * tileSize
    });
  }

  return tiles
}

function updateBar(d, i) {
  var tiles = getTiles(d.age);

  var u = d3.select(this)
    .attr("transform", "translate(" + i * barWidth + ", 300)")
    .selectAll("rect")
    .data(tiles);

  u.enter()
    .append("rect")
    .style("opacity", 0)
    .style("stroke", "white")
    .style("stroke-width", "0.5")
    .style("shape-rendering", "crispEdges")
    .merge(u)
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y;
    })
    .attr("width", tileSize)
    .attr("height", tileSize)
    .transition()
    .delay(function(d, i) {
      return i * 20;
    })
    .style("opacity", 1);


  u.exit()
    .transition()
    .delay(function(d, i) {
      return (100 - i) * 20;
    })
    .style("opacity", 0)
    .on("end", function() {
      d3.select(this).remove();
    });
}

function updateLabel(d) {
  let texValue = "";
  if(d.year == 2000){
    texValue = 'Global life expectancy : 67.6 years';
  }else if(d.year == 2001){
    texValue = 'Global life expectancy : 68.1 years';
  }else if(d.year == 2002){
    texValue = 'Global life expectancy : 68.3 years';
  }else if(d.year == 2003){
    texValue = 'Global life expectancy : 68.3 years';
  }else if(d.year == 2004){
    texValue = 'Global life expectancy : 68.7 years';
  }else if(d.year == 2005){
    texValue = 'Global life expectancy : 68.9 years';
  }else if(d.year == 2006){
    texValue = 'Global life expectancy : 69.3 years';
  }else if(d.year == 2007){
    texValue = 'Global life expectancy : 69.6 years';
  }else if(d.year == 2008){
    texValue = 'Global life expectancy : 69.9 years';
  }else if(d.year == 2009){
    texValue = 'Global life expectancy : 70.2 years';
  }else if(d.year == 2010){
    texValue = 'Global life expectancy : 70.6 years';
  }else if(d.year == 2011){
    texValue = 'Global life expectancy : 70.9 years';
  }else if(d.year == 2012){
    texValue = 'Global life expectancy : 71.2 years';
  }else if(d.year == 2013){
    texValue = 'Global life expectancy : 71.5 years';
  }else if(d.year == 2014){
    texValue = 'Global life expectancy : 71.7 years';
  }else if(d.year == 2015){
    texValue = 'Global life expectancy : 71.9 years';
  }else if(d.year == 2016){
    texValue = 'Global life expectancy : 72.2 years';
  }
  d3.select(".global").text(texValue);

  var el = d3.select(this)
    .select("text");

  if(el.empty()) {
    el = d3.select(this)
      .append("text")
      .attr("y", -4)
      .attr("transform", "rotate(-90)")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .style("fill", "#777");
  }

  el.text(d.name);
}

function updateBars() {
  var u = d3.select("g.bars")
    .selectAll("g")
    .data(filteredData);

  u.enter()
    .append("g")
    .merge(u)
    .style("fill", function(d, i) {
      return colors[i % colors.length];
    })
    .each(updateBar)
    .each(updateLabel);

  u.exit().remove();
}

function updateAxis() {
  var chartWidth = numVisibleCountries * barWidth;
  var chartHeight = (maxValue / tilesPerRow) * tileSize;

  var yScale = d3.scaleLinear().domain([0, maxValue]).range([chartHeight, 0]);
  var yAxis = d3.axisRight().scale(yScale).tickSize(chartWidth);

  d3.select(".y.axis")
    .call(yAxis);
}

function initialize(rawData) {
  data = initializeData(rawData);

  d3.select("select.mode")
    .on("change", function() {
      selectedMode = this.value;
      update(data);
    })

  d3.select("select.year")
    .on("change", function() {
      selectedYear = +this.value;
      update(data);
    });
    return data;
}

function update(data) {
  updateFilteredData(data);
  updateBars();
  updateAxis();
}

d3.tsv("data/life-expectancy-WHO-2000-2016-simplified.tsv", function(err, tsv) {
  let data = tsv;

  data = initialize(data);
  update(data);
});
