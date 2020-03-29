
import React, { Component } from 'react';
import * as d3 from 'd3';
import data from '../data/csvjson_admit.js';
import { extent } from "d3";

class ZommArea extends Component {

  constructor(props) {
    super(props)
    this.myRef = React.createRef();
    }

  componentDidMount() {
      this.drawChart();
  }

  componentDidUpdate() {
    this.drawChart()
  }

  drawChart() {

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%Y-%m-%d");
    var bisectDate = d3.bisector(function (d) { return d.date; }).left;

// append the svg object to the body of the page
var svg = d3.select(this.myRef.current)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


  console.log(data);

var ndata = d3.nest()                    //Aggregate data according to Admit Date
.key(function (d) { return d.AdmitDate; })
.sortKeys(d3.ascending)
.key(function (d) { return d.PatientID; })
.rollup(function (leaves) { return leaves.length; })
.entries(data);

ndata.forEach(function (d) {
d.date = parseTime(d.key);
d.value = +d.values.length;
console.log(d.date, d.value);
});

//   // Now I can use this dataset:
//   function(ndata) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(ndata, function(d) { return d.date; }))
      .range([ 0, width ]);
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(ndata, function(d) { return d.value; })]).nice()
      .range([ height, 0 ]);
    var yAxis = svg.append("g")
      .call(d3.axisLeft(y).ticks(6));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the area variable: where both the area and the brush take place
    var area = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Create an area generator
    var areaGenerator = d3.area()
      .x(function(d) { return x(d.date) })
      .y0(y(0))
      .y1(function(d) { return y(d.value) })

    // Add the area
    area.append("path")
      .datum(ndata)
      .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
      .attr("fill", "#69b3a2")
      .attr("fill-opacity", .3)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("d", areaGenerator )

        

    // Add the brushing
    area
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart() {

      // What are the selected boundaries?
      var extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        area.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and area position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      area
          .select('.myArea')
          .transition()
          .duration(1000)
          .attr("d", areaGenerator)
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick",function(){
      x.domain(d3.extent(ndata, function(d) { return d.date; }))
      xAxis.transition().call(d3.axisBottom(x))
      area
        .select('.myArea')
        .transition()
        .attr("d", areaGenerator)
    });

//})
}


render() {
  return (
    <div ref={this.myRef} ></div>
  )
}
};



export default ZommArea;
