
import React, { Component } from 'react';
import * as d3 from 'd3';
import data from '../data/csvjson_admit.js';

class D3BarChart3 extends Component {

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

    var margin = { top: 60, right: 20, bottom: 60, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

      var parseTime = d3.timeParse("%Y-%m-%d");
      var formatDate = d3.timeFormat("%b-%d");
      var bisectDate = d3.bisector(function (d) { return d.date; }).left;
     
      console.log(data);
        
      var ndata = d3.nest()                    //Aggregate data according to Admit Date
        .key(function (d) { return(d.AdmitUnit); })
        //.key(function (d) { return(d.AdmitDate); })
        //.sortKeys(d3.ascending)
        .key(function (d) { return d.PatientID; })
        .rollup(function (leaves) { return leaves.length; })
        .entries(data);

      ndata.forEach(function (d) {
       // d.date = formatDate(parseTime(d.key));
        d.date = d.key;  
        d.value = +d.values.length;
        console.log(d.date, d.value);
      });
      console.log(ndata);
    

      const aRef = d3.select(this.myRef.current).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
        .style("background-color", "grey");

      var y= d3.scaleBand()
        .range([height,0])
        .padding(0.2);

      var x = d3.scaleLinear()
                   .range([0,width]);

      var yAxis = g => g
        .attr("transform", `translate(margin.left,0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0));


      var xAxis = g => g
        
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
       // .call(g => g.select(".domain").remove());

      var parseTime = d3.timeParse("%Y-%m-%d");
      var formatDate = d3.timeFormat("%b-%d");
      var bisectDate = d3.bisector(function (d) { return d.date; }).left;


      y.domain(ndata.map(function (d) { return d.date; })).padding(0.2);
      x.domain([0, d3.max(ndata, function (d) { return d.value; })]);

      console.log(x.domain);
      console.log(y.domain);

    aRef.append("g")
        .attr("class", "y axis")
        .attr("transform","rotate(-10)" )
        .call(yAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "translate(10, 10)");

      aRef.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .append("text")
        .attr("transform", "translate(0," + height + ")")
        .attr("x", 2)
        .attr("y", 10)
        .attr("dy", ".71em")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        //.text("Unit")
        
      // Add a Label
      //x-axis & y-axis label
      aRef.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "start")
        .text("Units")
        .attr("transform", "translate(-40, 10) rotate(0)");

        aRef.append("text")
        .attr("class", "x label")
        .attr("transform", "translate(300,"+height-margin.bottom+ ")") 
        .attr("text-anchor", "start")
        //.text("No: of Patients");
        //.attr("transform", "translate(10,"+height-margin.bottom+ ")");  

      //Add Chart title
      aRef.append("text")
        .attr("class", "chart title")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .attr("font-color", "darkblue")
        .text("Total Patient Admissions per Unit")
        .attr("transform", "translate(220, -20) ");

      // Add tooltip  
      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "toolTip")
        .style("position", "absolute")
        .style("font-family", "'Open Sans', sans-serif")
        .style("font-size", "16px")
        .style("z-index", "10")
        .style("visibility", "hidden") ;

        var hover= d3.select("rect")
                  .append("div")
                  .attr("class", "hover");

      aRef.selectAll("rect")
        .data(ndata)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", "green")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.date); })
        .attr("width", function(d) { return x(d.value); })
       .on("mouseover", d => {
          tooltip.style("visibility", "visible").style("color", "orange").style("display", "inline-block").text(d.value);
         
          
        })
              
        .on("mousemove", d => hover.style("fill","orange"))
        .on("mouseout", d =>{ 
          tooltip.style("visibility", "hidden");
         // d3.select(this.rect).attr("fill", "green") 
        })
        
        .on("mousemove", d => tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(d.value));

      //   //d3.selectAll("rect").on("click", d => { d3.select(this).transition().duration(300).style("fill","orange") })  
   
 }


  render() {
    return (
      <div ref={this.myRef} ></div>
    )
  }
};



export default D3BarChart3;

